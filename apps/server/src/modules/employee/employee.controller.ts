import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../../middleware/auth';
import { logger } from '../../lib/logger';

const router = Router();
const prisma = new PrismaClient();

// Get all employees for the organization
router.get('/list', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(employees);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch employees');
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new employee
router.post('/add', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, email, walletAddress, region, salary } = req.body;
    
    const employee = await prisma.employee.create({
      data: { name, email, walletAddress, region, salary: parseFloat(salary) || 0 },
    });
    
    res.status(201).json(employee);
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to add employee');
    res.status(400).json({ error: 'Could not create employee (check unique constraints)' });
  }
});

export default router;
