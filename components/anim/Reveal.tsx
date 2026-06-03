"use client";
import { useRef, ReactNode, ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  y?: number;
  /** stagger direct children instead of the element itself */
  stagger?: number;
};

/** Scroll-triggered fade + slide-up. The LAVA section-reveal idiom. */
export default function Reveal({ children, as: Tag = "div", className, style, delay = 0, y = 40, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(stagger ? el.children : el, { opacity: 1, y: 0 });
        return;
      }
      const targets = stagger ? el.children : el;
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay,
          stagger: stagger || 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
