import { PrismaClient } from '@prisma/client';
import { payrollQueue, publishEvent } from '../../events/queue';
import { logger } from '../../lib/logger';

const prisma = new PrismaClient();

export const runPayroll = async (employerId: string, employeeId: string, amount: number) => {
  logger.info({ employerId, employeeId, amount }, 'Initiating payroll run');

  // 1. Create Initial Record in DB
  const record = await prisma.payrollRecord.create({
    data: {
      employeeId,
      amount,
      status: 'INITIATED',
    },
  });

  // 2. Publish Event to start the async chain
  await publishEvent(payrollQueue, 'process.payroll', {
    payrollRecordId: record.id,
    employerId,
  });

  return record;
};
