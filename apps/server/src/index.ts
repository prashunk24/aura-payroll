import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './modules/auth/auth.controller';
import payrollRouter from './modules/payroll/payroll.controller';
import { logger } from './lib/logger';

// Import workers to initialize them
import './events/workers';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/payroll', payrollRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Basic error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({ error: err.message, stack: err.stack }, 'Unhandle error');
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info(`Aura Payroll Backend listening at http://localhost:${port}`);
});
