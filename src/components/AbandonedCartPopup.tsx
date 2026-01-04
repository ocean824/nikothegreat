import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShoppingCart, Gift } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export const AbandonedCartPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const items = useCartStore((state) => state.items);
  const setCartOpen = useCartStore((state) => state.setOpen);

  useEffect(() => {
    // Only trigger if there are items in cart
    if (items.length === 0) return;

    const hasSeenAbandonPopup = sessionStorage.getItem("niko-abandon-popup-seen");
    if (hasSeenAbandonPopup) return;

    // Show popup after 60 seconds of inactivity with items in cart
    let timeout: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("niko-abandon-popup-seen", "true");
      }, 60000); // 60 seconds
    };

    // Track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [items.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("We'll remind you about your cart!", {
        description: "Check your inbox for a special discount.",
      });
      setOpen(false);
    }
  };

  const handleViewCart = () => {
    setOpen(false);
    setCartOpen(true);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-primary/50 bg-card">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Don't Forget Your Cart!
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            You have {totalItems} item{totalItems !== 1 ? "s" : ""} waiting for you. 
            Complete your order now and save with our New Year sale!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Button onClick={handleViewCart} className="w-full neon-glow-sm" size="lg">
            <ShoppingCart className="h-4 w-4 mr-2" />
            View My Cart
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or save for later</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
              required
            />
            <Button type="submit" variant="outline" className="w-full">
              <Gift className="h-4 w-4 mr-2" />
              Email Me a Reminder + Discount
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};