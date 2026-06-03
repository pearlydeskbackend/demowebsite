"use client";
import Image from "next/image";
import { Tv, Star, Wrench, MapPin, Clock, Car, Phone } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import MagneticButton from "@/components/anim/MagneticButton";
import Parallax from "@/components/anim/Parallax";
import { useTranslations } from "next-intl";

const amenityIcons = [Tv, Star, Wrench];

export default function Office() {
  const t = useTranslations("office");
  const amenities = t.raw("amenities") as Array<{ title: string; body: string }>;

  const info = [
    { Icon: MapPin, label: t("locationLabel"), val: t("locationVal") },
    { Icon: Clock, label: t("hoursLabel"), val: t("hoursVal") },
    { Icon: Car, label: t("parkingLabel"), val: t("parkingVal") },
    { Icon: Phone, label: t("phoneLabel"), val: "(604) 879-9999" },
  ];

  return (
    <section id="office" className="relative" style={{ background: "var(--dl-deep)" }}>
      <div className="grid-line" />
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ borderBottom: "1px solid var(--dl-grid)" }}>
        <div className="flex flex-col justify-between lg:border-r" style={{ padding: "clamp(2.5rem,5vw,5rem)", gap: "3rem", borderColor: "var(--dl-grid)" }}>
          <div>
            <Reveal><p className="text-label">{t("label")}</p></Reveal>
            <AnimatedHeading style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 500, color: "var(--dl-white)", margin: "1.5rem 0 2rem" }}>
              {t("heading1")}<br /><em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading2")}</em>
            </AnimatedHeading>
            <Reveal as="p" delay={0.15} style={{ fontSize: "1rem", maxWidth: 400, color: "var(--dl-sage)", lineHeight: 1.85 }}>
              {t("sub")}
            </Reveal>
          </div>
          <Reveal className="flex flex-wrap gap-4">
            <MagneticButton as="a" href="https://maps.google.com/?q=370+East+Broadway+Vancouver+BC" target="_blank" rel="noopener noreferrer" className="btn-primary">{t("directions")}</MagneticButton>
            <MagneticButton as="a" href="tel:6048799999" className="btn-ghost" strength={0.3}>{t("callUs")}</MagneticButton>
          </Reveal>
        </div>
        <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
          <Parallax className="absolute inset-0" amount={70}>
            <Image src="/assets/arrival.jpg" alt="Kingsgate Dental clinic interior" fill sizes="50vw" style={{ objectFit: "cover", objectPosition: "center center", filter: "brightness(0.65) saturate(0.7)" }} />
          </Parallax>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, var(--dl-deep) 100%)" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: "1px solid var(--dl-grid)" }}>
        {amenities.map((a, i) => {
          const Icon = amenityIcons[i];
          return (
            <Reveal key={i} delay={i * 0.08} className="flex flex-col gap-5 md:border-r" style={{ padding: "clamp(2rem,3.5vw,2.5rem)", borderColor: "var(--dl-grid)", borderRight: i === 2 ? "none" : undefined }}>
              <div className="flex items-start justify-between">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "var(--dl-sage)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex items-center justify-center flex-shrink-0" style={{ width: "2.25rem", height: "2.25rem", border: "1px solid var(--dl-grid)", color: "var(--dl-sage)" }}><Icon size={15} /></span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500, color: "var(--dl-white)", marginBottom: "0.5rem" }}>{a.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--dl-sage)", lineHeight: 1.8 }}>{a.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4">
        {info.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.06} className="flex flex-col gap-3" style={{ padding: "clamp(1.75rem,3vw,2.5rem)", borderRight: i === 3 ? "none" : "1px solid var(--dl-grid)" }}>
            <c.Icon size={14} style={{ color: "var(--dl-sage)" }} />
            <p className="text-label" style={{ color: "rgba(163,184,153,0.6)" }}>{c.label}</p>
            <p style={{ fontSize: "0.875rem", color: "var(--dl-white)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{c.val}</p>
          </Reveal>
        ))}
      </div>

      <div className="grid-line" />
    </section>
  );
}
