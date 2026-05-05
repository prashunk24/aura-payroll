import { Queue, ConnectionOptions } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const payrollQueue = new Queue('payroll', { connection });
export const taxQueue = new Queue('tax', { connection });
export const yieldQueue = new Queue('yield', { connection });

export const publishEvent = async (queue: Queue, name: string, data: any) => {
  await queue.add(name, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
};
