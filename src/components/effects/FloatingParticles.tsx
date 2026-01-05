import { memo, useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const FloatingParticlesComponent = () => {
  const particles = useMemo(() => {
    const particleCount = 40; // Increased from 20
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1, // Slightly larger
        duration: Math.random() * 25 + 12,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.5 + 0.15,
      });
    }

    return newParticles;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-primary animate-float will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 3}px hsl(142 71% 45% / 0.6)`,
          }}
        />
      ))}
    </div>
  );
};

export const FloatingParticles = memo(FloatingParticlesComponent);
