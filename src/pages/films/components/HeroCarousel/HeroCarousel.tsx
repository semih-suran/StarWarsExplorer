import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  img: string;
  title?: string;
  subtitle?: string;
};

type Props = {
  items?: Item[];             // optional list of slides
  intervalMs?: number;        // time between slides
  fadeMs?: number;            // crossfade duration
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

  const prefersReducedMotion = useMemo(() => {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    if (!paused) {
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

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const go = (i: number) => setIndex((_) => (i + items.length) % items.length);
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
          const active = i === index;
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

        <div className="absolute inset-0 bg-black/45 pointer-events-none" />

        <div className="absolute inset-0 z-30 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold drop-shadow">
              {items[index].title ?? ""}
            </h2>
            {items[index].subtitle && (
              <p className="mt-3 text-sm md:text-lg opacity-90">{items[index].subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-40">
        <button
          className="btn btn-ghost btn-circle btn-sm"
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
          className="btn btn-ghost btn-circle btn-sm"
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
            onClick={() => { go(i); setPaused(true); setTimeout(() => setPaused(false), 2000); }}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : "false"}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite">
        {items[index].title ? `${items[index].title} - slide ${index + 1} of ${items.length}` : `Slide ${index + 1} of ${items.length}`}
      </div>
    </section>
  );
}
