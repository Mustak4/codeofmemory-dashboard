import { useState, useEffect, useRef, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallback?: string;
}

const LazyImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fallback,
  ...props
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(priority ? src : null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted/30 animate-pulse" aria-hidden="true" />
      )}
    </div>
  );
};

export default LazyImage;

