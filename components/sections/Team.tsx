"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import { SMILE_IMG } from "@/lib/data";
import { useTranslations } from "next-intl";

type TranslatedPerson = {
  name: string; role: string; specialty: string; highlight: string;
  credentials: string[]; bio: string;
};

// Portrait-format URLs — tall crop for the editorial card layout
const images: Record<string, string> = {
  "Dr. Tam Do":       "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=533&fit=crop&crop=top",
  "Dr. Largani":      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=533&fit=crop&crop=top",
  "Sarah Whitfield":  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=533&fit=crop&crop=top",
  "Daniel Cho":       "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=533&fit=crop&crop=top",
  "Maria Alvarez":    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=533&fit=crop&crop=top",
  "Priya Nair":       "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=533&fit=crop&crop=top",
  "Emily Tran":       "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=533&fit=crop&crop=top",
};

const enNames: Record<string, string> = {
  "Dr. Tam Do": "Dr. Tam Do", "Dr Tam Do": "Dr. Tam Do", "Do 医生": "Dr. Tam Do",
  "Dr. Largani": "Dr. Largani", "Dr Largani": "Dr. Largani", "Largani 医生": "Dr. Largani",
  "Sarah Whitfield": "Sarah Whitfield", "Daniel Cho": "Daniel Cho",
  "Maria Alvarez": "Maria Alvarez", "Priya Nair": "Priya Nair", "Emily Tran": "Emily Tran",
};

function getImage(name: string): string {
  const key = enNames[name] ?? name;
  return images[key] ?? images["Dr. Tam Do"];
}

