"use client";
import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import { smileGallery } from "@/lib/data";
import { useBooking } from "@/lib/BookingContext";
import { useTranslations } from "next-intl";

export default function SmileGallery() {
  const t = useTranslations("gallery");
  const { open: openBooking } = useBooking();

  // Flatten the three masonry columns into a single ordered array
  const tiles = [...smileGallery.left, ...smileGallery.mid, ...smileGallery.right];

  return (
    <section id="results" style={{ background: "var(--dl-mint)" }}>
      {/* ── Heading block ── */}
      <div
        className="w-full px-[clamp(1.5rem,5vw,6rem)]"
        style={{ paddingTop: "clamp(4rem,8vw,6rem)", paddingBottom: "clamp(2rem,4vw,2.5rem)" }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <Reveal>
              <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(13,25,20,0.45)", marginBottom: "1.25rem" }}>
                {t("label")}
              </p>
            </Reveal>
            <AnimatedHeading
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 500, color: "var(--dl-base)" }}
            >
              {t("heading1")}
              <br />
              <em style={{ fontStyle: "italic", color: "rgba(13,25,20,0.45)" }}>{t("heading2")}</em>
            </AnimatedHeading>
          </div>
          <Reveal as="p" delay={0.15} style={{ fontSize: "1rem", maxWidth: 360, color: "rgba(13,25,20,0.60)", lineHeight: 1.8 }}>
            {t("sub")}
          </Reveal>
        </div>
      </div>

      {/* ── Tight uniform grid — 2 cols → 3 md → 4 lg ── */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        style={{ gap: "2px" }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="relative overflow-hidden"
            style={{ aspectRatio: "1 / 1" }}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {/* Tag label, bottom-left */}
            <div
              className="absolute flex flex-wrap"
              style={{ left: "0.5rem", bottom: "0.5rem", zIndex: 3, gap: "0.25rem", pointerEvents: "none" }}
            >
              {tile.tags.map((tag) => (
                <span
                  key={tag}
                  style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dl-mint)", padding: "0.25rem 0.5rem", background: "rgba(9,17,14,0.72)", backdropFilter: "blur(4px)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA row ── */}
      <div
        className="w-full px-[clamp(1.5rem,5vw,6rem)]"
        style={{ paddingTop: "clamp(2rem,4vw,3rem)", paddingBottom: "clamp(4rem,8vw,6rem)" }}
      >
        <Reveal className="flex flex-col sm:flex-row sm:items-center gap-5">
          <button
            onClick={openBooking}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--dl-base)", color: "var(--dl-mint)", fontFamily: "'Satoshi','Inter',sans-serif", fontWeight: 500, fontSize: "0.9rem", padding: "0.95rem 2.25rem", border: "1px solid var(--dl-base)", borderRadius: 999, cursor: "pointer", transition: "background 0.35s, color 0.35s", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "var(--dl-base)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "var(--dl-base)"; el.style.color = "var(--dl-mint)"; }}
          >
            {t("cta")}
          </button>
          <p style={{ fontSize: "0.875rem", color: "rgba(13,25,20,0.55)" }}>{t("consent")}</p>
        </Reveal>
      </div>
    </section>
  );
}
