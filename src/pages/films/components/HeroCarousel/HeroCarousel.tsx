import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  img: string;
  title?: string;
  subtitle?: string;
};

type Props = {
  items?: Item[];
  intervalMs?: number;
  fadeMs?: number;
  className?: string;
};

export default function HeroCarousel({
  items = [],
  intervalMs = 5000,
  fadeMs = 700,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const safeIndex = index >= items.length ? 0 : index;

  const prefersReducedMotion = useMemo(() => {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    if (!paused && items.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % items.length);
      }, Math.max(500, intervalMs));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [paused, intervalMs, items.length, prefersReducedMotion]);


  if (!items || items.length === 0) return null;

  const go = (i: number) => setIndex(i % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <section
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative w-full h-[55vh] md:h-[70vh]">
        {items.map((it, i) => {
          const active = i === safeIndex;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${it.title ?? ""} - ${i + 1} of ${items.length}`}
              className="absolute inset-0 bg-center bg-cover transition-opacity ease-out"
              style={{
                backgroundImage: `url(${it.img})`,
                opacity: active ? 1 : 0,
                zIndex: active ? 20 : 10,
                transitionDuration: `${fadeMs}ms`,
              }}
            />
          );
        })}

        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-40">
        <button
          className="btn btn-ghost btn-circle btn-sm text-white"
          onClick={() => {
            prev();
            setPaused(true);
            setTimeout(() => setPaused(false), 2000);
          }}
          aria-label="Previous slide"
        >
          ‹
        </button>
      </div>

      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-40">
        <button
          className="btn btn-ghost btn-circle btn-sm text-white"
          onClick={() => {
            next();
            setPaused(true);
            setTimeout(() => setPaused(false), 2000);
          }}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 z-40 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              go(i);
              setPaused(true);
              setTimeout(() => setPaused(false), 2000);
            }}
            className={`w-3 h-3 rounded-full ${
              i === safeIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === safeIndex ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
}