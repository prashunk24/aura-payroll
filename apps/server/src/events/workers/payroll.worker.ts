import { Worker, Job } from 'bullmq';
import { logger } from '../../lib/logger';
import { taxQueue, publishEvent } from '../queue';
import { PrismaClient } from '@prisma/client';
import { validatePayrollRecord } from '../../modules/compliance/compliance.service';

const prisma = new PrismaClient();
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const payrollWorker = new Worker(
  'payroll',
  async (job: Job) => {
    const { payrollRecordId, employerId } = job.data;
    logger.info({ payrollRecordId, employerId }, 'Processing payroll job');

    try {
      const record = await prisma.payrollRecord.findUnique({
        where: { id: payrollRecordId },
        include: { employee: true },
      });

      if (!record) {
        throw new Error(`Payroll record ${payrollRecordId} not found`);
      }

      // 1. Validation Phase
      const isValid = await validatePayrollRecord(record);
      if (!isValid) {
        await prisma.payrollRecord.update({
          where: { id: payrollRecordId },
          data: { status: 'FAILED_VALIDATION' },
        });
        return;
      }

      await prisma.payrollRecord.update({
        where: { id: payrollRecordId },
        data: { status: 'VALIDATED' },
      });

      // 2. Execution Phase (Simulating Solana distribution)
      logger.info({ payrollRecordId }, 'Distributing net salary on-chain');
      const txHash = 'SIMULATED_TX_' + Math.random().toString(36).substring(7);

      await prisma.payrollRecord.update({
        where: { id: payrollRecordId },
        data: { 
          status: 'PROCESSED',
          transactionHash: txHash,
          paidAt: new Date(),
        },
      });

      // 3. Emit next event for tax withholding
      await publishEvent(taxQueue, 'calculate.tax', { 
        payrollRecordId, 
        employerId,
        region: 'IN' // Placeholder
      });

      logger.info({ payrollRecordId }, 'Payroll distribution completed and tax event emitted');

    } catch (error: any) {
      logger.error({ error: error.message, payrollRecordId }, 'Payroll worker failed');
      await prisma.payrollRecord.update({
        where: { id: payrollRecordId },
        data: { status: 'FAILED_EXECUTION' },
      });
      throw error;
    }
  },
  { connection }
);

payrollWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Payroll job completed successfully');
});

payrollWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err.message }, 'Payroll job failed');
});
