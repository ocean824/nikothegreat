import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

const SampleKits = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Filter by product type "Sample Kit" or fetch all and filter client-side
        const data = await fetchProducts(50, "product_type:Sample Kit");
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
          <h1 className="text-3xl font-bold text-foreground mb-4">Sample Kits</h1>
          <p className="text-muted-foreground text-lg">
            Premium sample packs with loops, melodies, and textures
          </p>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </section>
    </Layout>
  );
};

export default SampleKits;
