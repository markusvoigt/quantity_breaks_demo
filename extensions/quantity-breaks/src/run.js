// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const discounts = [];
  const targets = input.cart.lines.forEach((line) => {
    const variant = line.merchandise;
    const quantityBreaks = JSON.parse(
      line.merchandise?.product.metafield?.value ?? "{}"
    );
    const target = {
      productVariant: {
        id: variant.id,
      },
    };
    const currentAmount = line.quantity;
    var priceReduction = 0;
    for (var i = 0; i < quantityBreaks.length; i++) {
      console.log(quantityBreaks[i][0] + " " + quantityBreaks[i][1]);
      if (line.quantity >= quantityBreaks[i][0])
        priceReduction =
          line.cost.amountPerQuantity.amount - quantityBreaks[i][1];
    }
    const discount = {
      targets: target,
      message: `Quantity break`,
      value: {
        fixedAmount: {
          amount: priceReduction,
          appliesToEachItem: true,
        },
      },
    };
    if (priceReduction > 0) discounts.push(discount);
  });

  return {
    discounts: discounts,
    discountApplicationStrategy: "ALL",
  };
}
