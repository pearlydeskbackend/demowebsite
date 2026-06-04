"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { useBooking } from "@/lib/BookingContext";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale, type Locale } from "@/lib/i18n";

export default function Nav() {
  const t = useTranslations("nav");
  const { locale, setLocale } = useLocale();

  const links = [
    { label: t("about"), href: "#about" },
    { label: t("services"), href: "#services" },
    { label: t("office"), href: "#office" },
    { label: t("team"), href: "#team" },
    { label: t("faq"), href: "#faq" },
    { label: t("contacts"), href: "#contact" },
  ];

  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open: openBooking } = useBooking();
  const [active, setActive] = useState("about");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = links.map((l) => document.querySelector(l.href));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => s && io.observe(s));

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(navRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const langLabels: Record<Locale, string> = { EN: "English", FR: "Français", "中文": "中文" };

  return (
    <>
      <header
        ref={navRef}
        style={{ opacity: 0 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/*
          Frosted backdrop — lives in its own layer so the gradient mask
          only clips the blur, never the nav text.
          Extends 4rem below the bar then fades to transparent.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "calc(100% + 4rem)",
            background: scrolled ? "rgba(13,25,20,0.86)" : "rgba(13,25,20,0.40)",
            backdropFilter: "blur(22px) saturate(160%)",
            WebkitBackdropFilter: "blur(22px) saturate(160%)",
            maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
            transition: "background 0.5s ease",
          }}
        />
        {/* Nav content — position:relative sits above the blur layer in DOM order */}
        <div className="relative w-full pl-[clamp(1.5rem,5vw,6rem)] pr-0 md:px-[clamp(1.5rem,5vw,6rem)]">
          <div
            className="flex items-center justify-between xl:grid xl:items-center"
            style={{ gridTemplateColumns: "1fr auto 1fr", height: "5rem", gap: "1.5rem" }}
          >
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-baseline gap-2 justify-self-start"
              aria-label="Kingsgate Dental — home"
            >
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--dl-white)" }}>
                Kingsgate
              </span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--dl-sage)" }}>
                Dental
              </span>
            </button>

            {/* Center nav */}
            <nav className="justify-self-center hidden xl:block">
              <div className="flex items-center" style={{ gap: "3rem" }}>
                {links.map((l) => (
                  <button
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    className="relative"
                    style={{
                      background: "none", border: "none",
                      color: active === l.href.slice(1) ? "var(--dl-white)" : "var(--dl-sage)",
                      fontSize: "1.05rem", letterSpacing: "0.005em", fontWeight: 400,
                      transition: "color 0.4s var(--ease-magnetic)", paddingBottom: "0.35rem", whiteSpace: "nowrap",
                    }}
                  >
                    {l.label}
                    <span
                      className="absolute left-0 bottom-0"
                      style={{
                        height: "1.5px", background: "var(--dl-mint)",
                        width: active === l.href.slice(1) ? "100%" : "0%",
                        transition: "width 0.4s var(--ease-magnetic)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-5 justify-self-end">
              {/* Language */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1"
                  style={{ background: "none", border: "none", color: "var(--dl-sage)", fontSize: "1rem", fontWeight: 500, letterSpacing: "0.06em", transition: "color 0.3s" }}
                >
                  {locale} <ChevronDown size={14} style={{ transition: "transform 0.3s", transform: langOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {langOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+0.85rem)] min-w-[156px] flex flex-col"
                    style={{ background: "rgba(13,25,20,0.97)", backdropFilter: "blur(20px)", border: "1px solid var(--dl-grid-hover)", padding: "0.4rem", zIndex: 60 }}
                  >
                    {(["EN", "FR", "中文"] as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLocale(l); setLangOpen(false); }}
                        className="text-left px-3 py-2 text-sm transition-colors hover:bg-white/[0.07]"
                        style={{ color: l === locale ? "var(--dl-mint)" : "var(--dl-sage)", border: "none", background: "none" }}
                      >
                        {langLabels[l]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile burger */}
              <button
                className="xl:hidden"
                style={{ background: "none", border: "none", color: "var(--dl-white)", padding: "0.5rem" }}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-center"
        style={{
          background: "var(--dl-deep)",
          backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(163,184,153,0.05) 0%, transparent 60%)",
          padding: "5rem 2rem 3rem", gap: "1.5rem",
          opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.45s var(--ease-magnetic)",
        }}
      >
        {links.map((l, i) => (
          <button
            key={l.href}
            onClick={() => scrollTo(l.href)}
            className="text-left"
            style={{
              background: "none", border: "none", color: "var(--dl-white)",
              fontFamily: "'Playfair Display', serif", fontWeight: 500,
              fontSize: "clamp(2rem,8vw,3rem)", letterSpacing: "-0.02em",
              transform: menuOpen ? "translateY(0)" : "translateY(18px)",
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 0.5s var(--ease-magnetic) ${i * 0.06}s, transform 0.5s var(--ease-magnetic) ${i * 0.06}s`,
            }}
          >
            {l.label}
          </button>
        ))}
        <div className="flex flex-col gap-3 mt-6">
          <a href="tel:6048799999" className="flex items-center gap-2" style={{ color: "var(--dl-sage)", fontSize: "0.875rem" }}>
            <Phone size={14} /> 604 879 9999
          </a>
          <button className="btn-primary w-fit" onClick={() => { setMenuOpen(false); openBooking(); }}>
            {t("callMobile")}
          </button>
        </div>
      </div>
    </>
  );
}
