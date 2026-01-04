import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
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
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={node.title}
            className="product-image w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
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
