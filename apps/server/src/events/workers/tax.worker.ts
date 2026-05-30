import { Worker, Job } from 'bullmq';
import { logger } from '../../lib/logger';
import { yieldQueue, publishEvent } from '../queue';
import { PrismaClient } from '@prisma/client';
import { calculateTaxForRegion } from '../../modules/compliance/compliance.service';

const prisma = new PrismaClient();
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const taxWorker = new Worker(
  'tax',
  async (job: Job) => {
    const { payrollRecordId } = job.data;
    logger.info({ payrollRecordId }, 'Processing tax calculation job');

    try {
      const record = await prisma.payrollRecord.findUnique({
        where: { id: payrollRecordId },
        include: { employee: true },
      });

      if (!record) throw new Error('Record not found');

      // 1. Calculate Tax using employee region
      const region = record.employee.region || 'IN';
      const taxResult = await calculateTaxForRegion(record.amount, region);

      // 2. Save Tax Deductions
      for (const deduction of taxResult.breakdown) {
        await prisma.taxDeduction.create({
          data: {
            payrollRecordId,
            type: deduction.type,
            amount: deduction.amount,
          },
        });
      }

      await prisma.payrollRecord.update({
        where: { id: payrollRecordId },
        data: { status: 'TAX_WITHHELD' },
      });

      // 3. Trigger Yield Engine
      await publishEvent(yieldQueue, 'allocate.yield', {
        payrollRecordId,
        taxAmount: taxResult.totalTax,
      });

      logger.info({ payrollRecordId }, 'Tax withholding completed and yield event emitted');

    } catch (error: any) {
      logger.error({ error: error.message, payrollRecordId }, 'Tax worker failed');
      throw error;
    }
  },
  { connection }
);
