import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchProductByHandle, fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, ShoppingCart, Plus, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { AudioWaveform } from "@/components/AudioWaveform";

// Audio preview mapping by product handle
const audioPreviewMap: Record<string, string> = {
  "abstract-minds-vol-1": "/audio/abstract-minds-vol-1.mp3",
  "black-friday-vol-1": "/audio/black-friday-vol-1.mp3",
  "the-feels-vol-1": "/audio/the-feels-vol-1.mp3",
  "gray-area-vol-1": "/audio/gray-area-vol-1.mp3",
  "haze-midi-phrases-vol-1": "/audio/haze-midi-kit.mp3",
  "mana-vol-1": "/audio/mana-vol-1.mp3",
  "stained-glass-vol-1": "/audio/stained-glass-vol-1.mp3",
  "stained-glass-vol-2": "/audio/stained-glass-vol-2.mp3",
  "unrequited-love-vol-1": "/audio/unrequited-love-vol-1.mp3",
  "vibrant-darkness-vol-1": "/audio/vibrant-darkness-vol-1.mp3",
};

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [bundleItems, setBundleItems] = useState<Set<string>>(new Set());
  const [bundleVariants, setBundleVariants] = useState<Record<string, string>>({}); // productId -> variantId
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingHandle, setPlayingHandle] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);

  const audioSrc = handle ? audioPreviewMap[handle] : null;

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
        // Prefer same product type, but fallback to any products if none match
        let related = allProducts.filter(
          (p) => p.node.handle !== handle && p.node.productType === data?.productType
        ).slice(0, 3);
        
        // If no products of same type, show other products
        if (related.length === 0) {
          related = allProducts.filter((p) => p.node.handle !== handle).slice(0, 3);
        }
        setRelatedProducts(related);
        
        // Pre-select current product in bundle and set default variants
        if (data?.id) {
          setBundleItems(new Set([data.id]));
          
          // Initialize bundle variants with first variant for each related product
          const initialVariants: Record<string, string> = {};
          related.forEach((p) => {
            const firstVariant = p.node.variants?.edges?.[0]?.node;
            if (firstVariant) {
              initialVariants[p.node.id] = firstVariant.id;
            }
          });
          setBundleVariants(initialVariants);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = (audioHandle?: string) => {
    const targetHandle = audioHandle || handle;
    const targetSrc = targetHandle ? audioPreviewMap[targetHandle] : null;
    if (!targetSrc) return;

    // If clicking a different audio, stop current and play new
    if (playingHandle && playingHandle !== targetHandle) {
      audioRef.current?.pause();
      audioRef.current = new Audio(targetSrc);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayingHandle(null);
      };
      audioRef.current.play();
      setIsPlaying(true);
      setPlayingHandle(targetHandle);
      return;
    }

    if (!audioRef.current || playingHandle !== targetHandle) {
      audioRef.current = new Audio(targetSrc);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayingHandle(null);
      };
    }

    if (isPlaying && playingHandle === targetHandle) {
      audioRef.current.pause();
      setIsPlaying(false);
      setPlayingHandle(null);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setPlayingHandle(targetHandle);
    }
  };

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
    
    // Add related products with their selected variants
    relatedProducts.forEach((p) => {
      if (bundleItems.has(p.node.id)) {
        const selectedVariantId = bundleVariants[p.node.id];
        const variant = p.node.variants?.edges?.find(v => v.node.id === selectedVariantId)?.node;
        total += parseFloat(variant?.price?.amount || p.node.priceRange?.minVariantPrice?.amount || "0");
      }
    });
    
    return total;
  };

  const getBundleOriginalTotal = () => {
    return getBundleTotal();
  };

  const getBundleDiscount = () => {
    const itemCount = bundleItems.size;
    if (itemCount >= 4) return 0.20; // 20% off bundles of 4+
    if (itemCount >= 3) return 0.15; // 15% off bundles of 3+
    if (itemCount >= 2) return 0.10; // 10% off bundles of 2+
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

    // Add related products with their selected variants
    relatedProducts.forEach((p) => {
      if (bundleItems.has(p.node.id)) {
        const selectedVariantId = bundleVariants[p.node.id];
        const variant = p.node.variants?.edges?.find(v => v.node.id === selectedVariantId)?.node 
          || p.node.variants?.edges?.[0]?.node;
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
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Product Image */}
          <div className="aspect-square bg-card rounded-lg overflow-hidden border border-border max-w-[500px] mx-auto lg:mx-0">
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
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {product.productType || "Sample Kit"}
              </p>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-primary neon-glow-sm">${price}</p>
            </div>

            {/* Audio Preview */}
            {audioSrc && (
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleAudio()}
                    className="h-10 w-10 rounded-full flex-shrink-0"
                  >
                    {isPlaying && playingHandle === handle ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Preview</p>
                    <AudioWaveform 
                      audioSrc={audioSrc}
                      audioRef={audioRef} 
                      isPlaying={isPlaying && playingHandle === handle}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variant Selection */}
            {product.variants?.edges && product.variants.edges.length > 1 && (
              <div className="space-y-2">
                <Label className="text-xs text-foreground">Format</Label>
                <div className="flex gap-1.5 flex-wrap">
                  {product.variants.edges.map((variant) => (
                    <Button
                      key={variant.node.id}
                      variant={selectedVariantId === variant.node.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVariantId(variant.node.id)}
                      className="h-8 text-xs"
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
              size="default"
              disabled={!selectedVariant}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>

            {/* Bundle Upsell */}
            {relatedProducts.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Create Your Own Bundle
                </h3>
                
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  {/* Current Product */}
                  <div className="w-14 h-14 rounded overflow-hidden border border-border flex-shrink-0">
                    {imageUrl && (
                      <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  {relatedProducts.map((p) => (
                    <div key={p.node.id} className="flex items-center gap-1.5">
                      <Plus className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <div className="w-14 h-14 rounded overflow-hidden border border-border flex-shrink-0">
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
                  
                  <div className="ml-auto text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-primary neon-glow-sm">
                      ${getBundleDiscountedTotal().toFixed(2)}
                      {getBundleDiscount() > 0 && (
                        <span className="text-muted-foreground line-through text-xs ml-1.5">
                          ${getBundleTotal().toFixed(2)}
                        </span>
                      )}
                    </p>
                    {getBundleDiscount() > 0 && (
                      <p className="text-xs text-primary font-medium">
                        Save {Math.round(getBundleDiscount() * 100)}%
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleAddBundleToCart}
                  variant="outline"
                  className="w-full mb-3"
                  size="default"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ADD TO CART
                </Button>

                <div className="space-y-2">
                  {/* Current Product */}
                  <div className="flex items-center gap-2 p-2 bg-card rounded border border-border">
                    <Checkbox
                      id={`bundle-${product.id}`}
                      checked={bundleItems.has(product.id)}
                      onCheckedChange={() => toggleBundleItem(product.id)}
                      disabled
                      className="h-4 w-4"
                    />
                    {audioSrc && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleAudio()}
                        className="h-8 w-8 rounded-full flex-shrink-0"
                      >
                        {isPlaying && playingHandle === handle ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3 ml-0.5" />
                        )}
                      </Button>
                    )}
                    <div className="w-10 h-10 rounded overflow-hidden border border-border flex-shrink-0">
                      {imageUrl && (
                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs">
                          <span className="text-muted-foreground">This item: </span>
                          <span className="text-primary font-medium">{product.title}</span>
                        </span>
                        <span className="font-semibold text-xs flex-shrink-0">${price}</span>
                      </div>
                      {product.variants?.edges && product.variants.edges.length > 1 && (
                        <div className="flex gap-1 mt-1">
                          {product.variants.edges.map((variant) => (
                            <Button
                              key={variant.node.id}
                              variant={selectedVariantId === variant.node.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedVariantId(variant.node.id)}
                              className="h-5 text-[10px] px-1.5"
                            >
                              {variant.node.title}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related Products */}
                  {relatedProducts.map((p) => {
                    const selectedBundleVariantId = bundleVariants[p.node.id];
                    const selectedBundleVariant = p.node.variants?.edges?.find(v => v.node.id === selectedBundleVariantId)?.node;
                    const relatedPrice = parseFloat(selectedBundleVariant?.price?.amount || p.node.priceRange?.minVariantPrice?.amount || "0").toFixed(2);
                    const hasVariants = p.node.variants?.edges && p.node.variants.edges.length > 1;
                    const relatedImageUrl = p.node.images?.edges?.[0]?.node?.url;
                    const relatedAudioSrc = audioPreviewMap[p.node.handle];
                    
                    return (
                      <div key={p.node.id} className="flex items-center gap-2 p-2 bg-card rounded border border-border">
                        <Checkbox
                          id={`bundle-${p.node.id}`}
                          checked={bundleItems.has(p.node.id)}
                          onCheckedChange={() => toggleBundleItem(p.node.id)}
                          className="h-4 w-4"
                        />
                        {relatedAudioSrc && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleAudio(p.node.handle)}
                            className="h-8 w-8 rounded-full flex-shrink-0"
                          >
                            {isPlaying && playingHandle === p.node.handle ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3 ml-0.5" />
                            )}
                          </Button>
                        )}
                        <div className="w-10 h-10 rounded overflow-hidden border border-border flex-shrink-0">
                          {relatedImageUrl && (
                            <img src={relatedImageUrl} alt={p.node.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground text-xs">{p.node.title}</span>
                            <span className="font-semibold text-xs flex-shrink-0">${relatedPrice}</span>
                          </div>
                          {hasVariants && (
                            <div className="flex gap-1 mt-1">
                              {p.node.variants.edges.map((variant) => (
                                <Button
                                  key={variant.node.id}
                                  variant={selectedBundleVariantId === variant.node.id ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => {
                                    setBundleVariants(prev => ({ ...prev, [p.node.id]: variant.node.id }));
                                    if (!bundleItems.has(p.node.id)) {
                                      setBundleItems(prev => new Set([...prev, p.node.id]));
                                    }
                                  }}
                                  className="h-5 text-[10px] px-1.5"
                                >
                                  {variant.node.title}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;