"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// FilmScrub: video-on-scroll. The playhead is driven by the reader's scroll
// position (ScrollTrigger scrub), never by autoplay: the film advances only
// as the eye travels the band, and rewinds when the reader changes their
// mind. Seeks are eased through a small lerp so keyframe-aligned seeking
// still reads as continuous motion.
//
// The Higgsfield poster still ALWAYS renders underneath: a missing, slow, or
// unsupported film degrades to the photograph invisibly (the same contract
// as the hero's existsSync upgrade). Reduced motion: the photograph, full
// stop; the video element never mounts.
export function FilmScrub({
  src,
  poster,
  alt,
  sizes = "100vw",
  className = "",
}: {
  src: string;
  poster: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [wantsFilm, setWantsFilm] = useState(false);
  const [filmReady, setFilmReady] = useState(false);

  // Mount the video only after the reduced-motion check (post-hydration, so
  // the SSR tree stays a plain photograph for everyone).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setWantsFilm(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!wantsFilm || !video || !wrap.current) return;

    let target = 0;
    let current = 0;
    let raf = 0;
    let duration = 0;

    const onMeta = () => {
      duration = video.duration || 0;
    };
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    const tick = () => {
      // Ease the playhead toward the scroll target; writing currentTime at
      // full pointer rate makes decoders stutter.
      current += (target - current) * 0.14;
      if (duration && Math.abs(video.currentTime - current) > 0.02) {
        video.currentTime = current;
      }
      raf = requestAnimationFrame(tick);
    };

    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        if (duration) target = self.progress * duration;
      },
    });
    // The full film only downloads once the reader is within a viewport of
    // the band (an 8s 1080p encode is ~11MB; eager preload would tax LCP).
    const warm = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top 200%",
      once: true,
      onEnter: () => {
        video.preload = "auto";
        video.load();
      },
    });
    raf = requestAnimationFrame(tick);

    return () => {
      st.kill();
      warm.kill();
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [wantsFilm]);

  return (
    <div ref={wrap} className={`relative h-full w-full ${className}`}>
      <Image src={poster} alt={alt} fill sizes={sizes} className="object-cover" />
      {wantsFilm ? (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setFilmReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            filmReady ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
