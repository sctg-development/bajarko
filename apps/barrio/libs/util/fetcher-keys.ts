export const FetcherCartKeyPrefix = 'cart:';

export const FetcherKeys = {
  cart: {
    accountDetails: `${FetcherCartKeyPrefix}account-details`,
    removePromotionCode: `${FetcherCartKeyPrefix}remove-promotion-code`,
    createLineItem: `${FetcherCartKeyPrefix}create-line-item`,
    removeLineItem: `${FetcherCartKeyPrefix}remove-line-item`,
    updateLineItem: `${FetcherCartKeyPrefix}update-line-item`,
    addShippingMethods: `${FetcherCartKeyPrefix}add-shipping-methods`,
    completeCheckout: `${FetcherCartKeyPrefix}complete-checkout`,
  },
};
