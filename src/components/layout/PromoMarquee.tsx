export const PromoMarquee = () => {
  const promoText = "GET 4+ PACKS 25% OFF • DISCOUNT CODE: BUNDLE • ";
  const repeatedText = Array(10).fill(promoText).join("");

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
