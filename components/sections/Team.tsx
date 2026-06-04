"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import Reveal from "@/components/anim/Reveal";
import AnimatedHeading from "@/components/anim/AnimatedHeading";
import { SMILE_IMG, type Person } from "@/lib/data";
import { useTranslations } from "next-intl";

type TranslatedPerson = {
  name: string; role: string; specialty: string; highlight: string;
  credentials: string[]; bio: string;
};

const images: Record<string, string> = {
  "Dr. Tam Do": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=480&h=480&fit=crop&crop=face",
  "Dr. Largani": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=480&h=480&fit=crop&crop=face",
  "Sarah Whitfield": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=480&h=480&fit=crop&crop=face",
  "Daniel Cho": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=480&h=480&fit=crop&crop=face",
  "Maria Alvarez": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=480&fit=crop&crop=face",
  "Priya Nair": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=480&h=480&fit=crop&crop=face",
  "Emily Tran": "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=480&h=480&fit=crop&crop=face",
};

const enNames: Record<string, string> = {
  "Dr. Tam Do": "Dr. Tam Do",
  "Dr Tam Do": "Dr. Tam Do",
  "Do 医生": "Dr. Tam Do",
  "Dr. Largani": "Dr. Largani",
  "Dr Largani": "Dr. Largani",
  "Largani 医生": "Dr. Largani",
  "Sarah Whitfield": "Sarah Whitfield",
  "Daniel Cho": "Daniel Cho",
  "Maria Alvarez": "Maria Alvarez",
  "Priya Nair": "Priya Nair",
  "Emily Tran": "Emily Tran",
};

function getImage(name: string): string {
  const key = enNames[name] ?? name;
  return images[key] ?? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=480&h=480&fit=crop&crop=face";
}

