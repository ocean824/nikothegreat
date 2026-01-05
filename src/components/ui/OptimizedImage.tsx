import { useState, useRef, useEffect, memo } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
}

const OptimizedImageComponent = ({ 
  src, 
  alt, 
  className = "", 
  placeholderClassName = "" 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${placeholderClassName}`}>
      {/* Blur placeholder */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-muted to-primary/10 transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      </div>

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        />
      )}
    </div>
  );
};

export const OptimizedImage = memo(OptimizedImageComponent);
