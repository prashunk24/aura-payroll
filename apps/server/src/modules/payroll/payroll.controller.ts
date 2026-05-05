import { Router } from 'express';
import { runPayroll } from './payroll.service';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { logger } from '../../lib/logger';

const router = Router();

router.post('/run', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { employeeId, amount } = req.body;
    const employerId = req.user?.walletAddress;

    if (!employeeId || !amount || !employerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await runPayroll(employerId, employeeId, amount);
    res.json(result);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to run payroll');
    res.status(500).json({ error: 'Failed to initiate payroll' });
  }
});

router.get('/list', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const records = await prisma.payrollRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { employee: true }
    });
    res.json(records);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch payroll list');
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

export default router;
