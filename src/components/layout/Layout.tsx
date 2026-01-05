import { ReactNode } from "react";
import { PromoMarquee } from "./PromoMarquee";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WelcomePopup } from "@/components/WelcomePopup";
import { AbandonedCartPopup } from "@/components/AbandonedCartPopup";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { FloatingParticles } from "@/components/effects/FloatingParticles";
import { FilmGrain } from "@/components/effects/FilmGrain";
import { VignetteOverlay } from "@/components/effects/VignetteOverlay";

interface LayoutProps {
  children: ReactNode;
  showMarquee?: boolean;
  hideNewsletter?: boolean;
}

export const Layout = ({ children, showMarquee = true, hideNewsletter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background vintage-filter relative">
      <FloatingParticles />
      <VignetteOverlay />
      <FilmGrain />
      {showMarquee && <PromoMarquee />}
      <Header />
      <main className="flex-1 relative z-10 light-leak">{children}</main>
      <Footer hideNewsletter={hideNewsletter} />
      <CartDrawer />
      <WelcomePopup />
      <AbandonedCartPopup />
      <ExitIntentPopup />
    </div>
  );
};
