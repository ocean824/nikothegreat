import { ReactNode } from "react";
import { PromoMarquee } from "./PromoMarquee";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WelcomePopup } from "@/components/WelcomePopup";
import { AbandonedCartPopup } from "@/components/AbandonedCartPopup";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

interface LayoutProps {
  children: ReactNode;
  showMarquee?: boolean;
}

export const Layout = ({ children, showMarquee = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showMarquee && <PromoMarquee />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WelcomePopup />
      <AbandonedCartPopup />
      <ExitIntentPopup />
    </div>
  );
};
