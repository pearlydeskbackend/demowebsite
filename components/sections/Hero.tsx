"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { X, Play } from "lucide-react";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import MagneticButton from "@/components/anim/MagneticButton";
import { useBooking } from "@/lib/BookingContext";
import { useTranslations } from "next-intl";

const YT_ID = "sUgHvv4HiDU";
const MOBILE_POSTER = "/assets/our-office-img-9-952x667.jpg";

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
      className="relative overflow-x-hidden md:overflow-hidden md:min-h-[600px]"
      style={{ minHeight: "100dvh", background: "var(--dl-base)" }}
    >
      {/* ── DESKTOP ONLY — all absolutely-positioned layers ────────── */}

      {/* Photo — right half */}
      <div className="absolute top-0 right-0 bottom-0 hidden md:block" style={{ width: "52%", zIndex: 0 }}>
        <Image src="/assets/family-photo.jpg" alt="Mountain landscape" fill priority quality={100} sizes="52vw" style={{ objectFit: "cover", objectPosition: "center 35%" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%", background: "linear-gradient(to top, var(--dl-base), transparent)" }} />
      </div>

      {/* Left-to-right gradient */}
      <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ zIndex: 1, background: "linear-gradient(to right, var(--dl-base) 0%, var(--dl-base) 32%, rgba(13,25,20,0.72) 48%, rgba(13,25,20,0.10) 66%, transparent 80%)" }} />

      {/* Text column */}
      <div
        className="absolute top-0 left-0 bottom-0 hidden md:flex flex-col justify-center px-[clamp(1.5rem,5vw,6rem)]"
        style={{ width: "50%", zIndex: 2, paddingTop: "5.5rem", paddingBottom: "2.5rem" }}
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
          <p data-hero-fade style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--dl-sage)", opacity: 0.7, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Mon – Sat &nbsp;·&nbsp; 9:30 am – 5:30 pm
          </p>
        </div>
      </div>

      {/* Floating video card — autoplays muted on desktop */}
      <div
        ref={videoCard}
        role="button"
        tabIndex={0}
        aria-label="Watch clinic video with sound"
        onClick={() => setModalOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setModalOpen(true); }}
        className="hidden md:block"
        style={{ position: "absolute", top: "50%", left: "48%", transform: "translate(-50%, -50%)", width: "clamp(260px, 28vw, 400px)", aspectRatio: "16 / 9", zIndex: 10, borderRadius: "0", overflow: "hidden", cursor: "pointer", boxShadow: "0 24px 60px rgba(0,0,0,0.60), 0 4px 18px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        {/* Autoplaying muted preview — pointer-events none so clicks reach the card */}
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&controls=0&rel=0&modestbranding=1&playsinline=1`}
          title="Kingsgate Dental clinic preview"
          allow="autoplay; encrypted-media"
          style={{ position: "absolute", top: "50%", left: "50%", width: "120%", height: "120%", transform: "translate(-50%, -50%)", border: "none", pointerEvents: "none" }}
        />
      </div>

      {/* ── MOBILE HERO — new Lava-inspired layout ──────────────────── */}
      <div className="md:hidden relative overflow-hidden" style={{ minHeight: "100dvh" }}>

        {/* Decorative bleed photo — right edge only, very low opacity, left-edge faded */}
        <div
          className="absolute top-0 right-0 bottom-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{ width: "68%", zIndex: 0, opacity: 0.18 }}
        >
          <Image
            src="/assets/our-office-img-9-952x667.jpg"
            alt=""
            fill
            sizes="68vw"
            style={{ objectFit: "cover", objectPosition: "left center" }}
          />
        </div>
        {/* Full-width gradient shield — keeps headline on solid dark green */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            zIndex: 1,
            background: "linear-gradient(to right, var(--dl-base) 0%, var(--dl-base) 38%, rgba(13,25,20,0.88) 54%, rgba(13,25,20,0.45) 70%, transparent 88%)",
          }}
        />

        {/* Content column — above both image and gradient */}
        <div
          className="relative flex flex-col px-6 space-y-6"
          style={{ zIndex: 2, paddingTop: "7rem", paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
        >

          {/* 1. Eyebrow */}
          <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 500, color: "var(--dl-sage)" }}>
            VANCOUVER, BC &nbsp;—&nbsp; EST. 2004
          </p>

          {/* 2. Serif headline — always on flat dark green */}
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.75rem,11.5vw,3.5rem)",
              lineHeight: 1.03,
              letterSpacing: "-0.028em",
              fontWeight: 500,
              color: "var(--dl-white)",
            }}
          >
            Dentistry that
            <br />
            <em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>makes you smile.</em>
          </h1>

          {/* 3. Video card — rounded, aspect-video, autoplaying muted preview */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Watch clinic video with sound"
            onClick={() => setModalOpen(true)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setModalOpen(true); }}
            className="relative rounded-2xl overflow-hidden cursor-pointer w-full"
            style={{
              aspectRatio: "16 / 9",
              boxShadow: "0 16px 48px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.30)",
              border: "1px solid rgba(255,255,255,0.10)",
              flexShrink: 0,
            }}
          >
            {/* Poster shown while iframe loads */}
            <Image
              src={MOBILE_POSTER}
              alt=""
              fill
              sizes="(max-width: 768px) calc(100vw - 3rem)"
              style={{ objectFit: "cover", objectPosition: "center center" }}
              aria-hidden="true"
            />
            {/* Autoplaying muted preview — pointer-events:none so taps reach the card */}
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&controls=0&rel=0&modestbranding=1&playsinline=1`}
              title="Kingsgate Dental clinic preview"
              allow="autoplay; encrypted-media"
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: "120%", height: "120%",
                transform: "translate(-50%, -50%)",
                border: "none",
                pointerEvents: "none",
              }}
            />
            {/* Sound-on indicator — tap to open modal with audio */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="play-btn"
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.16)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "2px solid rgba(230,240,220,0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={20} fill="white" color="white" style={{ marginLeft: 3 }} />
              </div>
            </div>
          </div>

          {/* 4. Subhead — one step brighter than --dl-sage for WCAG AA clearance */}
          <p style={{ fontSize: "0.9375rem", color: "#C8D8BE", lineHeight: 1.65 }}>
            {t("sub")}
          </p>

          {/* 5. CTA — full-width pill */}
          <div className="flex flex-col gap-3">
            <button className="btn-primary w-full justify-center" onClick={openBooking}>
              {t("cta")}
            </button>
            <a href="tel:6048799999" className="btn-ghost w-full justify-center">
              {t("call")}
            </a>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--dl-sage)", opacity: 0.65, letterSpacing: "0.04em", textTransform: "uppercase", textAlign: "center" }}>
            Mon – Sat &nbsp;·&nbsp; 9:30 am – 5:30 pm
          </p>

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
