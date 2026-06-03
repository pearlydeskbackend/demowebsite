"use client";
import Image from "next/image";
import { Tv, Shield, Smile, GraduationCap, Clock, MapPin } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import Parallax from "@/components/anim/Parallax";
import { useTranslations } from "next-intl";

const featureIcons = [Tv, Shield, Smile, GraduationCap, Clock, MapPin];

export default function About() {
  const t = useTranslations("about");
  const features = t.raw("features") as Array<{ title: string; body: string; tag: string }>;

  return (
    <section id="about" className="relative" style={{ paddingTop: "clamp(5rem,12vh,13rem)", paddingBottom: "clamp(5rem,12vh,13rem)" }}>
      <div className="grid-line absolute top-0 left-0" />
      <div className="w-full px-[clamp(1.5rem,5vw,6rem)]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8" style={{ marginBottom: "clamp(3rem,6vw,5rem)" }}>
          <div style={{ maxWidth: 580 }}>
            <Reveal><p className="text-label" style={{ marginBottom: "1.25rem" }}>{t("label")}</p></Reveal>
            <AnimatedHeading style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 500, color: "var(--dl-white)" }}>
              {t("heading1")}<br /><em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading2")}</em>
            </AnimatedHeading>
          </div>
          <Reveal as="p" delay={0.15} style={{ fontSize: "1rem", maxWidth: 380, color: "var(--dl-sage)", lineHeight: 1.8 }}>
            {t("sub")}
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]" style={{ gap: 1, background: "var(--dl-grid)", marginBottom: 1 }}>
          <Reveal className="relative overflow-hidden" style={{ minHeight: 400, background: "var(--dl-deep)", border: "1px solid var(--dl-grid)" }}>
            <Parallax className="absolute inset-0" amount={60}>
              <Image src="/assets/chair.jpg" alt="Kingsgate Dental clinic interior" fill sizes="66vw" style={{ objectFit: "cover", objectPosition: "center 90%", opacity: 0.78 }} />
            </Parallax>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--dl-deep) 0%, rgba(9,17,14,0.3) 60%, transparent 100%)" }} />
            <div className="absolute bottom-0 left-0" style={{ padding: "clamp(2rem,4vw,2.5rem)" }}>
              <p className="text-label">{t("bentoLabel")}</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--dl-white)", fontSize: "clamp(1.5rem,3vw,2.5rem)", lineHeight: 1.2, letterSpacing: "-0.04em", marginTop: "0.75rem" }}>
                {t("bentoHeading1")}<br />{t("bentoHeading2")}
              </h3>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-between" style={{ background: "var(--dl-surface)", border: "1px solid var(--dl-grid)", padding: "clamp(2rem,4vw,2.5rem)" }}>
            <div>
              <p className="text-label">{t("established")}</p>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, lineHeight: 1, fontSize: "clamp(5rem,10vw,8rem)", color: "var(--dl-white)", letterSpacing: "-0.04em", margin: "1rem 0 1.25rem" }}>20+</div>
              <p style={{ fontSize: "0.875rem", color: "var(--dl-sage)", lineHeight: 1.8 }}>{t("yearsBody")}</p>
            </div>
            <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--dl-grid)" }}>
              <p className="text-label">{t("address")}</p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1, background: "var(--dl-grid)" }}>
          {features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <Reveal key={i} delay={(i % 3) * 0.07} className="flex flex-col gap-5" style={{ background: "var(--dl-surface)", padding: "2rem" }}>
                <div className="flex items-start justify-between">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "var(--dl-sage)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-center justify-center flex-shrink-0" style={{ width: "2.25rem", height: "2.25rem", border: "1px solid var(--dl-grid)", color: "var(--dl-sage)" }}>
                    <Icon size={16} />
                  </span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.125rem", fontWeight: 500, color: "var(--dl-white)", marginBottom: "0.5rem" }}>{f.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--dl-sage)", lineHeight: 1.8 }}>{f.body}</p>
                </div>
                <span className="self-start mt-auto" style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.25rem 0.75rem", color: "var(--dl-sage)", border: "1px solid var(--dl-grid)" }}>{f.tag}</span>
              </Reveal>
            );
          })}
        </div>
      </div>
      <div className="grid-line absolute bottom-0 left-0" />
    </section>
  );
}
