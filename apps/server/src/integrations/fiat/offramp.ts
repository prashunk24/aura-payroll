export const initiateOfframp = async (
  amountUSDC: number,
  targetCurrency: 'INR' | 'USD',
  bankDetails: any
) => {
  console.log(`Initiating offramp: ${amountUSDC} USDC -> ${targetCurrency}`);
  // Integration with offramp providers would go here
  return {
    status: 'PENDING',
    providerReference: 'OFFRAMP_REF_' + Math.random().toString(36).substring(7),
  };
};
