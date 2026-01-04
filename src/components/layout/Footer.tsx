import { useState } from "react";
import { Instagram, Mail, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email || phone) {
      toast.success("Thanks for subscribing!", {
        description: "You'll receive updates on new releases and exclusive offers.",
      });
      setEmail("");
      setPhone("");
    }
  };

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="max-w-md mx-auto text-center mb-10">
          <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Get notified about new releases, sample packs, and exclusive content.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button type="submit" className="w-full neon-glow-sm">
              Subscribe
            </Button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          {/* Logo */}
          <div className="font-pixel text-primary text-sm tracking-[0.3em] neon-glow-sm">
            NIKO THE GREAT
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/1.nikothegreat/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/1NikoTheGreat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@NikoTheGreat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="mailto:nikothegreatbeatz@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © 2026 Niko The Great. All rights reserved.
        </div>
      </div>
    </footer>
  );
};