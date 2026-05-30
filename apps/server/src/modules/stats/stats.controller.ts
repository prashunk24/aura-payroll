import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { logger } from '../../lib/logger';

const router = Router();
const prisma = new PrismaClient();

router.get('/overview', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const totalEmployees = await prisma.employee.count();
    const payrollRecords = await prisma.payrollRecord.findMany();
    
    const totalPayroll = payrollRecords.reduce((acc, curr) => acc + curr.amount, 0);
    const totalTaxWithheld = await prisma.taxDeduction.aggregate({
      _sum: { amount: true }
    });

    res.json({
      totalPayroll,
      totalEmployees,
      totalTaxWithheld: totalTaxWithheld._sum.amount || 0,
      activeYield: totalTaxWithheld._sum.amount ? totalTaxWithheld._sum.amount * 0.05 : 0, // Simulated 5% yield
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch stats');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
