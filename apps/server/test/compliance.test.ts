import { calculateTaxForRegion } from '../src/modules/compliance/compliance.service';

describe('Compliance Rules Engine', () => {
  it('should calculate correct tax for India (IN)', async () => {
    const amount = 1000;
    const result = await calculateTaxForRegion(amount, 'IN');
    
    expect(result.totalTax).toBe(270); // 15% + 12%
    expect(result.breakdown).toContainEqual({ type: 'Income Tax', amount: 150 });
    expect(result.breakdown).toContainEqual({ type: 'Provident Fund', amount: 120 });
  });

  it('should calculate correct tax for US', async () => {
    const amount = 1000;
    const result = await calculateTaxForRegion(amount, 'US');
    
    expect(result.totalTax).toBe(160); // 10% + 6%
  });

  it('should fallback to default tax for unknown regions', async () => {
    const amount = 1000;
    const result = await calculateTaxForRegion(amount, 'UK');
    
    expect(result.totalTax).toBe(100); // 10%
  });
});
