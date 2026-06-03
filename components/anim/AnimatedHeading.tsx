"use client";
import { useRef, ReactNode, ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  /** play immediately (hero) rather than on scroll */
  immediate?: boolean;
  delay?: number;
};

/** Line-by-line masked reveal via SplitText — LAVA's signature heading motion. */
export default function AnimatedHeading({ children, as: Tag = "h2", className, style, immediate = false, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      const split = new SplitText(el, { type: "lines", linesClass: "split-line" });
      // mask each line so the rise reads as a wipe
      split.lines.forEach((line) => {
        const wrap = document.createElement("span");
        wrap.style.display = "block";
        wrap.style.overflow = "hidden";
        line.parentNode?.insertBefore(wrap, line);
        wrap.appendChild(line);
      });

      gsap.set(el, { opacity: 1 });
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
        delay,
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
      });

      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0, ...style }}>
      {children}
    </Tag>
  );
}