// ── Individual member card ────────────────────────────────────────────────────
// Owns its own hover state so each card animates independently.
function MemberCard({
  d, stagger, onClick,
}: { d: TranslatedPerson; stagger: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      // stagger: desktop-only via Tailwind md: prefix — never affects mobile layout
      className={`text-left flex flex-col ${stagger ? "md:mt-12" : ""}`}
      style={{ background: "none", border: "none", cursor: "pointer", width: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`View profile of ${d.name}`}
    >
      {/* Portrait image — arch-top, 3:4, slow zoom on hover */}
      <div
        style={{
          position: "relative", width: "100%", aspectRatio: "3 / 4",
          overflow: "hidden",
          // Gentle arch at the top — Japandi softness without being decorative
          borderRadius: "clamp(2.5rem,5vw,4.5rem) clamp(2.5rem,5vw,4.5rem) 3px 3px",
          background: "var(--dl-surface)",
          marginBottom: "1rem",
        }}
      >
        <Image
          src={getImage(d.name)}
          alt={d.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          style={{
            objectFit: "cover", objectPosition: "center top",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        {/* Subtle glass arrow badge */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute", top: "0.85rem", right: "0.85rem",
            width: 28, height: 28, borderRadius: "50%",
            background: hovered ? "rgba(230,240,220,0.22)" : "rgba(13,25,20,0.38)",
            backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(230,240,220,0.80)",
            transition: "background 0.5s ease",
          }}
        >
          <ArrowUpRight size={12} />
        </span>
      </div>

      {/* Name + role — quiet, typographic, no box */}
      <div style={{ paddingLeft: "0.15rem" }}>
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(0.9rem,1.2vw,1.05rem)",
          fontWeight: 500, color: hovered ? "var(--dl-mint)" : "var(--dl-white)",
          letterSpacing: "-0.01em", lineHeight: 1.3,
          marginBottom: "0.28rem",
          transition: "color 0.4s ease",
        }}>
          {d.name}
        </p>
        <p style={{
          fontFamily: "'Satoshi', 'Inter', sans-serif",
          fontSize: "0.6rem", letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--dl-sage)", fontWeight: 500,
        }}>
          {d.role}
        </p>
      </div>
    </button>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Team() {
  const t = useTranslations("team");
  const dentalTeam = t.raw("dental") as TranslatedPerson[];
  const adminTeam  = t.raw("admin")  as TranslatedPerson[];

  const [tab,    setTab]    = useState<"dental" | "admin">("dental");
  const [active, setActive] = useState<TranslatedPerson | null>(null);
  const list = tab === "admin" ? adminTeam : dentalTeam;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [active]);

  return (
    <section id="team" className="relative" style={{ background: "var(--dl-base)" }}>
      <div className="grid-line" />

      <div className="w-full px-[clamp(1.5rem,5vw,6rem)]"
        style={{ paddingTop: "clamp(1.5rem,3vw,2.5rem)", paddingBottom: "clamp(1.5rem,3vw,2.5rem)" }}
      >

        {/* ── PART A: Compact intro band ─────────────────────────────── */}
        <Reveal>
          <p className="text-label" style={{ marginBottom: "0.65rem" }}>{t("label")}</p>
        </Reveal>
        <AnimatedHeading
          as="h2"
          style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 500,
            color: "var(--dl-white)", letterSpacing: "-0.02em", lineHeight: 1.08,
            fontSize: "clamp(1.4rem,2.5vw,2rem)", maxWidth: "20ch",
            marginBottom: "clamp(0.85rem,1.5vw,1.25rem)",
          }}
        >
          {t("heading1")} <em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading2")}</em> {t("heading3")}
        </AnimatedHeading>

        {/* Image + text — single compact row */}
        <div
          className="grid grid-cols-1 md:grid-cols-[0.3fr_1fr] items-center"
          style={{ gap: "clamp(0.85rem,1.8vw,1.5rem)", paddingBottom: "clamp(1rem,2vw,1.5rem)" }}
        >
          <Reveal
            className="relative overflow-hidden"
            style={{ aspectRatio: "3/2", border: "1px solid var(--dl-grid)", background: "var(--dl-surface)" }}
          >
            <Image
              src={SMILE_IMG} alt="A confident, healthy smile" fill sizes="25vw"
              style={{ objectFit: "cover", filter: "brightness(0.88) saturate(0.88)" }}
            />
            <div className="absolute" style={{ left: "0.65rem", bottom: "0.65rem", padding: "0.3rem 0.55rem", border: "1px solid var(--dl-grid)", background: "rgba(13,25,20,0.82)", backdropFilter: "blur(8px)" }}>
              <span className="text-label">{t("cosmeticTag")}</span>
            </div>
          </Reveal>

          <div>
            <Reveal as="p" style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 400,
              color: "var(--dl-white)", fontSize: "clamp(0.9rem,1.2vw,1.05rem)",
              lineHeight: 1.55, letterSpacing: "-0.01em", marginBottom: "0.65rem",
            }}>
              {t("intro1")}
            </Reveal>
            <Reveal as="p" delay={0.1} style={{
              fontSize: "0.8rem", lineHeight: 1.75, color: "var(--dl-sage)",
              maxWidth: "52ch", paddingLeft: "0.9rem", borderLeft: "1px solid var(--dl-grid)",
            }}>
              {t("intro2")}
            </Reveal>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────── */}
        <Reveal
          className="flex gap-2 justify-center flex-wrap"
          style={{ borderTop: "1px solid var(--dl-grid)", borderBottom: "1px solid var(--dl-grid)", padding: "0.75rem 0", marginBottom: "clamp(2.5rem,5vw,4rem)" }}
        >
          {(["dental", "admin"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              style={{
                background: tab === tabKey ? "var(--dl-mint)" : "none",
                border: "1px solid transparent",
                borderColor: tab === tabKey ? "var(--dl-mint)" : "transparent",
                color: tab === tabKey ? "var(--dl-base)" : "var(--dl-sage)",
                fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase",
                fontWeight: 600, padding: "0.6rem 1.35rem", borderRadius: 100, transition: "all 0.3s",
              }}
            >
              {tabKey === "dental" ? t("tabDental") : t("tabAdmin")}
            </button>
          ))}
        </Reveal>

        {/* ── PART B: Japandi editorial staggered grid ───────────────────
            Layout: 2-col mobile / 3-col desktop.
            Even-indexed cards (1, 3, 5…) shift down 3rem on desktop only
            via Tailwind's md:mt-12 — the md: prefix means the stagger is
            never applied on mobile, so the 2-col mobile grid stays flat.
            align-items: start prevents cells from stretching, which is
            what lets the vertical offset look intentional rather than broken.
        ──────────────────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 md:grid-cols-3"
          style={{ gap: "clamp(1.25rem,3vw,2.5rem)", alignItems: "start" }}
        >
          {list.map((d, i) => (
            <MemberCard
              key={d.name}
              d={d}
              stagger={i % 2 === 1}
              onClick={() => setActive(d)}
            />
          ))}
        </div>
      </div>

      {/* ── Philosophy quote ────────────────────────────────────────── */}
      <Reveal style={{ padding: "clamp(2rem,4vw,3rem) 0", borderBottom: "1px solid var(--dl-grid)" }}>
        <div className="w-full px-[clamp(1.5rem,5vw,6rem)]">
          <div className="text-center mx-auto" style={{ maxWidth: 800 }}>
            <p className="text-label" style={{ marginBottom: "1.5rem" }}>{t("philosophy")}</p>
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--dl-white)", fontSize: "clamp(1.25rem,2.5vw,2rem)", lineHeight: 1.5, letterSpacing: "-0.015em", margin: "1.5rem 0" }}>
              {t("quote")}
            </blockquote>
            <p className="text-label" style={{ marginTop: "1.5rem", color: "rgba(163,184,153,0.6)" }}>{t("quoteAttrib")}</p>
          </div>
        </div>
      </Reveal>

      {/* ── Profile modal ───────────────────────────────────────────── */}
      {active && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ padding: "1.5rem" }}>
          <div
            className="absolute inset-0"
            style={{ background: "rgba(5,10,8,0.72)", backdropFilter: "blur(6px)", animation: "modalFade 0.3s ease both" }}
            onClick={() => setActive(null)}
          />
          <div
            className="relative w-full overflow-auto"
            style={{ zIndex: 1, maxWidth: 620, maxHeight: "88vh", background: "var(--dl-base)", border: "1px solid var(--dl-grid-hover)", padding: "clamp(2rem,4vw,3rem)", animation: "modalPop 0.4s var(--ease-magnetic) both" }}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute flex items-center justify-center"
              style={{ top: "1.1rem", right: "1.1rem", width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--dl-grid)", background: "var(--dl-surface)", color: "var(--dl-sage)" }}
              aria-label="Close profile"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-6 mb-7" style={{ paddingRight: "2.5rem" }}>
              <div className="overflow-hidden flex-shrink-0 relative" style={{ width: 96, height: 96, borderRadius: "50%", border: "1px solid var(--dl-grid)" }}>
                <Image src={getImage(active.name)} alt={active.name} fill sizes="96px" style={{ objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div>
                <p className="text-label">{active.specialty}</p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--dl-white)", fontSize: "clamp(1.5rem,3vw,2rem)", letterSpacing: "-0.02em", margin: "0.35rem 0 0.3rem" }}>{active.name}</h3>
                <p style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dl-sage)" }}>{active.role}</p>
              </div>
            </div>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "var(--dl-sage)", marginBottom: "1.75rem" }}>{active.bio}</p>
            <div className="flex flex-col gap-2" style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--dl-grid)" }}>
              {active.credentials.map((c) => (
                <div key={c} className="flex items-center gap-2">
                  <span style={{ width: 14, height: 1, background: "var(--dl-sage)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--dl-sage)" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
