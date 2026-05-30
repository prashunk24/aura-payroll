import { PrismaClient } from '@prisma/client';
import { payrollQueue, publishEvent } from '../../events/queue';
import { logger } from '../../lib/logger';
import { createPayrollTransaction } from '../../solana/payrollProgram';

const prisma = new PrismaClient();

export const preparePayrollBatch = async (employerWallet: string, employeeIds: string[]) => {
  logger.info({ employerWallet, employeeIds }, 'Preparing payroll batch');

  const employees = await prisma.employee.findMany({
    where: { id: { in: employeeIds } },
  });

  const transactions = await Promise.all(
    employees.map(async (emp) => {
      const amount = emp.salary > 0 ? emp.salary : 1000; // Use actual salary, fallback to 1000 for legacy seeded data
      // Very basic mock calculation based on region for preview purposes
      let taxRate = 0.18; 
      if (emp.region === 'US') taxRate = 0.25;
      if (emp.region === 'UK') taxRate = 0.20;
      
      const taxAmount = amount * taxRate;
      
      const txBase64 = await createPayrollTransaction(
        employerWallet,
        emp.walletAddress,
        amount,
        taxAmount
      );

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        amount,
        taxAmount,
        transaction: txBase64,
      };
    })
  );

  return transactions;
};

export const runPayroll = async (
  employerId: string, 
  employeeId: string, 
  amount: number,
  signature: string
) => {
  logger.info({ employerId, employeeId, amount, signature }, 'Running payroll for employee');

  const record = await prisma.payrollRecord.create({
    data: {
      employeeId,
      amount,
      status: 'INITIATED',
      transactionHash: signature,
    },
  });

  await publishEvent(payrollQueue, 'process.payroll', {
    payrollRecordId: record.id,
    employerId,
    transactionSignature: signature,
  });

  return record;
};
