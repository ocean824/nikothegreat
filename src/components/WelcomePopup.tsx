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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X, Sparkles } from "lucide-react";

export const WelcomePopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem("niko-welcome-popup-seen");
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email || phone) {
      localStorage.setItem("niko-welcome-popup-seen", "true");
      toast.success("Welcome to the family! 🎉", {
        description: "Check your inbox for exclusive drops and discounts.",
      });
      setOpen(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem("niko-welcome-popup-seen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-primary/50 bg-card">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="text-primary neon-glow-sm">NEW YEAR SALE</span>
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Join the list for exclusive drops, early access, and special discounts. 
            Get <span className="text-primary font-semibold">25% OFF 3+ kits</span> or{" "}
            <span className="text-primary font-semibold">50% OFF 5+ kits</span>!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="popup-email">Email</Label>
            <Input
              id="popup-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="popup-phone">Phone (optional)</Label>
            <Input
              id="popup-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-background"
            />
          </div>

          <Button type="submit" className="w-full neon-glow-sm" size="lg">
            Unlock My Discount
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By subscribing, you agree to receive marketing messages. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};