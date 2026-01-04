import { Link, useLocation } from "react-router-dom";
import { Instagram, ShoppingCart, Youtube, Mail } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const location = useLocation();
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { to: "/sample-kits", label: "Sample Kits" },
    { to: "/drum-kits", label: "Drum Kits" },
    { to: "/midi-kits", label: "MIDI Kits" },
    { to: "/terms", label: "Terms" },
    { to: "/credits", label: "Credits" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-pixel text-primary text-lg tracking-wider neon-glow-sm">
            NIKO
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors hover:text-primary ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/1.nikothegreat/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/1NikoTheGreat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@NikoTheGreat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="mailto:nikothegreatbeatz@gmail.com"
              className="text-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
