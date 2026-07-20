export const SHIPPING_CENTS = 9500;
export const FREE_SHIPPING_THRESHOLD_CENTS = 200000;
export const DISCOUNT_ORDER_THRESHOLD_CENTS = 100000;
export const DISCOUNT_RATE = 0.05;

export function calculatePricing({
  subtotalCents,
  isMemberDiscountEligible,
}: {
  subtotalCents: number;
  isMemberDiscountEligible: boolean;
}) {
  // Only one perk ever applies per order: orders big enough for free shipping
  // get free shipping (and nothing else); otherwise a 5% discount applies if
  // the order clears the lower threshold or the customer is an opted-in
  // member.
  const freeShipping = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const discountApplied =
    !freeShipping &&
    (isMemberDiscountEligible || subtotalCents >= DISCOUNT_ORDER_THRESHOLD_CENTS);
  const discountCents = discountApplied
    ? Math.round(subtotalCents * DISCOUNT_RATE)
    : 0;
  const shippingCents = freeShipping ? 0 : SHIPPING_CENTS;
  const totalCents = subtotalCents - discountCents + shippingCents;

  return {
    subtotalCents,
    discountCents,
    discountApplied,
    shippingCents,
    freeShipping,
    totalCents,
  };
}
