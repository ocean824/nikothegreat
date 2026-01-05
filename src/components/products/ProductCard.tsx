import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";
import { useState, memo } from "react";

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCardComponent = ({ product }: ProductCardProps) => {
  const { node } = product;
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = node.images?.edges?.[0]?.node?.url;
  const price = parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2);
  const originalPrice = (parseFloat(node.priceRange.minVariantPrice.amount) + 5).toFixed(2);
  const productType = node.productType || "Sample Kit";

  return (
    <Link
      to={`/product/${node.handle}`}
      className="product-card group block bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:neon-border-glow transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        {imageUrl && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted to-primary/10">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
              </div>
            )}
            <img
              src={imageUrl}
              alt={node.title}
              loading="eager"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`product-image w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        )}
        {!imageUrl && (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {productType}
        </p>
        <h3 className="font-semibold text-foreground mb-2 truncate">
          {node.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-red-500 uppercase">Sale</span>
          <p className="text-lg font-bold text-primary neon-glow-sm">
            ${price}
          </p>
          <p className="text-sm text-muted-foreground line-through">
            ${originalPrice}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const ProductCard = memo(ProductCardComponent);
