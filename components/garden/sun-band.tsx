"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskRise } from "@/components/garden/motion-reveals";
import { FilmScrub } from "@/components/garden/film-scrub";

gsap.registerPlugin(ScrollTrigger);

// SunBand: a full-bleed golden interlude between sections. The photograph
// (or, when /public/videos/garden-band.mp4 exists, the scroll-scrubbed film)
// settles from 1.14 to 1.04 and drifts ±7% against the scroll while a single
// masked headline rises over it. GSAP owns only the media transform; the
// headline is MaskRise in its own subtree (the hero-film precedent for
// mixing at subtree granularity). Reduced motion: a still photograph with
// static type.
export function SunBand({
  image,
  alt,
  videoSrc,
  title,
  meta,
}: {
  image: string;
  alt: string;
  videoSrc?: string | null;
  title: ReactNode;
  meta?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-band-media]",
        { yPercent: -7, scale: 1.14 },
        {
          yPercent: 7,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      data-ground="dark"
      aria-label={typeof title === "string" ? title : undefined}
      className="relative flex min-h-[480px] items-end overflow-hidden bg-[#0b1f16] py-16 sm:h-[72vh] sm:py-20"
    >
      <div data-band-media className="absolute inset-[-9%] will-change-transform">
        {videoSrc ? (
          <FilmScrub src={videoSrc} poster={image} alt={alt} />
        ) : (
          <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
        )}
      </div>
      {/* Plum depth floor: cream type must clear AA over the brightest frame */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(11, 31, 22,0.66) 0%, rgba(11, 31, 22,0.18) 45%, rgba(11, 31, 22,0.24) 100%)",
        }}
      />
      <div aria-hidden className="hero-grain absolute inset-0" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 lg:px-8">
        <h2 className="text-display max-w-3xl text-balance text-[#f5f3ea] [text-shadow:0_2px_30px_rgba(11, 31, 22,0.5)]">
          <MaskRise amount={0.6}>{title}</MaskRise>
        </h2>
        {meta ? <p className="text-meta text-brand-ink/70">{meta}</p> : null}
      </div>
    </section>
  );
}
