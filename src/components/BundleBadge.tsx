import React from "react";
import { Package } from "lucide-react";

// Shared visual marker so a bundle line reads as "this is a bundle" the same
// way in Cart, Checkout, Orders, and Order History — not just in the cart.
const BundleBadge: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${className}`}
  >
    <Package size={10} />
    Paket
  </span>
);

export default BundleBadge;
