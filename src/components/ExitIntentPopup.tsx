import { useState, useEffect, useCallback } from "react";
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
import { Gift, X } from "lucide-react";

export const ExitIntentPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0) {
      const hasSeenExitPopup = sessionStorage.getItem("niko-exit-popup-seen");
      if (!hasSeenExitPopup) {
        setOpen(true);
        sessionStorage.setItem("niko-exit-popup-seen", "true");
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email || phone) {
      toast.success("You're in! 🎉", {
        description: "Check your inbox for your exclusive discount code.",
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-primary/50 bg-card">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Gift className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="text-primary neon-glow-sm">Wait!</span> Before You Go...
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Get an exclusive <span className="text-primary font-semibold">10% OFF</span> your 
            first order when you join our list. Don't miss out on premium sounds!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
          />
          <Input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-background"
          />
          <Button type="submit" className="w-full neon-glow-sm" size="lg">
            Claim My 10% Off
          </Button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            No thanks, I'll pay full price
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};