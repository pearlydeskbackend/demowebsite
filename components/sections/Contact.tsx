"use client";
import Image from "next/image";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import MagneticButton from "@/components/anim/MagneticButton";
import { useTranslations } from "next-intl";

const MAPS = "https://maps.google.com/?q=370+East+Broadway+Vancouver+BC";

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="relative" style={{ background: "var(--dl-base)" }}>
      <div className="grid-line" />
      <div className="w-full px-[clamp(1.5rem,5vw,6rem)]" style={{ paddingTop: "clamp(4rem,8vw,6.5rem)", paddingBottom: "clamp(4rem,8vw,7rem)" }}>
        <Reveal><p className="text-label" style={{ marginBottom: "1.25rem" }}>{t("label")}</p></Reveal>
        <AnimatedHeading style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 500, color: "var(--dl-white)", marginBottom: "clamp(2.5rem,5vw,3.5rem)" }}>
          {t("heading1")} <em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading2")}</em>
        </AnimatedHeading>

        <Reveal className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr]" style={{ border: "1px solid var(--dl-grid)", background: "var(--dl-surface)" }}>
          <div className="relative overflow-hidden" style={{ minHeight: 360, background: "#0B1611" }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <rect width="600" height="480" fill="#0B1611" />
              <g fill="rgba(163,184,153,0.035)">
                <rect x="44" y="40" width="150" height="150" /><rect x="232" y="40" width="150" height="150" /><rect x="420" y="40" width="150" height="150" />
                <rect x="44" y="300" width="150" height="150" /><rect x="232" y="300" width="150" height="150" /><rect x="420" y="300" width="150" height="150" />
              </g>
              <g stroke="rgba(163,184,153,0.15)" strokeWidth="2">
                <line x1="212" y1="0" x2="212" y2="480" /><line x1="400" y1="0" x2="400" y2="480" /><line x1="24" y1="0" x2="24" y2="480" />
                <line x1="0" y1="210" x2="600" y2="210" /><line x1="0" y1="20" x2="600" y2="20" />
              </g>
              <line x1="0" y1="278" x2="600" y2="262" stroke="rgba(163,184,153,0.34)" strokeWidth="7" />
              <line x1="306" y1="480" x2="600" y2="150" stroke="rgba(163,184,153,0.26)" strokeWidth="6" />
              <text x="22" y="252" fill="rgba(163,184,153,0.5)" fontFamily="'Satoshi','Inter',sans-serif" fontSize="13" letterSpacing="2" fontWeight="500">E&#160;BROADWAY</text>
              <text x="430" y="300" fill="rgba(163,184,153,0.45)" fontFamily="'Satoshi','Inter',sans-serif" fontSize="12" letterSpacing="2" fontWeight="500" transform="rotate(-48 430 300)">KINGSWAY</text>
              <text x="218" y="120" fill="rgba(163,184,153,0.32)" fontFamily="'Satoshi','Inter',sans-serif" fontSize="11" letterSpacing="2" fontWeight="500" transform="rotate(-90 218 120)">ST&#160;GEORGE&#160;ST</text>
            </svg>
            <div className="absolute flex flex-col items-center" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", gap: "0.6rem", zIndex: 2 }}>
              <span className="absolute pin-ripple-anim" style={{ top: -10, left: "50%", transform: "translateX(-50%)", width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--dl-mint)", opacity: 0.5 }} />
              <span className="relative" style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--dl-mint)", border: "3px solid var(--dl-deep)", boxShadow: "0 0 0 1px var(--dl-mint)", zIndex: 2 }} />
              <span style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.72rem", letterSpacing: "0.06em", color: "var(--dl-base)", background: "var(--dl-mint)", padding: "0.3rem 0.7rem", whiteSpace: "nowrap", fontWeight: 600 }}>Kingsgate Dental</span>
            </div>
            <MagneticButton as="a" href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-ghost absolute" strength={0.3} style={{ bottom: "1.25rem", left: "1.25rem", zIndex: 3, padding: "0.55rem 1.25rem", fontSize: "0.82rem", background: "rgba(11,22,17,0.7)", backdropFilter: "blur(8px)" }}>{t("openInMaps")}</MagneticButton>
          </div>

          <div className="flex flex-col lg:border-l" style={{ padding: "clamp(2rem,3vw,2.75rem)", gap: "1.5rem", borderColor: "var(--dl-grid)" }}>
            <p style={{ fontSize: "1.02rem", color: "var(--dl-white)", lineHeight: 1.7 }}>{t("aside")}</p>
            <div>
              <p className="text-label" style={{ marginBottom: "0.6rem", color: "rgba(163,184,153,0.6)" }}>{t("addressLabel")}</p>
              <p style={{ fontSize: "0.95rem", color: "var(--dl-sage)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{t("addressVal")}</p>
            </div>
            <p style={{ fontSize: "0.9rem", color: "rgba(163,184,153,0.8)", lineHeight: 1.75 }}>{t("parking")}</p>
            <MagneticButton as="a" href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: "auto" }}>{t("directions")}</MagneticButton>
          </div>
        </Reveal>

        <Reveal className="relative overflow-hidden" style={{ marginTop: "1.5rem", border: "1px solid var(--dl-grid)" }}>
          <div className="relative" style={{ height: "clamp(260px,38vw,460px)" }}>
            <Image src="/assets/Kingsgate_upscaled.jpg" alt="Kingsgate Dental — clinic on East Broadway" fill sizes="100vw" quality={100} style={{ objectFit: "cover", objectPosition: "center 2%", filter: "brightness(0.82) saturate(0.85)" }} />
          </div>
          <span className="absolute text-label" style={{ bottom: "1.25rem", left: "1.25rem", padding: "0.5rem 0.85rem", background: "rgba(13,25,20,0.72)", border: "1px solid var(--dl-grid)", backdropFilter: "blur(8px)" }}>{t("storefront")}</span>
        </Reveal>
      </div>
    </section>
  );
}
