import { useState, useEffect, useRef, useCallback } from 'react';
import { getClientLogos, type LogoMetadata } from '@/utils/getClientLogos';
import './LogoCarousel.css';

export interface LogoCarouselProps {
  /** Animation speed in pixels per second (default: 60) */
  speed?: number;
  /** Gap between logos in rem (default: 2) */
  gap?: number;
  /** Duplicate track for seamless loop (default: true) */
  duplicateTrack?: boolean;
  /** Pause animation on hover (default: true) */
  pauseOnHover?: boolean;
  /** Fallback behavior for reduced motion: 'static' or 'paged' (default: 'static') */
  reduceMotionFallback?: 'static' | 'paged';
}

export default function LogoCarousel({
  speed = 60,
  gap = 2,
  duplicateTrack = true,
  pauseOnHover = true,
  reduceMotionFallback = 'static',
}: LogoCarouselProps) {
  const [logos, setLogos] = useState<LogoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Load logos on mount
  useEffect(() => {
    getClientLogos().then(loadedLogos => {
      setLogos(loadedLogos);
      setIsLoading(false);
    });
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver to pause when offscreen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Toggle pause/play
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      togglePause();
    }
  }, [togglePause]);

  // Calculate animation duration based on speed
  const animationDuration = trackRef.current
    ? (trackRef.current.scrollWidth / 2 / speed).toFixed(2)
    : '30';

  // Empty state
  if (!isLoading && logos.length === 0) {
    return (
      <div
        className="logo-carousel-empty"
        role="status"
        aria-live="polite"
        data-testid="logo-carousel-empty"
      >
        <p>No client logos available</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="logo-carousel-loading" role="status" aria-live="polite">
        <p>Loading logos...</p>
      </div>
    );
  }

  const shouldAnimate = !prefersReducedMotion && isVisible && !isPaused;
  const displayLogos = duplicateTrack ? [...logos, ...logos] : logos;
  
  // Determine CSS class based on reduced motion preference and fallback
  const reducedMotionClass = prefersReducedMotion 
    ? (reduceMotionFallback === 'paged' ? 'logo-carousel--reduced-motion-paged' : 'logo-carousel--reduced-motion-static')
    : '';

  return (
    <div
      ref={containerRef}
      className={`logo-carousel ${reducedMotionClass} ${shouldAnimate ? '' : 'logo-carousel--paused'}`}
      style={{
        '--logo-gap': `${gap}rem`,
        '--animation-duration': `${animationDuration}s`,
      } as React.CSSProperties}
      data-testid="logo-carousel"
    >
      {/* Play/Pause control */}
      <div className="logo-carousel-controls">
        <button
          onClick={togglePause}
          onKeyDown={handleKeyDown}
          aria-pressed={isPaused}
          aria-controls="logo-carousel-track"
          aria-label={isPaused ? 'Resume logo carousel' : 'Pause logo carousel'}
          className="logo-carousel-control-button"
          data-testid="button-carousel-toggle"
        >
          {isPaused ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M3 2l10 6-10 6V2z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M5 2h2v12H5V2zm4 0h2v12H9V2z" />
            </svg>
          )}
          <span className="sr-only">{isPaused ? 'Play' : 'Pause'}</span>
        </button>
      </div>

      <div
        className={`logo-carousel-viewport ${pauseOnHover ? 'logo-carousel-viewport--hoverable' : ''}`}
        role="region"
        aria-label="Client logos"
      >
        <div
          id="logo-carousel-track"
          ref={trackRef}
          className="logo-carousel-track"
          role="list"
        >
          {displayLogos.map((logo, index) => {
            const LogoWrapper = logo.linkUrl ? 'a' : 'div';
            const wrapperProps = logo.linkUrl
              ? {
                  href: logo.linkUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  'aria-label': `Visit ${logo.alt} website`,
                }
              : {};

            return (
              <div
                key={`${logo.filename}-${index}`}
                className="logo-carousel-item"
                role="listitem"
              >
                <LogoWrapper
                  {...wrapperProps}
                  className="logo-carousel-logo-wrapper"
                  tabIndex={0}
                  data-testid={`logo-item-${index}`}
                >
                  <img
                    src={logo.imageUrl}
                    alt={logo.alt}
                    className="logo-carousel-logo"
                    loading="lazy"
                    decoding="async"
                  />
                </LogoWrapper>
              </div>
            );
          })}
        </div>

        {/* Duplicate track for seamless loop */}
        {duplicateTrack && (
          <div
            className="logo-carousel-track logo-carousel-track--duplicate"
            role="presentation"
            aria-hidden="true"
          >
            {displayLogos.map((logo, index) => (
              <div
                key={`duplicate-${logo.filename}-${index}`}
                className="logo-carousel-item"
              >
                <div className="logo-carousel-logo-wrapper">
                  <img
                    src={logo.imageUrl}
                    alt=""
                    className="logo-carousel-logo"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isPaused ? 'Logo carousel paused' : 'Logo carousel playing'}
      </div>
    </div>
  );
}
