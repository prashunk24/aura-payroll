import { Worker, Job } from 'bullmq';
import { logger } from '../../lib/logger';
import { taxQueue, publishEvent } from '../queue';
import { PrismaClient } from '@prisma/client';
import { validatePayrollRecord } from '../../modules/compliance/compliance.service';
import { confirmTransaction } from '../../solana/payrollProgram';

const prisma = new PrismaClient();
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const payrollWorker = new Worker(
  'payroll',
  async (job: Job) => {
    const { payrollRecordId, employerId, transactionSignature } = job.data;
    
    // Idempotency: Check if already processed
    const existingRecord = await prisma.payrollRecord.findUnique({
      where: { id: payrollRecordId },
    });

    if (existingRecord?.status === 'PROCESSED' || existingRecord?.status === 'TAX_WITHHELD') {
      logger.info({ payrollRecordId }, 'Payroll already processed, skipping');
      return;
    }

    logger.info({ payrollRecordId, employerId, transactionSignature }, 'Processing payroll execution');

    try {
      // 1. Validation (Database record check)
      if (!existingRecord) throw new Error(`Record ${payrollRecordId} not found`);

      // 2. On-Chain Confirmation
      if (transactionSignature) {
        logger.info({ transactionSignature }, 'Confirming on-chain transaction');
        const isConfirmed = await confirmTransaction(transactionSignature);
        
        if (!isConfirmed) {
          throw new Error(`Transaction ${transactionSignature} failed to confirm`);
        }

        await prisma.payrollRecord.update({
          where: { id: payrollRecordId },
          data: { 
            status: 'PROCESSED',
            transactionHash: transactionSignature,
            paidAt: new Date(),
          },
        });
      }

      // 3. Emit next event for tax withholding & yield
      await publishEvent(taxQueue, 'calculate.tax', { 
        payrollRecordId, 
        employerId,
      });

      logger.info({ payrollRecordId }, 'Payroll cycle: PROCESSED -> TAX_WITHHELD event emitted');

    } catch (error: any) {
      logger.error({ error: error.message, payrollRecordId }, 'Payroll worker execution failed');
      
      // Update state to allow for manual retry or compensation
      await prisma.payrollRecord.update({
        where: { id: payrollRecordId },
        data: { status: 'FAILED_EXECUTION' },
      });
      
      throw error;
    }
  },
  { connection }
);
