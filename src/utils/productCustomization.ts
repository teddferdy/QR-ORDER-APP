import type { Product } from "../types";

// Neither BE-POS-App (product.options/modifiers are freeform JSONB with no
// required/optional flag — verified in db/models/product.js and
// api/validation/schemas.js) nor FE-POS-App's product form distinguish
// required vs. optional choices. The only safe, backend-supported rule is:
// if a product has ANY size/spiciness/add-on choice at all, it must go
// through the customization flow rather than being quick-added bare.
export function hasCustomizationOptions(product: Product): boolean {
  return Boolean(
    (product.sizes && product.sizes.length > 0) ||
      (product.spicinessLevels && product.spicinessLevels.length > 0) ||
      (product.addOns && product.addOns.length > 0) ||
      (product.optionGroups && product.optionGroups.length > 0),
  );
}
