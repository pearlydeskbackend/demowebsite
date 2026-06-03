"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import MagneticButton from "@/components/anim/MagneticButton";
import { useTranslations } from "next-intl";

type FaqItem = { index: string; q: string; a: string };
type FaqCategory = { id: string; label: string; faqs: FaqItem[] };

export default function Faq() {
  const t = useTranslations("faq");
  const categories = t.raw("categories") as FaqCategory[];

  const [tab, setTab] = useState(categories[0].id);
  const [open, setOpen] = useState<string | null>(null);
  const cat = categories.find((c) => c.id === tab)!;

  return (
    <section id="faq" className="relative" style={{ background: "var(--dl-deep)" }}>
      <div className="grid-line" />
      <div className="section-watermark" style={{ top: "-0.05em", right: 0, paddingRight: "1rem", textAlign: "right" }} aria-hidden>FAQ</div>
      <div className="relative w-full px-[clamp(1.5rem,5vw,6rem)]" style={{ zIndex: 10, paddingTop: "clamp(4rem,8vw,6rem)", paddingBottom: "clamp(4rem,8vw,6rem)" }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8" style={{ marginBottom: "3.5rem" }}>
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

        <Reveal className="flex flex-wrap" style={{ borderBottom: "1px solid var(--dl-grid)", marginBottom: "3rem" }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setTab(c.id); setOpen(null); }}
              style={{ background: "none", border: "none", color: tab === c.id ? "var(--dl-white)" : "var(--dl-sage)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "1rem 1.25rem", borderBottom: tab === c.id ? "1px solid var(--dl-mint)" : "1px solid transparent", marginBottom: -1, transition: "color 0.3s, border-color 0.3s" }}
            >
              {c.label}
            </button>
          ))}
        </Reveal>

        <Reveal>
          {cat.faqs.map((f, i) => {
            const key = `${tab}-${f.index}`;
            const isOpen = open === key;
            return (
              <div key={key} style={{ borderTop: "1px solid var(--dl-grid)", borderBottom: i === cat.faqs.length - 1 ? "1px solid var(--dl-grid)" : undefined, background: isOpen ? "rgba(163,184,153,0.02)" : "transparent", transition: "background 0.5s" }}>
                <button className="w-full flex items-center text-left" style={{ gap: "clamp(1.5rem,2.5vw,2.5rem)", padding: "clamp(1.75rem,2vw,2rem) 0", background: "none", border: "none" }} onClick={() => setOpen(isOpen ? null : key)} aria-expanded={isOpen}>
                  <span className="flex-shrink-0" style={{ width: "2rem", fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: isOpen ? "var(--dl-mint)" : "var(--dl-sage)" }}>{f.index}</span>
                  <span className="flex-1" style={{ fontFamily: "'Playfair Display', serif", color: isOpen ? "var(--dl-white)" : "rgba(255,255,255,0.75)", fontSize: "clamp(1rem,1.8vw,1.4rem)", letterSpacing: "-0.02em", fontWeight: 500, transition: "color 0.5s" }}>{f.q}</span>
                  <span className="flex items-center justify-center flex-shrink-0" style={{ width: "2rem", height: "2rem", border: "1px solid var(--dl-grid-hover)", color: isOpen ? "var(--dl-base)" : "var(--dl-sage)", background: isOpen ? "var(--dl-mint)" : "transparent", borderColor: isOpen ? "var(--dl-mint)" : "var(--dl-grid-hover)", transition: "all 0.5s var(--ease-magnetic)" }}>
                    {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                  </span>
                </button>
                <div className={`accordion-grid ${isOpen ? "open" : ""}`}>
                  <div className="accordion-inner">
                    <div style={{ padding: "0 1rem 2.5rem", paddingLeft: "clamp(3.5rem,5vw,5rem)" }}>
                      <p style={{ fontSize: "1rem", color: "var(--dl-sage)", lineHeight: 1.85, paddingBottom: "0.5rem" }}>{f.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>

        <Reveal className="flex flex-col sm:flex-row sm:items-center gap-5" style={{ marginTop: "3.5rem" }}>
          <MagneticButton as="a" href="tel:6048799999" className="btn-primary">{t("call")}</MagneticButton>
          <MagneticButton className="btn-ghost" strength={0.3} onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>{t("sendMessage")}</MagneticButton>
        </Reveal>
      </div>
      <div className="grid-line" />
    </section>
  );
}
