import { memo } from "react";

const VignetteOverlayComponent = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-40"
      aria-hidden="true"
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, transparent 60%, hsl(0 0% 0% / 0.3) 100%)`,
      }}
    />
  );
};

export const VignetteOverlay = memo(VignetteOverlayComponent);
