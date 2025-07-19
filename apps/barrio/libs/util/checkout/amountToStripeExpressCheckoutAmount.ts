export const amountToStripeExpressCheckoutAmount = (amount: number) => {
  return (amount ?? 0) * 100;
};
