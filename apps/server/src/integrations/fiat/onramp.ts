export const initiateOnramp = async (
  amountFiat: number,
  currency: 'INR' | 'USD',
  destinationWallet: string
) => {
  console.log(`Initiating onramp: ${amountFiat} ${currency} -> USDC for ${destinationWallet}`);
  // Integration with providers like Onmeta, Transak, or Stripe would go here
  return {
    status: 'PENDING',
    providerReference: 'ONRAMP_REF_' + Math.random().toString(36).substring(7),
  };
};
