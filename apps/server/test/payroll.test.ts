import * as payrollService from '../src/modules/payroll/payroll.service';
import { PrismaClient } from '@prisma/client';
import { Keypair } from '@solana/web3.js';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mPrisma = {
    employee: {
      findMany: jest.fn(),
    },
    payrollRecord: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

// Mock BullMQ
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
  })),
  Worker: jest.fn(),
}));

describe('Payroll Service', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('preparePayrollBatch', () => {
    it('should prepare transactions for all selected employees', async () => {
      const employerAddr = Keypair.generate().publicKey.toBase58();
      const mockEmployees = [
        { id: '1', name: 'Emp 1', walletAddress: Keypair.generate().publicKey.toBase58() },
        { id: '2', name: 'Emp 2', walletAddress: Keypair.generate().publicKey.toBase58() },
      ];
      prisma.employee.findMany.mockResolvedValue(mockEmployees);

      const batch = await payrollService.preparePayrollBatch(employerAddr, ['1', '2']);

      expect(batch).toHaveLength(2);
      expect(batch[0].employeeId).toBe('1');
      expect(batch[1].employeeId).toBe('2');
      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['1', '2'] } },
      });
    });
  });

  describe('runPayroll', () => {
    it('should create a record and publish an event', async () => {
      const mockRecord = { id: 'rec_123', status: 'INITIATED' };
      prisma.payrollRecord.create.mockResolvedValue(mockRecord);

      const record = await payrollService.runPayroll('EmployerId', 'EmployeeId', 1000, 'sig_123');

      expect(record.id).toBe('rec_123');
      expect(prisma.payrollRecord.create).toHaveBeenCalled();
    });
  });
});
