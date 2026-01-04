export const PromoMarquee = () => {
  const promoText = "🎆 NEW YEAR LAUNCH SALE • 25% OFF 3+ KITS (CODE: NEWYEAR25) • 50% OFF 5+ KITS (CODE: NEWYEAR50) • 🎆 ";
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
