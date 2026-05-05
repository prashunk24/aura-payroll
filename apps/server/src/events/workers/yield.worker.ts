import { Worker, Job } from 'bullmq';
import { logger } from '../../lib/logger';
import { PrismaClient } from '@prisma/client';
import { getStrategyForEmployer, evaluateAllocation } from '../../modules/strategy/strategy.service';

const prisma = new PrismaClient();
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const yieldWorker = new Worker(
  'yield',
  async (job: Job) => {
    const { payrollRecordId, taxAmount } = job.data;
    logger.info({ payrollRecordId, taxAmount }, 'Processing yield allocation job');

    try {
      // 1. Get Strategy (Hardcoded employer for now)
      const strategy = await getStrategyForEmployer('SYSTEM_ADMIN');
      const allocation = evaluateAllocation(strategy, taxAmount);

      // 2. Create Yield Position
      await prisma.yieldPosition.create({
        data: {
          payrollRecordId,
          protocol: allocation.protocol,
          allocatedAmount: taxAmount,
          status: 'ACTIVE',
        },
      });

      // 3. Update Record State
      await prisma.payrollRecord.update({
        where: { id: payrollRecordId },
        data: { status: 'YIELD_ACTIVE' },
      });

      logger.info(
        { payrollRecordId, protocol: allocation.protocol },
        'Yield allocation active in protocol'
      );

    } catch (error: any) {
      logger.error({ error: error.message, payrollRecordId }, 'Yield worker failed');
      throw error;
    }
  },
  { connection }
);
