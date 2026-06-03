"use client";
import { useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** how far the inner content drifts over the scroll range, in px */
  amount?: number;
};

/** Image parallax: the inner layer drifts slower than the scroll. */
export default function Parallax({ children, className, style, amount = 80 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const layer = inner.current;
      if (!el || !layer) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        layer,
        { yPercent: -amount / 10 },
        {
          yPercent: amount / 10,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden", ...style }}>
      <div ref={inner} style={{ height: "120%", width: "100%", position: "relative", top: "-10%" }}>
        {children}
      </div>
    </div>
  );
}
