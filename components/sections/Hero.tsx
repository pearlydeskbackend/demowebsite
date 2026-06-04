"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { X } from "lucide-react";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import MagneticButton from "@/components/anim/MagneticButton";
import { useBooking } from "@/lib/BookingContext";
import { useTranslations } from "next-intl";

const YT_ID = "sUgHvv4HiDU";

export default function Hero() {
  const t = useTranslations("hero");
  const root = useRef<HTMLElement>(null);
  const videoCard = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { open: openBooking } = useBooking();

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useGSAP(
    () => {
      gsap.from("[data-hero-fade]", { opacity: 0, y: 24, duration: 1.1, ease: "power3.out", stagger: 0.13, delay: 0.35 });
      gsap.from(videoCard.current, { opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.7 });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="home"
      className="relative overflow-hidden"
      style={{ height: "100dvh", minHeight: "600px", background: "var(--dl-base)" }}
    >
      {/* Photo — full-bleed on mobile, right-half on desktop */}
      <div className="absolute top-0 right-0 bottom-0 w-full md:w-[52%]" style={{ zIndex: 0 }}>
        <Image src="/assets/family-photo.jpg" alt="Mountain landscape" fill priority quality={100} sizes="(max-width: 768px) 100vw, 52vw" style={{ objectFit: "cover", objectPosition: "center 35%" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%", background: "linear-gradient(to top, var(--dl-base), transparent)" }} />
      </div>

      {/* Desktop gradient — left-to-right */}
      <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ zIndex: 1, background: "linear-gradient(to right, var(--dl-base) 0%, var(--dl-base) 32%, rgba(13,25,20,0.72) 48%, rgba(13,25,20,0.10) 66%, transparent 80%)" }} />
      {/* Mobile gradient — bottom-up so image shows at top, text readable at bottom */}
      <div className="absolute inset-0 pointer-events-none md:hidden" style={{ zIndex: 1, background: "linear-gradient(to top, var(--dl-base) 0%, var(--dl-base) 28%, rgba(13,25,20,0.92) 55%, rgba(13,25,20,0.45) 78%, rgba(13,25,20,0.15) 100%)" }} />

      {/* Text column — full-width on mobile (content sits at bottom), half on desktop */}
      <div
        className="absolute top-0 left-0 bottom-0 flex flex-col justify-end md:justify-center px-[clamp(1.5rem,5vw,6rem)] w-full md:w-[50%]"
        style={{ zIndex: 2, paddingTop: "5.5rem", paddingBottom: "clamp(4rem,8vh,2.5rem)" }}
      >
        <div style={{ maxWidth: 480 }}>
          <div data-hero-fade className="flex items-center gap-3 mb-5">
            <span className="text-label">{t("tag1")}</span>
            <span className="text-label" style={{ color: "var(--dl-grid-hover)", letterSpacing: "0.05em" }}>———</span>
            <span className="text-label">{t("tag2")}</span>
          </div>

          <AnimatedHeading
            as="h1"
            immediate
            delay={0.2}
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.5rem,4.5vw,5.5rem)", lineHeight: 1.04, letterSpacing: "-0.03em", fontWeight: 500, color: "var(--dl-white)", marginBottom: "1rem" }}
          >
            {t("line1")}
            <br />
            {t("line2")}
            <br />
            <em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("line3")}</em>
            <br />
            <em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("line4")}</em>
          </AnimatedHeading>

          <p data-hero-fade style={{ fontSize: "clamp(0.875rem,1.2vw,1rem)", marginBottom: "1.5rem", color: "var(--dl-sage)", lineHeight: 1.6 }}>
            {t("sub")}
          </p>

          <div data-hero-fade className="flex flex-wrap items-center gap-4">
            <MagneticButton className="btn-primary" onClick={openBooking}>
              {t("cta")}
            </MagneticButton>
            <MagneticButton as="a" href="tel:6048799999" className="btn-ghost" strength={0.3}>
              {t("call")}
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Video card — desktop only */}
      <div
        ref={videoCard}
        role="button"
        tabIndex={0}
        aria-label="Watch clinic video"
        onClick={() => setModalOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setModalOpen(true); }}
        className="hidden md:block"
        style={{ position: "absolute", top: "50%", left: "48%", transform: "translate(-50%, -50%)", width: "clamp(260px, 28vw, 400px)", aspectRatio: "16 / 9", zIndex: 10, borderRadius: "14px", overflow: "hidden", cursor: "pointer", boxShadow: "0 24px 60px rgba(0,0,0,0.60), 0 4px 18px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <Image src="/assets/our-office-img-9-952x667.jpg" alt="Inside Kingsgate Dental — click to play video" fill sizes="(min-width: 768px) clamp(260px, 28vw, 400px)" style={{ objectFit: "cover", objectPosition: "center center" }} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.32)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="play-btn" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(255,255,255,0.20)", border: "2px solid rgba(255,255,255,0.65)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden="true"><path d="M1.5 1.5 L15 10 L1.5 18.5 Z" fill="white" /></svg>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          role="dialog" aria-modal="true" aria-label="Clinic video"
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
          onClick={() => setModalOpen(false)}
        >
          <div style={{ position: "relative", width: "min(90vw, 960px)", aspectRatio: "16 / 9" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close video"
              style={{ position: "absolute", top: "-2.75rem", right: 0, background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", padding: "0.25rem", lineHeight: 1, transition: "color 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)"; }}
            >
              <X size={22} />
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0`}
              title="Kingsgate Dental — clinic video"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
