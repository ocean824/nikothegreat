import { useState, useEffect, memo } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackToTopComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border-primary/50 bg-card/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:neon-box-glow hover:border-primary ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5 text-primary" />
    </Button>
  );
};

export const BackToTop = memo(BackToTopComponent);
