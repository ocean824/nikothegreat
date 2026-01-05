import { memo } from "react";
import { ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ShopifyProduct[];
  isLoading?: boolean;
}

const ProductSkeleton = memo(() => (
  <div className="bg-card rounded-lg overflow-hidden border border-border">
    <div className="aspect-square bg-muted relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
    </div>
    <div className="p-4 space-y-3">
      <div className="h-3 bg-muted rounded w-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
      </div>
      <div className="h-4 bg-muted rounded w-3/4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 bg-muted rounded w-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
        </div>
        <div className="h-5 bg-primary/20 rounded w-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
        </div>
        <div className="h-4 bg-muted rounded w-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  </div>
));

ProductSkeleton.displayName = "ProductSkeleton";

export const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground mb-2">No products found</p>
        <p className="text-muted-foreground">
          Products will appear here once you add them. Tell me what products you'd like to create!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {products.map((product) => (
        <ProductCard key={product.node.id} product={product} />
      ))}
    </div>
  );
};
