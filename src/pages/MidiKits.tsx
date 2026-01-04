import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

const MidiKits = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(50, "product_type:MIDI Kit");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            <span className="text-primary neon-glow-sm">MIDI Kits</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Premium MIDI packs with melodies, chord progressions, and phrases
          </p>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </section>
    </Layout>
  );
};

export default MidiKits;