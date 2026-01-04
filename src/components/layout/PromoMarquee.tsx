export const PromoMarquee = () => {
  const promoText = "🎆 NEW YEAR LAUNCH SALE • UP TO 50% OFF BUNDLES • SIGN UP FOR EXCLUSIVE CODES • 🎆 ";
  const repeatedText = Array(8).fill(promoText).join("");

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-sm font-medium tracking-wide">
          {repeatedText}
        </span>
        <span className="text-sm font-medium tracking-wide">
          {repeatedText}
        </span>
      </div>
    </div>
  );
};