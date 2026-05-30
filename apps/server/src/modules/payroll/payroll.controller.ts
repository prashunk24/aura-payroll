import { Router } from 'express';
import * as payrollService from './payroll.service';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { logger } from '../../lib/logger';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/prepare-batch', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const employerId = req.user?.walletAddress;
    const { employeeIds } = req.query;

    if (!employerId || !employeeIds) {
      return res.status(400).json({ error: 'Missing employer ID or employee IDs' });
    }

    const ids = (employeeIds as string).split(',');
    const batch = await payrollService.preparePayrollBatch(employerId, ids);
    
    res.json(batch);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to prepare payroll batch');
    res.status(500).json({ error: 'Failed to prepare batch' });
  }
});

router.post('/run', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { employeeId, amount, signature } = req.body;
    const employerId = req.user?.walletAddress;

    if (!employeeId || !amount || !employerId || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const record = await payrollService.runPayroll(employerId, employeeId, parseFloat(amount), signature);
    res.json(record);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to run payroll');
    res.status(500).json({ error: 'Failed to initiate payroll processing' });
  }
});

router.get('/list', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const records = await prisma.payrollRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { employee: true }
    });
    res.json(records);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch payroll list');
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

export default router;
