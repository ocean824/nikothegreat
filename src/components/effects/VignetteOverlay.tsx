export const VignetteOverlay = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, hsl(0 0% 0% / 0.4) 100%)`,
      }}
    />
  );
};
