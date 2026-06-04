"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Touch devices have native inertia scroll — Lenis adds no value and can
    // intercept touch events, so skip it entirely on coarse-pointer devices.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, syncTouch: false });

    // Single RAF loop: drive Lenis from GSAP's ticker.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync with Lenis' virtual scroll.
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
