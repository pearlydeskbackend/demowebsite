"use client";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import { showcase } from "@/lib/data";
import { useBooking } from "@/lib/BookingContext";
import { useTranslations } from "next-intl";

type ShowcaseItem = { label: string; title: string; description: string; tag: string };

export default function Showcase() {
  const t = useTranslations("showcase");
  const items = t.raw("items") as ShowcaseItem[];
  const track = useRef<HTMLDivElement>(null);
  const { open: openBooking } = useBooking();
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const onDown = (e: React.MouseEvent) => {
    const tr = track.current;
    if (!tr) return;
    drag.current = { down: true, startX: e.pageX, startScroll: tr.scrollLeft, moved: false };
    tr.style.cursor = "grabbing";
  };
  const onMove = (e: React.MouseEvent) => {
    const tr = track.current;
    if (!tr || !drag.current.down) return;
    const dx = e.pageX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    tr.scrollLeft = drag.current.startScroll - dx;
  };
  const onUp = () => {
    const tr = track.current;
    if (tr) tr.style.cursor = "grab";
    drag.current.down = false;
  };

  return (
    <section className="relative" style={{ background: "var(--dl-base)" }}>
      <div className="grid-line" />
      <div className="w-full px-[clamp(1.5rem,5vw,6rem)]" style={{ paddingTop: "clamp(4rem,8vw,6rem)", paddingBottom: "clamp(4rem,8vw,6rem)" }}>
        <div className="flex items-end justify-between">
          <div>
            <Reveal><p className="text-label" style={{ marginBottom: "1.25rem" }}>{t("label")}</p></Reveal>
            <AnimatedHeading style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 500, color: "var(--dl-white)" }}>
              {t("heading1")}<br /><em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading2")}</em>
            </AnimatedHeading>
          </div>
          <Reveal className="hidden md:flex items-center gap-3" style={{ color: "var(--dl-sage)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <span>{t("drag")}</span>
            <ArrowRight size={14} />
          </Reveal>
        </div>
      </div>
      <div className="grid-line" />
      <div
        ref={track}
        className="overflow-x-auto"
        style={{ padding: "3rem clamp(1.5rem,5vw,3rem)", cursor: "grab", scrollbarWidth: "none" }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      >
        <div className="flex" style={{ gap: "1rem", minWidth: "max-content" }}>
          {items.map((it, idx) => {
            const raw = showcase[idx];
            return (
              <article
                key={it.label}
                className="flex flex-col flex-shrink-0"
                style={{ width: "clamp(260px,26vw,340px)", border: "1px solid var(--dl-grid)", background: "var(--dl-surface)" }}
                onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); } }}
              >
                <div className="relative overflow-hidden" style={{ height: 280 }}>
                  {raw?.image ? (
                    <>
                      <Image src={raw.image} alt={it.title} fill sizes="340px" style={{ objectFit: "cover", filter: "brightness(0.75) saturate(0.8)" }} draggable={false} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(9,17,14,0.6) 100%)" }} />
                    </>
                  ) : (
                    <div className="skeleton-pulse w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--dl-surface) 0%, rgba(163,184,153,0.04) 50%, var(--dl-surface) 100%)" }}>
                      <div className="flex flex-col items-center gap-3" style={{ opacity: 0.35 }}>
                        <span style={{ width: 40, height: 1, background: "var(--dl-sage)" }} />
                        <span className="text-label">Image coming soon</span>
                        <span style={{ width: 40, height: 1, background: "var(--dl-sage)" }} />
                      </div>
                    </div>
                  )}
                  <div className="absolute" style={{ top: "1rem", left: "1rem", padding: "0.4rem 0.75rem", border: "1px solid var(--dl-grid)", background: "rgba(13,25,20,0.7)", backdropFilter: "blur(8px)" }}>
                    <span className="text-label">{it.tag}</span>
                  </div>
                </div>
                <div className="flex flex-col flex-1" style={{ padding: "1.5rem", background: "var(--dl-surface)", borderTop: "1px solid var(--dl-grid)" }}>
                  <p className="text-label">{it.label}</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.125rem", fontWeight: 500, color: "var(--dl-white)", lineHeight: 1.3, margin: "0.75rem 0" }}>{it.title}</h3>
                  <p className="flex-1" style={{ fontSize: "0.875rem", color: "var(--dl-sage)", lineHeight: 1.8 }}>{it.description}</p>
                  <button
                    className="flex items-center gap-2 mt-5"
                    style={{ background: "none", border: "none", color: "var(--dl-sage)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}
                    onClick={openBooking}
                  >
                    {t("bookService")} <ArrowRight size={12} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="grid-line" />
    </section>
  );
}
