"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
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
    <section id="faq" style={{ background: "var(--dl-mint)" }}>
      <div
        className="w-full px-[clamp(1.5rem,5vw,6rem)]"
        style={{ paddingTop: "clamp(4rem,8vw,6rem)", paddingBottom: "clamp(4rem,8vw,6rem)" }}
      >
        {/* ── centred column ── */}
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Heading block */}
          <div style={{ marginBottom: "clamp(2.5rem,5vw,3.5rem)" }}>
            <Reveal>
              <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(13,25,20,0.45)", marginBottom: "1.25rem" }}>
                {t("label")}
              </p>
            </Reveal>
            <AnimatedHeading
              as="h2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.5rem,5vw,5rem)", lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 500, color: "var(--dl-base)" }}
            >
              {t("heading1")}
              <br />
              <em style={{ fontStyle: "italic", color: "rgba(13,25,20,0.45)" }}>{t("heading2")}</em>
            </AnimatedHeading>
            <Reveal>
              <p style={{ marginTop: "1.25rem", fontSize: "1rem", color: "rgba(13,25,20,0.60)", lineHeight: 1.75, maxWidth: 520 }}>
                {t("sub")}
              </p>
            </Reveal>
          </div>

          {/* Category tabs */}
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid rgba(13,25,20,0.15)", marginBottom: 0 }}>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setTab(c.id); setOpen(null); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Satoshi','Inter',sans-serif",
                    color: tab === c.id ? "var(--dl-base)" : "rgba(13,25,20,0.42)",
                    fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "0.875rem 1.25rem",
                    borderBottom: tab === c.id ? "2px solid var(--dl-base)" : "2px solid transparent",
                    marginBottom: -1,
                    transition: "color 0.25s, border-color 0.25s",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Accordion rows */}
          <Reveal>
            <div style={{ borderTop: "1px solid rgba(13,25,20,0.12)" }}>
              {cat.faqs.map((f) => {
                const key = `${tab}-${f.index}`;
                const isOpen = open === key;
                return (
                  <div key={key} style={{ borderBottom: "1px solid rgba(13,25,20,0.12)" }}>
                    <button
                      className="w-full flex items-center justify-between text-left"
                      style={{ padding: "1.5rem 0", background: "none", border: "none", cursor: "pointer", gap: "1.5rem" }}
                      onClick={() => setOpen(isOpen ? null : key)}
                      aria-expanded={isOpen}
                    >
                      <span style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        color: "var(--dl-base)",
                        fontSize: "clamp(1rem,1.6vw,1.2rem)",
                        letterSpacing: "-0.02em",
                        fontWeight: 500,
                        lineHeight: 1.35,
                      }}>
                        {f.q}
                      </span>
                      {/* Rotating "+" → "×" */}
                      <span
                        aria-hidden="true"
                        style={{
                          flexShrink: 0, width: "2rem", height: "2rem",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "1px solid rgba(13,25,20,0.22)",
                          color: "var(--dl-base)",
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      >
                        <Plus size={14} strokeWidth={1.5} />
                      </span>
                    </button>

                    {/* Animated answer */}
                    <div className={`accordion-grid${isOpen ? " open" : ""}`}>
                      <div className="accordion-inner">
                        <p style={{ paddingBottom: "1.75rem", fontSize: "0.9375rem", color: "rgba(13,25,20,0.62)", lineHeight: 1.85 }}>
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* CTAs */}
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4" style={{ marginTop: "3rem" }}>
              <a
                href="tel:6048799999"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--dl-base)", color: "var(--dl-mint)", fontFamily: "'Satoshi','Inter',sans-serif", fontWeight: 500, fontSize: "0.9rem", padding: "0.95rem 2.25rem", border: "1px solid var(--dl-base)", borderRadius: 999, textDecoration: "none", transition: "background 0.35s, color 0.35s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "var(--dl-base)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "var(--dl-base)"; el.style.color = "var(--dl-mint)"; }}
              >
                {t("call")}
              </a>
              <button
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "var(--dl-base)", fontFamily: "'Satoshi','Inter',sans-serif", fontWeight: 500, fontSize: "0.9rem", padding: "0.95rem 2.25rem", border: "1px solid rgba(13,25,20,0.28)", borderRadius: 999, cursor: "pointer", transition: "border-color 0.35s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--dl-base)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(13,25,20,0.28)"; }}
              >
                {t("sendMessage")}
              </button>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
