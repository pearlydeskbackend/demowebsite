"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import MagneticButton from "@/components/anim/MagneticButton";
import { smileGallery } from "@/lib/data";
import { useBooking } from "@/lib/BookingContext";
import { useTranslations } from "next-intl";

type Tile = { id: string; ar: string; src: string; alt: string; tags: string[] };

function Card({ tile }: { tile: Tile }) {
  return (
    <figure
      className="relative overflow-hidden group"
      style={{ aspectRatio: tile.ar, background: "var(--dl-surface)", border: "1px solid var(--dl-grid)", transition: "transform 0.6s var(--ease-magnetic), border-color 0.6s" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "var(--dl-grid-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--dl-grid)"; }}
    >
      <Image src={tile.src} alt={tile.alt} fill sizes="(max-width:760px) 100vw, 33vw" style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.8s var(--ease-magnetic)" }} className="group-hover:scale-105" />
      <figcaption className="absolute flex flex-wrap" style={{ left: "0.7rem", bottom: "0.7rem", zIndex: 3, gap: "0.35rem", pointerEvents: "none" }}>
        {tile.tags.map((tag) => (
          <span key={tag} style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--dl-mint)", padding: "0.3rem 0.6rem", background: "rgba(9,17,14,0.66)", backdropFilter: "blur(6px)", border: "1px solid var(--dl-grid)" }}>{tag}</span>
        ))}
      </figcaption>
    </figure>
  );
}

function Column({ tiles, offsetClass }: { tiles: Tile[]; offsetClass?: string }) {
  return (
    <div className={`flex flex-col ${offsetClass || ""}`} style={{ gap: "clamp(1rem,2.2vw,1.75rem)" }}>
      {tiles.map((tile) => <Card key={tile.id} tile={tile} />)}
    </div>
  );
}

export default function SmileGallery() {
  const t = useTranslations("gallery");
  const root = useRef<HTMLDivElement>(null);
  const { open: openBooking } = useBooking();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = root.current?.querySelectorAll("figure");
      if (!cards) return;
      gsap.from(cards, {
        opacity: 0, y: 60, duration: 1, ease: "power3.out",
        stagger: { each: 0.08, from: "random" },
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section id="results" className="relative" style={{ background: "var(--dl-base)" }}>
      <div className="grid-line" />
      <div className="w-full px-[clamp(1.5rem,5vw,6rem)]" style={{ paddingTop: "clamp(4rem,8vw,6rem)", paddingBottom: "clamp(4rem,8vw,6.5rem)" }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8" style={{ marginBottom: "clamp(2.5rem,5vw,3.5rem)" }}>
          <div>
            <Reveal><p className="text-label" style={{ marginBottom: "1.25rem" }}>{t("label")}</p></Reveal>
            <AnimatedHeading style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 500, color: "var(--dl-white)" }}>
              {t("heading1")}<br /><em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading2")}</em>
            </AnimatedHeading>
          </div>
          <Reveal as="p" delay={0.15} style={{ fontSize: "1rem", maxWidth: 360, color: "var(--dl-sage)", lineHeight: 1.8 }}>
            {t("sub")}
          </Reveal>
        </div>

        <div ref={root} className="grid grid-cols-1 md:grid-cols-[1.25fr_0.82fr_1.05fr] items-start" style={{ gap: "clamp(1.25rem,2.2vw,2rem)" }}>
          <Column tiles={smileGallery.left} />
          <Column tiles={smileGallery.mid} offsetClass="md:mt-[clamp(3.5rem,8vw,7.5rem)]" />
          <Column tiles={smileGallery.right} offsetClass="md:mt-[clamp(1.5rem,4vw,4rem)]" />
        </div>

        <Reveal className="flex flex-col sm:flex-row sm:items-center gap-5" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }}>
          <MagneticButton className="btn-primary" onClick={openBooking}>{t("cta")}</MagneticButton>
          <p style={{ fontSize: "0.9rem", color: "var(--dl-sage)" }}>{t("consent")}</p>
        </Reveal>
      </div>
    </section>
  );
}
