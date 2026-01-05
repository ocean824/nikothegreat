import { useState, memo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, ShoppingCart, Youtube, Mail, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/sample-kits", label: "Sample Kits" },
  { to: "/midi-kits", label: "MIDI Kits" },
  { to: "/terms", label: "Terms" },
  { to: "/credits", label: "Credits" },
  { to: "/contact", label: "Contact" },
];

const SocialLinks = memo(({ iconSize = "h-4 w-4" }: { iconSize?: string }) => (
  <>
    <a
      href="https://www.instagram.com/1.nikothegreat/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground hover:text-primary transition-colors"
    >
      <Instagram className={iconSize} />
    </a>
    <a
      href="https://x.com/1NikoTheGreat"
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground hover:text-primary transition-colors"
    >
      <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
    <a
      href="https://www.youtube.com/@NikoTheGreat"
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground hover:text-primary transition-colors"
    >
      <Youtube className={iconSize} />
    </a>
    <a
      href="mailto:nikothegreatbeatz@gmail.com"
      className="text-foreground hover:text-primary transition-colors"
    >
      <Mail className={iconSize} />
    </a>
  </>
));

SocialLinks.displayName = "SocialLinks";

export const Header = memo(() => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);
  const openCart = useCallback(() => setOpen(true), [setOpen]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left side: Logo + Navigation */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
            {/* Logo */}
            <Link to="/" className="font-pixel text-primary text-xs sm:text-sm tracking-wider neon-glow whitespace-nowrap flex-shrink-0">
              NIKO THE GREAT
            </Link>

            {/* Navigation - show on sm and up (640px+, covers landscape phones) */}
            <nav className="hidden sm:flex items-center gap-2 md:gap-4 lg:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-xs md:text-sm whitespace-nowrap transition-colors hover:text-primary relative group ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                  <span 
                    className={`absolute -bottom-0.5 left-0 h-[2px] bg-primary transition-all duration-300 ${
                      location.pathname === link.to 
                        ? "w-full" 
                        : "w-0 group-hover:w-full"
                    }`} 
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side: Social + Account + Cart */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
            {/* Social icons - visible on sm and up */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3 lg:gap-4">
              <SocialLinks iconSize="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
            
            <Link
              to="/account"
              className="text-foreground hover:text-primary transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {totalItems}
                </Badge>
              )}
            </Button>
            
            {/* Mobile menu button - portrait only (under 640px) */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden h-9 w-9"
              onClick={toggleMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - portrait only (under 640px) */}
        {mobileMenuOpen && (
          <nav className="sm:hidden mt-4 pb-2 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={`text-sm transition-colors hover:text-primary py-2 ${
                    location.pathname === link.to
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Social links in mobile menu */}
              <div className="flex items-center gap-4 pt-3 border-t border-border mt-2">
                <SocialLinks iconSize="h-5 w-5" />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";
