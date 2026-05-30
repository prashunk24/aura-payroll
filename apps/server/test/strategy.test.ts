import { evaluateAllocation, getStrategyForEmployer } from '../src/modules/strategy/strategy.service';

describe('Strategy Service', () => {
  describe('evaluateAllocation', () => {
    it('should return Marginfi for AGGRESSIVE strategy', () => {
      const result = evaluateAllocation('AGGRESSIVE', 1000);
      expect(result.protocol).toBe('Marginfi');
      expect(result.riskScore).toBe(8);
    });

    it('should return Kamino for MODERATE strategy', () => {
      const result = evaluateAllocation('MODERATE', 1000);
      expect(result.protocol).toBe('Kamino');
      expect(result.riskScore).toBe(5);
    });

    it('should return Solend for STABLE strategy', () => {
      const result = evaluateAllocation('STABLE', 1000);
      expect(result.protocol).toBe('Solend');
      expect(result.riskScore).toBe(2);
    });

    it('should default to Solend for unknown strategies', () => {
      // @ts-ignore
      const result = evaluateAllocation('UNKNOWN', 1000);
      expect(result.protocol).toBe('Solend');
    });
  });

  describe('getStrategyForEmployer', () => {
    it('should return STABLE for any employer (mocked)', async () => {
      const strategy = await getStrategyForEmployer('any-id');
      expect(strategy).toBe('STABLE');
    });
  });
});
