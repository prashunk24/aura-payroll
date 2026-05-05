import { logger } from '../../lib/logger';

export type YieldStrategy = 'STABLE' | 'MODERATE' | 'AGGRESSIVE';

export interface StrategyRules {
  region: string;
  minYield: number;
  maxRisk: number;
}

export const getStrategyForEmployer = async (employerId: string): Promise<YieldStrategy> => {
  logger.info({ employerId }, 'Determining yield strategy for employer');
  // In a real app, fetch this from the database based on employer settings/compliance
  return 'STABLE';
};

export const evaluateAllocation = (strategy: YieldStrategy, amount: number) => {
  logger.info({ strategy, amount }, 'Evaluating fund allocation');
  switch (strategy) {
    case 'AGGRESSIVE':
      return { protocol: 'Marginfi', riskScore: 8 };
    case 'MODERATE':
      return { protocol: 'Kamino', riskScore: 5 };
    case 'STABLE':
    default:
      return { protocol: 'Solend', riskScore: 2 };
  }
};
