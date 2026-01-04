import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchProductByHandle, fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, ShoppingCart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [bundleItems, setBundleItems] = useState<Set<string>>(new Set());
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

        // Fetch related products for bundle upsell
        const allProducts = await fetchProducts(12);
        const related = allProducts.filter(
          (p) => p.node.handle !== handle && p.node.productType === data?.productType
        ).slice(0, 3);
        setRelatedProducts(related);
        
        // Pre-select current product in bundle
        if (data?.id) {
          setBundleItems(new Set([data.id]));
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

  const toggleBundleItem = (productId: string) => {
    const newItems = new Set(bundleItems);
    if (newItems.has(productId)) {
      // Don't allow unchecking the current product
      if (productId !== product?.id) {
        newItems.delete(productId);
      }
    } else {
      newItems.add(productId);
    }
    setBundleItems(newItems);
  };

  const getBundleTotal = () => {
    let total = 0;
    
    // Add current product
    if (product && bundleItems.has(product.id)) {
      total += parseFloat(selectedVariant?.price?.amount || "0");
    }
    
    // Add related products
    relatedProducts.forEach((p) => {
      if (bundleItems.has(p.node.id)) {
        total += parseFloat(p.node.priceRange?.minVariantPrice?.amount || "0");
      }
    });
    
    return total;
  };

  const getBundleOriginalTotal = () => {
    return getBundleTotal(); // Could add original prices here for strikethrough
  };

  const getBundleDiscount = () => {
    const itemCount = bundleItems.size;
    if (itemCount >= 3) return 0.10; // 10% off bundles of 3+
    return 0;
  };

  const getBundleDiscountedTotal = () => {
    const total = getBundleTotal();
    const discount = getBundleDiscount();
    return total * (1 - discount);
  };

  const handleAddBundleToCart = () => {
    if (!product || !selectedVariant) return;

    // Add current product
    if (bundleItems.has(product.id)) {
      addItem({
        product: { node: product },
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        price: selectedVariant.price,
        quantity: 1,
        selectedOptions: selectedVariant.selectedOptions,
      });
    }

    // Add related products
    relatedProducts.forEach((p) => {
      if (bundleItems.has(p.node.id)) {
        const variant = p.node.variants?.edges?.[0]?.node;
        if (variant) {
          addItem({
            product: p,
            variantId: variant.id,
            variantTitle: variant.title,
            price: variant.price,
            quantity: 1,
            selectedOptions: variant.selectedOptions || [],
          });
        }
      }
    });

    toast.success("Bundle added to cart!", {
      description: `${bundleItems.size} items have been added to your cart.`,
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
              <p className="text-3xl font-bold text-primary neon-glow-sm">${price}</p>
            </div>

            {/* Variant Selection */}
            {product.variants?.edges && product.variants.edges.length > 1 && (
              <div className="space-y-3">
                <Label className="text-sm text-foreground">Format</Label>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.edges.map((variant) => (
                    <Button
                      key={variant.node.id}
                      variant={selectedVariantId === variant.node.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVariantId(variant.node.id)}
                      className="min-w-[80px]"
                    >
                      {variant.node.title}
                    </Button>
                  ))}
                </div>
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

            {/* Bundle Upsell */}
            {relatedProducts.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  Trending Packs...
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  {/* Current Product */}
                  <div className="w-20 h-20 rounded overflow-hidden border border-border">
                    {imageUrl && (
                      <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  {relatedProducts.map((p, index) => (
                    <div key={p.node.id} className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      <div className="w-20 h-20 rounded overflow-hidden border border-border">
                        {p.node.images?.edges?.[0]?.node?.url && (
                          <img
                            src={p.node.images.edges[0].node.url}
                            alt={p.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="ml-4 text-right">
                    <p className="text-muted-foreground text-sm">Total price</p>
                    <p className="text-xl font-bold text-primary neon-glow-sm">
                      ${getBundleDiscountedTotal().toFixed(2)}
                      {getBundleDiscount() > 0 && (
                        <span className="text-muted-foreground line-through text-sm ml-2">
                          ${getBundleTotal().toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleAddBundleToCart}
                  variant="outline"
                  className="w-full mb-4"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ADD TO CART
                </Button>

                <div className="space-y-3">
                  {/* Current Product Checkbox */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`bundle-${product.id}`}
                      checked={bundleItems.has(product.id)}
                      onCheckedChange={() => toggleBundleItem(product.id)}
                      disabled
                    />
                    <label htmlFor={`bundle-${product.id}`} className="flex-1 text-sm">
                      <span className="font-medium">This item: </span>
                      <span className="text-primary">{product.title}</span>
                      <span className="ml-2 font-semibold">${price}</span>
                    </label>
                  </div>

                  {/* Related Products Checkboxes */}
                  {relatedProducts.map((p) => {
                    const relatedPrice = parseFloat(p.node.priceRange?.minVariantPrice?.amount || "0").toFixed(2);
                    return (
                      <div key={p.node.id} className="flex items-center gap-3">
                        <Checkbox
                          id={`bundle-${p.node.id}`}
                          checked={bundleItems.has(p.node.id)}
                          onCheckedChange={() => toggleBundleItem(p.node.id)}
                        />
                        <label htmlFor={`bundle-${p.node.id}`} className="flex-1 text-sm">
                          <span className="text-muted-foreground">{p.node.title}</span>
                          <span className="ml-2 font-semibold">${relatedPrice}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

export default ProductDetail;