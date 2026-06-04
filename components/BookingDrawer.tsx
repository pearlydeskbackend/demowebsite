"use client";
import { useRef, useEffect, useState, useCallback, FormEvent } from "react";
import { X, ChevronLeft, CalendarX, Check } from "lucide-react";
import { useBooking } from "@/lib/BookingContext";
import { getAvailableSlots, createBooking } from "@/lib/bookingService";
import { useTranslations } from "next-intl";

const OPT_BG = "#d8ecce";
const OPT_FG = "#0D1914";
const TODAY   = new Date().toISOString().split("T")[0];

type F = {
  name: string; email: string; phone: string;
  service: string; date: string; time: string; notes: string;
  newPatient: boolean; consent: boolean;
};
type Err       = Partial<Record<keyof F, string>>;
type SlotState = "idle" | "loading" | "empty" | "ready";
type UiStep    = "when" | "who";

const EMPTY: F = {
  name: "", email: "", phone: "",
  service: "", date: "", time: "", notes: "",
  newPatient: false, consent: false,
};

function fmtLong(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
}
function fmtShort(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
}

interface Props { showBranding?: boolean; }

export default function BookingDrawer({ showBranding = true }: Props) {
  const t = useTranslations("booking");
  const serviceOptions = t.raw("services") as string[];

  const { isOpen, close } = useBooking();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [form,   setForm]   = useState<F>(EMPTY);
  const [errors, setErrors] = useState<Err>({});
  const [uiStep, setUiStep] = useState<UiStep>("when");
  const [slotState, setSlotState] = useState<SlotState>("idle");
  const [slots,     setSlots]     = useState<string[]>([]);
  const [submitting,     setSubmitting]     = useState(false);
  const [submitted,      setSubmitted]      = useState(false);
  const [confirmationId, setConfirmationId] = useState("");

  function validateStep2(f: F): Err {
    const e: Err = {};
    if (!f.name.trim()) e.name = t("required");
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = t("invalidEmail");
    if (!f.consent) e.consent = t("consentRequired");
    return e;
  }

  useEffect(() => {
    if (!form.service || !form.date) { setSlotState("idle"); setSlots([]); setForm((f) => ({ ...f, time: "" })); return; }
    let cancelled = false;
    setSlotState("loading"); setSlots([]); setForm((f) => ({ ...f, time: "" })); setErrors((e) => ({ ...e, time: undefined }));
    getAvailableSlots(form.service, form.date).then((result) => {
      if (cancelled) return;
      setSlots(result); setSlotState(result.length === 0 ? "empty" : "ready");
    });
    return () => { cancelled = true; };
  }, [form.service, form.date]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const sel = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const timer = setTimeout(() => drawer.querySelectorAll<HTMLElement>(sel)[0]?.focus(), 310);
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(drawer.querySelectorAll<HTMLElement>(sel));
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first?.focus(); } }
    };
    document.addEventListener("keydown", trap);
    return () => { clearTimeout(timer); document.removeEventListener("keydown", trap); };
  }, [isOpen, submitted, uiStep]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setForm(EMPTY); setErrors({}); setSlots([]); setSlotState("idle");
        setSubmitting(false); setSubmitted(false); setConfirmationId(""); setUiStep("when");
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const set = useCallback(
    (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
    []
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateStep2(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const result = await createBooking(form);
      setConfirmationId(result.confirmationId);
      setSubmitted(true);
    } finally { setSubmitting(false); }
  };

  const goBack = () => { setErrors({}); setUiStep("when"); };
  const goNext = () => { setErrors({}); setUiStep("who"); };

  const field: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.55)", border: "1px solid rgba(13,25,20,0.16)", borderRadius: 6, padding: "0.75rem 1rem", color: "#0D1914", fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.925rem", outline: "none", colorScheme: "light", transition: "border-color 0.25s" };
  const selectField: React.CSSProperties = { ...field, background: OPT_BG, color: OPT_FG };
  const lbl: React.CSSProperties = { fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--dl-sage)", display: "block", marginBottom: "0.4rem" };
  const err: React.CSSProperties = { fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.7rem", color: "#f87171", marginTop: "0.3rem" };
  const onFocus = (el: HTMLElement) => { el.style.borderColor = "rgba(13,25,20,0.45)"; };
  const onBlur  = (el: HTMLElement, hasErr: boolean) => { el.style.borderColor = hasErr ? "#f87171" : "rgba(13,25,20,0.16)"; };
  const primaryBtn = (disabled = false): React.CSSProperties => ({ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", background: disabled ? "rgba(13,25,20,0.12)" : "var(--dl-mint)", color: "var(--dl-base)", fontFamily: "'Satoshi','Inter',sans-serif", fontWeight: 500, fontSize: "0.9rem", padding: "0.95rem 2.25rem", borderRadius: 999, border: "1px solid var(--dl-mint)", cursor: disabled ? "default" : "pointer", transition: "background 0.4s var(--ease-magnetic), color 0.4s var(--ease-magnetic)" });

  return (
    <>
      <div aria-hidden="true" onClick={close} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none", transition: "opacity 300ms ease" }} />

      <div
        ref={drawerRef}
        role="dialog" aria-modal="true"
        aria-label="Book an appointment at Kingsgate Dental"
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 100, width: "min(100vw, 460px)", background: "#E6F0DC", borderLeft: "1px solid rgba(13,25,20,0.12)", display: "flex", flexDirection: "column", transform: isOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)", overflowY: "auto",
          // Override CSS variables for light-mint theme
          "--dl-deep": "#E6F0DC", "--dl-base": "#c8e8c0", "--dl-surface": "rgba(255,255,255,0.45)",
          "--dl-white": "#0D1914", "--dl-sage": "rgba(13,25,20,0.56)", "--dl-mint": "#5BAF82",
          "--dl-grid": "rgba(13,25,20,0.10)", "--dl-grid-hover": "rgba(13,25,20,0.20)",
        } as React.CSSProperties}
      >
        <div style={{ padding: "1.75rem 2rem 1.25rem", borderBottom: "1px solid var(--dl-grid)", flexShrink: 0, position: "sticky", top: 0, background: "var(--dl-deep)", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--dl-sage)", marginBottom: "0.5rem" }}>Kingsgate Dental</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500, fontSize: "clamp(1.375rem,3vw,1.75rem)", letterSpacing: "-0.03em", color: "var(--dl-white)", lineHeight: 1.15, margin: 0 }}>
                {t("heading").split(" ").slice(0, -1).join(" ")}{" "}
                <em style={{ fontStyle: "italic", color: "var(--dl-mint)" }}>{t("heading").split(" ").at(-1)}</em>
              </h2>
            </div>
            <button onClick={close} aria-label="Close booking form" style={{ flexShrink: 0, marginLeft: "1rem", background: "none", border: "1px solid var(--dl-grid)", color: "var(--dl-sage)", cursor: "pointer", padding: "0.4rem", lineHeight: 1, transition: "border-color 0.2s, color 0.2s" }} onMouseEnter={(e) => { const b = e.currentTarget; b.style.borderColor = "var(--dl-grid-hover)"; b.style.color = "var(--dl-white)"; }} onMouseLeave={(e) => { const b = e.currentTarget; b.style.borderColor = "var(--dl-grid)"; b.style.color = "var(--dl-sage)"; }}>
              <X size={16} />
            </button>
          </div>

          {!submitted && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.85rem" }}>
              {(["when", "who"] as UiStep[]).map((s) => (
                <span key={s} style={{ width: uiStep === s ? 18 : 6, height: 6, borderRadius: 999, background: uiStep === s ? "var(--dl-mint)" : "rgba(13,25,20,0.18)", transition: "all 0.35s var(--ease-magnetic)", display: "inline-block" }} />
              ))}
              <span style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(13,25,20,0.40)", marginLeft: "0.25rem" }}>
                {t("step", { step: uiStep === "when" ? "1" : "2" })}
              </span>
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: "1.75rem 2rem 2rem", overflowY: "auto" }}>
          {submitted ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.25rem", paddingTop: "0.5rem" }}>
              <span style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(163,184,153,0.10)", border: "1px solid var(--dl-mint)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={24} color="var(--dl-mint)" strokeWidth={1.5} />
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 500, color: "var(--dl-white)", letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}>{t("successTitle")}</h3>
                <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "1rem", color: "var(--dl-mint)", fontWeight: 500, margin: 0 }}>
                  {fmtLong(form.date)} at {form.time}
                </p>
              </div>
              <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.875rem", color: "var(--dl-sage)", lineHeight: 1.75, maxWidth: 300, margin: 0 }}>
                {t("successNote", { email: form.email, name: form.name.split(" ")[0] })}
              </p>
              {confirmationId && (
                <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(13,25,20,0.38)", margin: 0 }}>
                  {t("refNum", { id: confirmationId })}
                </p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", marginTop: "0.5rem" }}>
                <button onClick={close} style={primaryBtn()} onMouseEnter={(e) => { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = "var(--dl-mint)"; }} onMouseLeave={(e) => { const b = e.currentTarget; b.style.background = "var(--dl-mint)"; b.style.color = "var(--dl-base)"; }}>{t("done")}</button>
                <button onClick={() => { setSubmitted(false); setForm(EMPTY); setSlotState("idle"); setSlots([]); setErrors({}); setConfirmationId(""); setUiStep("when"); }} style={{ width: "100%", background: "transparent", color: "var(--dl-sage)", fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.82rem", padding: "0.6rem", border: "none", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--dl-white)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--dl-sage)"; }}>{t("bookAnother")}</button>
              </div>
            </div>

          ) : uiStep === "when" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label htmlFor="bk-service" style={lbl}>{t("serviceLabel")} <span style={{ color: "var(--dl-mint)" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <select id="bk-service" value={form.service} onChange={set("service")} style={{ ...selectField, appearance: "none", paddingRight: "2.5rem" }} onFocus={(e) => onFocus(e.target as HTMLElement)} onBlur={(e) => onBlur(e.target as HTMLElement, false)}>
                    <option value="" disabled style={{ background: OPT_BG, color: "rgba(163,184,153,0.5)" }}>{t("servicePlaceholder")}</option>
                    {serviceOptions.map((s) => <option key={s} value={s} style={{ background: OPT_BG, color: OPT_FG }}>{s}</option>)}
                  </select>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><path d="M2 4 L6 8 L10 4" stroke="var(--dl-sage)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>

              <div>
                <label htmlFor="bk-date" style={lbl}>{t("dateLabel")} <span style={{ color: "var(--dl-mint)" }}>*</span></label>
                <input id="bk-date" type="date" min={TODAY} value={form.date} onChange={set("date")} style={field} onFocus={(e) => onFocus(e.target as HTMLElement)} onBlur={(e) => onBlur(e.target as HTMLElement, false)} />
              </div>

              <div>
                <p style={{ ...lbl, marginBottom: "0.6rem" }}>{t("timesLabel")} <span style={{ color: "var(--dl-mint)" }}>*</span></p>
                {slotState === "idle" && <div style={{ border: "1px solid rgba(13,25,20,0.10)", borderRadius: 6, padding: "1rem 1.25rem", color: "rgba(13,25,20,0.35)", fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.85rem" }}>{t("idleSlots")}</div>}
                {slotState === "loading" && (
                  <div className="skeleton-pulse" style={{ borderRadius: 6, background: "rgba(13,25,20,0.04)", border: "1px solid rgba(13,25,20,0.10)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", border: "1.5px solid var(--dl-sage)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite", display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.82rem", color: "rgba(13,25,20,0.40)" }}>{t("checking")}</span>
                  </div>
                )}
                {slotState === "empty" && (
                  <div style={{ border: "1px solid rgba(13,25,20,0.10)", borderRadius: 6, padding: "1rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <CalendarX size={15} style={{ color: "var(--dl-sage)", flexShrink: 0, marginTop: "0.1rem" }} />
                    <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.82rem", color: "var(--dl-sage)", lineHeight: 1.6, margin: 0 }}>{t("noTimes")}</p>
                  </div>
                )}
                {slotState === "ready" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                    {slots.map((slot) => {
                      const sel = form.time === slot;
                      return (
                        <button key={slot} type="button" onClick={() => setForm((f) => ({ ...f, time: slot }))} style={{ padding: "0.6rem 0.25rem", borderRadius: 6, border: `1px solid ${sel ? "var(--dl-mint)" : "rgba(13,25,20,0.16)"}`, background: sel ? "rgba(13,25,20,0.08)" : "transparent", color: sel ? "var(--dl-mint)" : "var(--dl-sage)", fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.8rem", fontWeight: sel ? 600 : 400, cursor: "pointer", transition: "border-color 0.2s, background 0.2s, color 0.2s", textAlign: "center" }}>{slot}</button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ paddingTop: "0.5rem", borderTop: "1px solid var(--dl-grid)", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {form.time && <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.75rem", color: "var(--dl-sage)", textAlign: "center", margin: 0 }}>{t("selected")} <strong style={{ color: "var(--dl-mint)", fontWeight: 600 }}>{form.time}</strong>{form.date && <> · {fmtShort(form.date)}</>}</p>}
                <button type="button" disabled={!form.time || slotState !== "ready"} onClick={goNext} style={primaryBtn(!form.time || slotState !== "ready")} onMouseEnter={(e) => { if (form.time && slotState === "ready") { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = "var(--dl-mint)"; } }} onMouseLeave={(e) => { if (form.time && slotState === "ready") { const b = e.currentTarget; b.style.background = "var(--dl-mint)"; b.style.color = "var(--dl-base)"; } }}>{t("continue")}</button>
              </div>
            </div>

          ) : (
            <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button type="button" onClick={goBack} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", color: "var(--dl-sage)", fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.8rem", cursor: "pointer", padding: 0, transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--dl-white)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--dl-sage)"; }}>
                  <ChevronLeft size={14} /> {t("back")}
                </button>
                <div style={{ background: "rgba(13,25,20,0.04)", border: "1px solid var(--dl-grid)", borderRadius: 6, padding: "0.7rem 1rem" }}>
                  <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.78rem", color: "var(--dl-mint)", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{form.service}</p>
                  <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.75rem", color: "var(--dl-sage)", margin: "0.2rem 0 0", lineHeight: 1.4 }}>{fmtShort(form.date)} · {form.time}</p>
                </div>
              </div>

              <div>
                <label htmlFor="bk-name" style={lbl}>{t("nameLabel")} <span style={{ color: "var(--dl-mint)" }}>*</span></label>
                <input id="bk-name" type="text" autoComplete="name" value={form.name} onChange={set("name")} placeholder="Jane Smith" style={{ ...field, borderColor: errors.name ? "#f87171" : undefined }} onFocus={(e) => onFocus(e.target as HTMLElement)} onBlur={(e) => onBlur(e.target as HTMLElement, !!errors.name)} />
                {errors.name && <p style={err}>{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="bk-email" style={lbl}>{t("emailLabel")} <span style={{ color: "var(--dl-mint)" }}>*</span></label>
                <input id="bk-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="jane@email.com" style={{ ...field, borderColor: errors.email ? "#f87171" : undefined }} onFocus={(e) => onFocus(e.target as HTMLElement)} onBlur={(e) => onBlur(e.target as HTMLElement, !!errors.email)} />
                {errors.email && <p style={err}>{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="bk-phone" style={lbl}>{t("phoneLabel")} <span style={{ color: "rgba(13,25,20,0.38)" }}>{t("phoneOptional")}</span></label>
                <input id="bk-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="(604) 555-0100" style={field} onFocus={(e) => onFocus(e.target as HTMLElement)} onBlur={(e) => onBlur(e.target as HTMLElement, false)} />
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", cursor: "pointer" }}>
                <input type="checkbox" checked={form.newPatient} onChange={(e) => setForm((f) => ({ ...f, newPatient: e.target.checked }))} style={{ marginTop: "0.15rem", accentColor: "var(--dl-mint)", flexShrink: 0, width: 15, height: 15 }} />
                <span style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.82rem", color: "var(--dl-sage)", lineHeight: 1.5 }}>{t("newPatient")}</span>
              </label>

              <div>
                <label htmlFor="bk-notes" style={lbl}>{t("notesLabel")} <span style={{ color: "rgba(13,25,20,0.38)" }}>{t("phoneOptional")}</span></label>
                <textarea id="bk-notes" rows={2} value={form.notes} onChange={set("notes")} placeholder={t("notesPlaceholder")} style={{ ...field, resize: "vertical", minHeight: 68 }} onFocus={(e) => onFocus(e.target as HTMLElement)} onBlur={(e) => onBlur(e.target as HTMLElement, false)} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", paddingTop: "0.25rem", borderTop: "1px solid var(--dl-grid)" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.consent} onChange={(e) => { setForm((f) => ({ ...f, consent: e.target.checked })); setErrors((er) => ({ ...er, consent: undefined })); }} style={{ marginTop: "0.15rem", accentColor: "var(--dl-mint)", flexShrink: 0, width: 15, height: 15 }} />
                  <span style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.72rem", color: "var(--dl-sage)", lineHeight: 1.6 }}>
                    {t("consent")} <span style={{ color: "var(--dl-mint)" }}>*</span>
                  </span>
                </label>
                {errors.consent && <p style={{ ...err, marginTop: "-0.4rem" }}>{errors.consent}</p>}

                <button type="submit" disabled={submitting} style={primaryBtn(submitting)} onMouseEnter={(e) => { if (!submitting) { const b = e.currentTarget; b.style.background = "transparent"; b.style.color = "var(--dl-mint)"; } }} onMouseLeave={(e) => { if (!submitting) { const b = e.currentTarget; b.style.background = "var(--dl-mint)"; b.style.color = "var(--dl-base)"; } }}>
                  {submitting ? (
                    <><span style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid var(--dl-base)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />{t("confirming")}</>
                  ) : (
                    t("confirm", { time: form.time })
                  )}
                </button>

                <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.68rem", color: "rgba(13,25,20,0.38)", textAlign: "center", margin: 0, lineHeight: 1.6 }}>{t("confirmNote")}</p>
              </div>
            </form>
          )}
        </div>

        {showBranding && (
          <div style={{ flexShrink: 0, padding: "0.7rem 2rem 1rem", borderTop: "1px solid var(--dl-grid)", textAlign: "center" }}>
            <p style={{ fontFamily: "'Satoshi','Inter',sans-serif", fontSize: "0.64rem", letterSpacing: "0.04em", color: "rgba(13,25,20,0.35)", margin: 0 }}>
              Powered by{" "}
              <a href="https://connomi.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(13,25,20,0.55)", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--dl-mint)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(13,25,20,0.55)"; }}>Connomi</a>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
