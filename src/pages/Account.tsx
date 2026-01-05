import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, LogOut, Package, Download, Loader2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface PurchaseItem {
  id: string;
  product_title: string;
  product_handle: string | null;
  variant_title: string | null;
  quantity: number;
  price: number;
  download_url: string | null;
}

interface Purchase {
  id: string;
  shopify_order_number: string | null;
  order_date: string;
  total_amount: number;
  currency: string;
  status: string;
  purchase_items: PurchaseItem[];
}

const Account = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        // Defer data fetching
        setTimeout(() => {
          fetchPurchases();
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          id,
          shopify_order_number,
          order_date,
          total_amount,
          currency,
          status,
          purchase_items (
            id,
            product_title,
            product_handle,
            variant_title,
            quantity,
            price,
            download_url
          )
        `)
        .order('order_date', { ascending: false });

      if (error) {
        console.error('Error fetching purchases:', error);
        return;
      }

      setPurchases(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleDownload = (downloadUrl: string | null, productTitle: string) => {
    if (!downloadUrl) {
      toast.error("Download not available yet", {
        description: "Please contact support if you need assistance.",
      });
      return;
    }
    
    // Open download in new tab
    window.open(downloadUrl, '_blank');
    toast.success(`Starting download: ${productTitle}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Loading your purchases...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Account</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>

        {/* Purchases */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">My Purchases</h2>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-4">
                When you make a purchase, it will appear here. Make sure you're using the same email you used at checkout.
              </p>
              <Button onClick={() => navigate("/")}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Order </span>
                        <span className="font-semibold">#{purchase.shopify_order_number}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {new Date(purchase.order_date).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-primary">
                          ${purchase.total_amount?.toFixed(2)} {purchase.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-border">
                    {purchase.purchase_items?.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {item.product_title}
                          </h4>
                          {item.variant_title && (
                            <p className="text-sm text-muted-foreground">{item.variant_title}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price?.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(item.download_url, item.product_title)}
                          className="flex-shrink-0"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Account;