"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import MagneticButton from "@/components/anim/MagneticButton";
import { useBooking } from "@/lib/BookingContext";
import { useTranslations } from "next-intl";

type ServiceItem = { index: string; title: string; category: string; description: string; includes: string[] };

export default function Services() {
  const t = useTranslations("services");
  const services = t.raw("list") as ServiceItem[];
  const [open, setOpen] = useState<number | null>(0);
  const { open: openBooking } = useBooking();

  return (
    <section id="services" className="relative" style={{ background: "var(--dl-deep)", paddingTop: "clamp(5rem,12vh,13rem)", paddingBottom: "clamp(5rem,12vh,13rem)" }}>
      <div className="section-watermark" style={{ top: "-0.1em", left: 0, paddingLeft: "1rem" }} aria-hidden>Services</div>
      <div className="relative w-full px-[clamp(1.5rem,5vw,6rem)]" style={{ zIndex: 10 }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8" style={{ marginBottom: "clamp(3rem,6vw,5rem)" }}>
          <div>
            <Reveal><p className="text-label" style={{ marginBottom: "1.25rem" }}>{t("label")}</p></Reveal>
            <AnimatedHeading style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem,5vw,5.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 500, color: "var(--dl-white)" }}>
              {t("heading1")}<br /><em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading2")}</em>
            </AnimatedHeading>
          </div>
          <Reveal as="p" delay={0.15} style={{ fontSize: "1rem", maxWidth: 340, color: "var(--dl-sage)", lineHeight: 1.8 }}>
            {t("sub")}
          </Reveal>
        </div>

        <Reveal>
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <div
                key={s.index}
                style={{ borderTop: "1px solid var(--dl-grid)", borderBottom: i === services.length - 1 ? "1px solid var(--dl-grid)" : undefined, transition: "background 0.5s var(--ease-magnetic)", background: isOpen ? "rgba(163,184,153,0.02)" : "transparent" }}
              >
                <button
                  className="w-full flex items-center text-left"
                  style={{ gap: "clamp(1.5rem,2.5vw,2.5rem)", padding: "clamp(1.75rem,2vw,2rem) 0", background: "none", border: "none" }}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="flex-shrink-0" style={{ width: "2rem", fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: isOpen ? "var(--dl-mint)" : "var(--dl-sage)", transition: "color 0.5s" }}>{s.index}</span>
                  <span className="flex-1" style={{ fontFamily: "'Playfair Display', serif", color: isOpen ? "var(--dl-white)" : "rgba(255,255,255,0.75)", fontSize: "clamp(1.1rem,2.2vw,1.75rem)", letterSpacing: "-0.04em", fontWeight: 500, transition: "color 0.5s" }}>{s.title}</span>
                  <span className="hidden md:block" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--dl-sage)" }}>{s.category}</span>
                  <span className="flex items-center justify-center flex-shrink-0" style={{ width: "2rem", height: "2rem", border: "1px solid var(--dl-grid-hover)", color: isOpen ? "var(--dl-base)" : "var(--dl-sage)", background: isOpen ? "var(--dl-mint)" : "transparent", borderColor: isOpen ? "var(--dl-mint)" : "var(--dl-grid-hover)", transition: "all 0.5s var(--ease-magnetic)" }}>
                    {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                  </span>
                </button>
                <div className={`accordion-grid ${isOpen ? "open" : ""}`}>
                  <div className="accordion-inner">
                    <div style={{ padding: "0 1rem 2.5rem", paddingLeft: "clamp(3.5rem,5vw,5rem)" }}>
                      <div className="grid gap-8 md:grid-cols-2" style={{ gap: "clamp(2rem,4vw,4rem)" }}>
                        <p style={{ fontSize: "1rem", color: "var(--dl-sage)", lineHeight: 1.85 }}>{s.description}</p>
                        <div>
                          <p className="text-label" style={{ marginBottom: "1rem", color: "rgba(163,184,153,0.6)" }}>{t("includes")}</p>
                          <ul className="flex flex-col gap-3">
                            {s.includes.map((inc) => (
                              <li key={inc} className="flex items-center gap-4" style={{ fontSize: "0.875rem", color: "var(--dl-white)" }}>
                                <span style={{ width: 20, height: 1, background: "var(--dl-sage)", flexShrink: 0 }} />{inc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>

        <Reveal className="flex flex-col sm:flex-row sm:items-center gap-5" style={{ marginTop: "3.5rem" }}>
          <MagneticButton className="btn-primary" onClick={openBooking}>{t("cta")}</MagneticButton>
          <p style={{ fontSize: "0.9rem", color: "var(--dl-sage)" }}>{t("disclaimer")}</p>
        </Reveal>
      </div>
    </section>
  );
}
