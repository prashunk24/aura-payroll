export type PayrollState = 
  | 'INITIATED'
  | 'VALIDATED'
  | 'PROCESSED'
  | 'TAX_WITHHELD'
  | 'YIELD_ACTIVE'
  | 'WITHDRAWN'
  | 'FAILED_VALIDATION'
  | 'FAILED_EXECUTION';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  amount: number;
  currency: string;
  status: PayrollState;
  transactionHash?: string;
  timestamp: number;
}

export interface TaxCalculationResult {
  totalTax: number;
  breakdown: {
    type: string;
    amount: number;
  }[];
}