export default function Team() {
  const t = useTranslations("team");
  const dentalTeam = t.raw("dental") as TranslatedPerson[];
  const adminTeam = t.raw("admin") as TranslatedPerson[];

  const [tab, setTab] = useState<"dental" | "admin">("dental");
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
      <div className="w-full px-[clamp(1.5rem,5vw,6rem)]" style={{ paddingTop: "clamp(2.5rem,5vw,3.5rem)", paddingBottom: "clamp(2.5rem,5vw,3.5rem)" }}>
        <Reveal><p className="text-label" style={{ marginBottom: "1rem" }}>{t("label")}</p></Reveal>
        <AnimatedHeading style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "var(--dl-white)", letterSpacing: "-0.02em", lineHeight: 1.08, fontSize: "clamp(1.75rem,3.5vw,2.6rem)", maxWidth: "16ch", marginBottom: "clamp(1.5rem,3vw,2.25rem)" }}>
          {t("heading1")} <em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading2")}</em> {t("heading3")}
        </AnimatedHeading>

        <div className="grid grid-cols-1 items-center" style={{ gap: "clamp(1.25rem,2.5vw,2rem)", paddingBottom: "clamp(1.75rem,3.5vw,2.5rem)", gridTemplateColumns: "1fr" }}>
          <div className="grid grid-cols-1 md:grid-cols-[0.45fr_1fr] items-center" style={{ gap: "clamp(1.25rem,2.5vw,2rem)" }}>
            <Reveal className="relative overflow-hidden" style={{ aspectRatio: "4/3", border: "1px solid var(--dl-grid)", background: "var(--dl-surface)" }}>
              <Image src={SMILE_IMG} alt="A confident, healthy smile" fill sizes="40vw" style={{ objectFit: "cover", filter: "brightness(0.88) saturate(0.88)" }} />
              <div className="absolute" style={{ left: "1.25rem", bottom: "1.25rem", padding: "0.5rem 0.75rem", border: "1px solid var(--dl-grid)", background: "rgba(13,25,20,0.82)", backdropFilter: "blur(8px)" }}>
                <span className="text-label">{t("cosmeticTag")}</span>
              </div>
            </Reveal>
            <div>
              <Reveal as="p" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, color: "var(--dl-white)", fontSize: "clamp(1.05rem,1.6vw,1.35rem)", lineHeight: 1.5, letterSpacing: "-0.012em", marginBottom: "1.1rem" }}>
                {t("intro1")}
              </Reveal>
              <Reveal as="p" delay={0.1} style={{ fontSize: "0.875rem", lineHeight: 1.8, color: "var(--dl-sage)", maxWidth: "48ch", paddingLeft: "1.25rem", borderLeft: "1px solid var(--dl-grid)" }}>
                {t("intro2")}
              </Reveal>
            </div>
          </div>
        </div>

        <Reveal className="flex gap-2 justify-center flex-wrap" style={{ borderTop: "1px solid var(--dl-grid)", borderBottom: "1px solid var(--dl-grid)", padding: "0.85rem 0", marginBottom: "clamp(1.5rem,3vw,2.25rem)" }}>
          {(["dental", "admin"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              style={{ background: tab === tabKey ? "var(--dl-mint)" : "none", border: "1px solid transparent", borderColor: tab === tabKey ? "var(--dl-mint)" : "transparent", color: tab === tabKey ? "var(--dl-base)" : "var(--dl-sage)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, padding: "0.6rem 1.35rem", borderRadius: 100, transition: "all 0.3s" }}
            >
              {tabKey === "dental" ? t("tabDental") : t("tabAdmin")}
            </button>
          ))}
        </Reveal>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "clamp(0.75rem,1.5vw,1.25rem)" }}>
          {list.map((d, i) => {
            const img = getImage(d.name);
            return (
              <button
                key={d.name}
                onClick={() => setActive(d)}
                className="relative flex flex-col items-center text-center group"
                style={{ padding: "clamp(1.25rem,2vw,1.75rem) 1rem 1.25rem", background: "var(--dl-surface)", border: "1px solid var(--dl-grid)", cursor: "pointer", animation: `tmRise 0.6s var(--ease-stagger) both`, animationDelay: `${i * 0.06}s`, transition: "border-color 0.4s, transform 0.4s, background 0.4s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--dl-grid-hover)"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.background = "#14241D"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--dl-grid)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "var(--dl-surface)"; }}
                aria-label={`View profile of ${d.name}`}
              >
                <span className="absolute flex items-center justify-center" style={{ top: "1rem", right: "1rem", width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--dl-grid)", color: "var(--dl-sage)", transition: "all 0.4s" }}>
                  <ArrowUpRight size={16} />
                </span>
                <span className="overflow-hidden" style={{ width: "clamp(88px,11vw,116px)", height: "clamp(88px,11vw,116px)", borderRadius: "50%", marginBottom: "0.9rem", border: "1px solid var(--dl-grid)", background: "var(--dl-base)", display: "block", position: "relative" }}>
                  <Image src={img} alt={d.name} fill sizes="148px" style={{ objectFit: "cover", objectPosition: "center top" }} />
                </span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.18rem", color: "var(--dl-white)", fontWeight: 500, letterSpacing: "-0.01em", marginBottom: "0.45rem" }}>{d.name}</span>
                <span style={{ fontSize: "0.68rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "var(--dl-sage)" }}>{d.role}</span>
              </button>
            );
          })}
        </div>
      </div>

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

      {active && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ padding: "1.5rem" }}>
          <div className="absolute inset-0" style={{ background: "rgba(5,10,8,0.72)", backdropFilter: "blur(6px)", animation: "modalFade 0.3s ease both" }} onClick={() => setActive(null)} />
          <div className="relative w-full overflow-auto" style={{ zIndex: 1, maxWidth: 620, maxHeight: "88vh", background: "var(--dl-base)", border: "1px solid var(--dl-grid-hover)", padding: "clamp(2rem,4vw,3rem)", animation: "modalPop 0.4s var(--ease-magnetic) both" }}>
            <button onClick={() => setActive(null)} className="absolute flex items-center justify-center" style={{ top: "1.1rem", right: "1.1rem", width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--dl-grid)", background: "var(--dl-surface)", color: "var(--dl-sage)" }} aria-label="Close profile"><X size={16} /></button>
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
