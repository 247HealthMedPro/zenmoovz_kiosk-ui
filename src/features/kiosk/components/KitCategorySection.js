"use client";

import { motion } from "framer-motion";
import { KitProductCard } from "@/features/kiosk/components/KitProductCard";
import { formatCategoryLabel } from "@/lib/utils/kitCategoryFormat";

export function KitCategorySection({ categoryBlock, motionProps }) {
  const products = categoryBlock?.topProducts ?? [];
  if (!products.length) return null;

  return (
    <motion.section
      {...motionProps}
      className="overflow-hidden rounded-kiosk border border-border bg-surface shadow-kiosk-soft"
    >
      <div className="border-b border-border bg-surface-subtle px-4 py-3 sm:px-6">
        <h2 className="font-sora text-xl font-bold text-brand">
          {formatCategoryLabel(categoryBlock.category)}
        </h2>
        <p className="font-outfit text-xs text-text-muted">
          {products.length} recommendation{products.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="divide-y divide-border">
        {products.map((product, i) => (
          <KitProductCard
            key={product.productCode ?? `${categoryBlock.category}-${i}`}
            product={product}
            rankIndex={i}
          />
        ))}
      </div>
    </motion.section>
  );
}
