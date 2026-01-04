import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (data?.variants?.edges?.[0]) {
          setSelectedVariantId(data.variants.edges[0].node.id);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const selectedVariant = product?.variants?.edges?.find(
    (v) => v.node.id === selectedVariantId
  )?.node;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success("Added to cart!", {
      description: `${product.title} has been added to your cart.`,
    });
    setCartOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-8 bg-muted rounded w-32" />
                <div className="h-12 bg-muted rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to store
          </Link>
        </div>
      </Layout>
    );
  }

  const imageUrl = product.images?.edges?.[0]?.node?.url;
  const price = parseFloat(selectedVariant?.price?.amount || "0").toFixed(2);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-card rounded-lg overflow-hidden border border-border">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.productType || "Sample Kit"}
              </p>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-primary">${price}</p>
            </div>

            {/* Variant Selection */}
            {product.options && product.options.length > 0 && product.options[0].values.length > 1 && (
              <div className="space-y-3">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <Label className="text-sm text-foreground mb-2 block">{option.name}</Label>
                    <div className="flex gap-2 flex-wrap">
                      {product.variants.edges.map((variant) => {
                        const variantOption = variant.node.selectedOptions.find(
                          (o) => o.name === option.name
                        );
                        if (!variantOption) return null;
                        
                        return (
                          <Button
                            key={variant.node.id}
                            variant={selectedVariantId === variant.node.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedVariantId(variant.node.id)}
                            className="min-w-[60px]"
                          >
                            {variantOption.value}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Add missing Label import
import { Label } from "@/components/ui/label";

export default ProductDetail;
