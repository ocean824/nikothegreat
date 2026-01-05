import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import heroBanner from "@/assets/hero-banner.png";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(50);
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
      {/* Hero Section */}
      <section className="relative">
        <img
          src={heroBanner}
          alt="Niko The Great - Producer & Sound Designer"
          className="w-full h-auto object-cover"
        />
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <span className="text-primary neon-glow">Sample Kits</span>,{" "}
            <span className="text-primary neon-glow">Midi Kits</span>,{" "}
            <span className="text-primary neon-glow">Loops</span>, &{" "}
            <span className="text-primary neon-glow">Compositions</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            All original, handcrafted by Niko The Great for your next hit!
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">All Products</h2>
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
