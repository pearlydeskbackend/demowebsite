"use client";
import { useRef, ReactNode, ElementType } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  strength?: number;
  [key: string]: unknown;
};

/** Button that drifts toward the cursor within range — LAVA's magnetic CTAs. */
export default function MagneticButton({ children, as: Tag = "button", className, style, strength = 0.4, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  const onMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3.out" });
  };

  const onLeave = () => {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: "inline-block", touchAction: "manipulation", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
