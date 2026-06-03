"use client";
import { Phone, MapPin, Clock } from "lucide-react";
import MagneticButton from "@/components/anim/MagneticButton";
import { useBooking } from "@/lib/BookingContext";
import { useTranslations } from "next-intl";

const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

export default function Footer() {
  const t = useTranslations("footer");
  const { open: openBooking } = useBooking();

  const services = t.raw("services") as string[];
  const clinic = t.raw("clinic") as [string, string][];

  return (
    <footer style={{ background: "var(--dl-deep)" }}>
      <div className="grid-line" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ borderBottom: "1px solid var(--dl-grid)" }}>
        <div className="flex flex-col justify-between" style={{ padding: "clamp(2.5rem,4vw,3rem)", gap: "2.5rem", borderRight: "1px solid var(--dl-grid)" }}>
          <div>
            <div className="inline-flex items-baseline gap-2" style={{ marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: "1.7rem", color: "var(--dl-white)" }}>Kingsgate</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: "italic", fontSize: "1.7rem", color: "var(--dl-sage)" }}>Dental</span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--dl-sage)", lineHeight: 1.8, maxWidth: 240 }}>{t("tagline")}</p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="tel:6048799999" className="flex items-start gap-2" style={{ color: "var(--dl-sage)", fontSize: "0.875rem", lineHeight: 1.7 }}><Phone size={13} style={{ marginTop: 3 }} /> (604) 879-9999</a>
            <div className="flex items-start gap-2" style={{ color: "var(--dl-sage)", fontSize: "0.875rem", lineHeight: 1.7 }}><MapPin size={13} style={{ marginTop: 3, flexShrink: 0 }} /><span>370 East Broadway<br />Vancouver BC V5T 1X4</span></div>
            <div className="flex items-start gap-2" style={{ color: "var(--dl-sage)", fontSize: "0.875rem", lineHeight: 1.7 }}><Clock size={13} style={{ marginTop: 3, flexShrink: 0 }} /><span>{t("hours")}</span></div>
          </div>
        </div>

        <div style={{ padding: "clamp(2.5rem,4vw,3rem)", borderRight: "1px solid var(--dl-grid)" }}>
          <p className="text-label" style={{ marginBottom: "1.5rem", color: "rgba(163,184,153,0.6)" }}>{t("servicesLabel")}</p>
          <ul className="flex flex-col gap-3">
            {services.map((s) => (
              <li key={s}><button onClick={() => scrollTo("#services")} style={{ background: "none", border: "none", textAlign: "left", color: "var(--dl-sage)", fontSize: "0.875rem" }}>{s}</button></li>
            ))}
          </ul>
        </div>

        <div style={{ padding: "clamp(2.5rem,4vw,3rem)", borderRight: "1px solid var(--dl-grid)" }}>
          <p className="text-label" style={{ marginBottom: "1.5rem", color: "rgba(163,184,153,0.6)" }}>{t("clinicLabel")}</p>
          <ul className="flex flex-col gap-3">
            {clinic.map(([label, href]) => (
              <li key={label}><button onClick={() => scrollTo(href)} style={{ background: "none", border: "none", textAlign: "left", color: "var(--dl-sage)", fontSize: "0.875rem" }}>{label}</button></li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between" style={{ padding: "clamp(2.5rem,4vw,3rem)", gap: "2rem" }}>
          <div>
            <p className="text-label" style={{ color: "rgba(163,184,153,0.6)" }}>{t("newPatientsLabel")}</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 500, color: "var(--dl-white)", lineHeight: 1.4, margin: "1rem 0 1.5rem" }}>{t("newPatientsHeading")}</p>
            <MagneticButton className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={openBooking}>{t("cta")}</MagneticButton>
          </div>
          <div>
            <p className="text-label" style={{ marginBottom: "0.75rem", color: "rgba(163,184,153,0.6)" }}>{t("emergencyLabel")}</p>
            <a href="tel:6048799999" style={{ color: "var(--dl-sage)", fontSize: "0.875rem" }}>{t("emergencyText")}</a>
          </div>
        </div>
      </div>

      <div className="w-full px-[clamp(1.5rem,5vw,6rem)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ padding: "1.5rem clamp(1.5rem,5vw,6rem)" }}>
        <p style={{ fontSize: "0.75rem", color: "rgba(163,184,153,0.4)" }}>{t("copyright", { year: new Date().getFullYear() })}</p>
        <p style={{ fontSize: "0.75rem", color: "rgba(163,184,153,0.4)" }}>{t("footerAddress")}</p>
      </div>
    </footer>
  );
}
