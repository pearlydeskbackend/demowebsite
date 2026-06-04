"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface BookingOrbProps {
  clinicName?: string;
  /** First bot message + the bubble that pops from the orb. */
  welcomeMessage?: string;
  /** Brand accent (glow, send button, user bubble). */
  accent?: string;
  /** Orb diameter in px. Default 120. */
  size?: number;
  /** Show the "Powered by Connomi" tag. Default true. */
  showBranding?: boolean;
  /** Connomi link. */
  connomiUrl?: string;
  className?: string;
}

interface Msg {
  id: string;
  role: "bot" | "user";
  text: string;
}

let _id = 0;
const nextId = () => `m${++_id}`;

// ── All component styles (bo- prefix prevents collisions) ──────────────────
const ORB_CSS = `
  .bo-root {
    position: fixed; right: 24px; bottom: max(24px, calc(env(safe-area-inset-bottom, 0px) + 16px)); z-index: 9999;
    display: flex; flex-direction: column; align-items: flex-end; gap: 14px;
    font-family: 'Satoshi', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* ─── ORB ───────────────────────────────────────────────────────── */
  .bo-orb {
    position: relative;
    width: var(--bo-size); height: var(--bo-size);
    border-radius: 50%;
    border: none; padding: 0; cursor: pointer;
    /* Near-white pearl base — very pale conic pastels */
    background: conic-gradient(
      from 200deg,
      #eef9f3 0%, #e8eeff 26%, #f2e9ff 52%, #fff4ee 76%, #eef9f3 100%
    );
    overflow: hidden;
    isolation: isolate;
    box-shadow:
      0 22px 52px -12px rgba(90,110,150,0.40),
      0 8px 20px -8px rgba(90,100,140,0.22),
      inset 0 2px 8px rgba(255,255,255,0.95);
    transition: transform 0.42s cubic-bezier(0.16,1,0.3,1), box-shadow 0.42s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .bo-orb:hover {
    transform: scale(1.06);
    box-shadow:
      0 26px 58px -10px rgba(90,110,150,0.44),
      0 10px 24px -6px rgba(90,100,140,0.26),
      inset 0 2px 8px rgba(255,255,255,0.95);
  }
  .bo-orb-pressed { transform: scale(0.96) !important; }

  /* Slow-rotating field wrapper — the whole palette drifts */
  .bo-field {
    position: absolute; inset: -22%; border-radius: 50%;
    animation: bo-rotate 32s linear infinite;
  }

  /* ── Fluid blobs ── */
  .bo-fluid {
    position: absolute; border-radius: 50%;
    mix-blend-mode: soft-light; will-change: transform;
  }
  /* Mint / sea-foam — top-left anchor */
  .bo-fluid-1 {
    width: 82%; height: 82%; left: 0%; top: -2%;
    background: radial-gradient(circle,
      rgba(48,210,135,0.90) 0%, rgba(68,200,148,0.40) 42%, transparent 70%);
    filter: blur(17px); opacity: 1;
    animation: bo-drift1 9s cubic-bezier(0.42,0.06,0.58,0.94) infinite;
  }
  /* Periwinkle blue — top-right anchor */
  .bo-fluid-2 {
    width: 80%; height: 80%; right: -4%; top: 2%;
    background: radial-gradient(circle,
      rgba(90,150,255,0.86) 0%, rgba(110,162,255,0.38) 42%, transparent 70%);
    filter: blur(19px); opacity: 1;
    animation: bo-drift2 12s cubic-bezier(0.42,0.06,0.58,0.94) infinite;
  }
  /* Soft lavender — bottom-left anchor */
  .bo-fluid-3 {
    width: 78%; height: 78%; left: -2%; bottom: -4%;
    background: radial-gradient(circle,
      rgba(185,125,248,0.80) 0%, rgba(195,135,255,0.35) 42%, transparent 70%);
    filter: blur(19px); opacity: 1;
    animation: bo-drift3 14.5s cubic-bezier(0.42,0.06,0.58,0.94) infinite;
  }
  /* Warm peach / amber — bottom-right anchor */
  .bo-fluid-4 {
    width: 84%; height: 84%; right: -6%; bottom: -6%;
    background: radial-gradient(circle,
      rgba(255,162,82,0.78) 0%, rgba(255,175,95,0.32) 42%, transparent 70%);
    filter: blur(17px); opacity: 1;
    animation: bo-drift4 10.5s cubic-bezier(0.42,0.06,0.58,0.94) infinite;
  }
  /* Pale rose centre — adds warmth / pearl depth */
  .bo-fluid-5 {
    width: 55%; height: 55%; left: 22%; top: 22%;
    background: radial-gradient(circle,
      rgba(255,205,225,0.55) 0%, transparent 65%);
    filter: blur(13px); opacity: 0.85;
    animation: bo-drift5 18s ease-in-out infinite;
  }

  /* On press: dramatically faster blobs = swirling feel */
  .bo-orb-pressed .bo-fluid-1 { animation-duration: 2.6s; }
  .bo-orb-pressed .bo-fluid-2 { animation-duration: 3.2s; }
  .bo-orb-pressed .bo-fluid-3 { animation-duration: 3.8s; }
  .bo-orb-pressed .bo-fluid-4 { animation-duration: 2.9s; }
  .bo-orb-pressed .bo-fluid-5 { animation-duration: 3.5s; }
  .bo-orb-pressed .bo-field   { animation-duration: 5s; }

  /* Organic drift paths — translation + scale + rotation = fluid */
  @keyframes bo-drift1 {
    0%   { transform: translate(0%,0%) scale(1) rotate(0deg); }
    25%  { transform: translate(24%,10%) scale(1.22) rotate(20deg); }
    50%  { transform: translate(14%,-16%) scale(0.84) rotate(-14deg); }
    75%  { transform: translate(-8%,12%) scale(1.12) rotate(24deg); }
    100% { transform: translate(0%,0%) scale(1) rotate(0deg); }
  }
  @keyframes bo-drift2 {
    0%   { transform: translate(0%,0%) scale(1) rotate(0deg); }
    25%  { transform: translate(-18%,14%) scale(0.85) rotate(-18deg); }
    50%  { transform: translate(-8%,20%) scale(1.22) rotate(10deg); }
    75%  { transform: translate(14%,6%) scale(0.92) rotate(-22deg); }
    100% { transform: translate(0%,0%) scale(1) rotate(0deg); }
  }
  @keyframes bo-drift3 {
    0%   { transform: translate(0%,0%) scale(1) rotate(0deg); }
    25%  { transform: translate(18%,-16%) scale(1.16) rotate(16deg); }
    50%  { transform: translate(-14%,-8%) scale(0.88) rotate(-12deg); }
    75%  { transform: translate(10%,16%) scale(1.08) rotate(20deg); }
    100% { transform: translate(0%,0%) scale(1) rotate(0deg); }
  }
  @keyframes bo-drift4 {
    0%   { transform: translate(0%,0%) scale(1) rotate(0deg); }
    25%  { transform: translate(-16%,-18%) scale(1.16) rotate(-16deg); }
    50%  { transform: translate(14%,-6%) scale(0.86) rotate(12deg); }
    75%  { transform: translate(-4%,18%) scale(1.12) rotate(-20deg); }
    100% { transform: translate(0%,0%) scale(1) rotate(0deg); }
  }
  @keyframes bo-drift5 {
    0%,100% { transform: translate(0%,0%) scale(1); }
    50%     { transform: translate(12%,10%) scale(1.18); }
  }
  @keyframes bo-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Glossy highlight — crisp white spot, top-left */
  .bo-sheen {
    position: absolute; inset: 0; border-radius: 50%;
    background: radial-gradient(
      ellipse 36% 30% at 30% 24%,
      rgba(255,255,255,1.00) 0%,
      rgba(255,255,255,0.62) 30%,
      rgba(255,255,255,0.18) 55%,
      transparent 70%
    );
    mix-blend-mode: screen; pointer-events: none;
  }
  /* Glass rim — inner edge glow + depth shadow */
  .bo-rim {
    position: absolute; inset: 0; border-radius: 50%;
    box-shadow:
      inset 0 0 0 1.5px rgba(255,255,255,0.52),
      inset -10px -12px 30px rgba(120,132,165,0.14),
      inset 4px 4px 10px rgba(255,255,255,0.20);
    pointer-events: none;
  }

  /* Respect prefers-reduced-motion */
  .bo-reduced .bo-fluid,
  .bo-reduced .bo-field { animation: none !important; }

  /* ─── WELCOME BUBBLE ─────────────────────────────────────────────── */
  .bo-bubble {
    position: relative; max-width: 240px;
    background: #09110E; color: #FFFFFF;
    font-size: 0.875rem; line-height: 1.5; text-align: left;
    padding: 13px 17px; border: none; border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 16px 40px -10px rgba(0,0,0,0.55), 0 4px 12px -4px rgba(0,0,0,0.35);
    cursor: pointer;
    animation: bo-pop 0.44s cubic-bezier(0.16,1,0.3,1);
    font-family: 'Satoshi', 'Inter', sans-serif;
  }
  .bo-bubble:hover { border-color: rgba(255,255,255,0.18); }
  .bo-bubble-tail {
    position: absolute; right: 28px; bottom: -7px;
    width: 14px; height: 14px; background: #09110E;
    transform: rotate(45deg);
    border-right: 1px solid rgba(255,255,255,0.10);
    border-bottom: 1px solid rgba(255,255,255,0.10);
  }
  @keyframes bo-pop {
    0%   { opacity: 0; transform: translateY(12px) scale(0.9); }
    100% { opacity: 1; transform: none; }
  }

  /* ─── CHAT PANEL ─────────────────────────────────────────────────── */
  .bo-panel {
    width: 340px; max-width: calc(100vw - 48px);
    height: 500px; max-height: calc(100vh - 140px);
    background: #09110E;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 22px; overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: 0 32px 72px -16px rgba(0,0,0,0.70), 0 8px 24px -8px rgba(0,0,0,0.45);
    transform-origin: bottom right;
    opacity: 0; transform: translateY(18px) scale(0.95);
    pointer-events: none;
    transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1);
  }
  .bo-panel-open { opacity: 1; transform: none; pointer-events: auto; }

  /* Panel header */
  .bo-panel-head {
    display: flex; align-items: center; gap: 11px;
    padding: 15px 16px;
    background: #09110E;
    border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
  }
  /* Mini orb in header */
  .bo-mini-orb {
    width: 36px; height: 36px; border-radius: 50%; flex: none;
    background: conic-gradient(from 0deg, #bff0d8, #cad8ff, #ecd4ff, #ffe0c4, #bff0d8);
    position: relative; overflow: hidden;
    box-shadow: 0 3px 10px -3px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.8);
  }
  .bo-mini-f1 {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 36% 30%, rgba(48,200,125,0.58) 0%, transparent 60%);
    filter: blur(4px);
  }
  .bo-mini-f2 {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 66% 68%, rgba(175,115,240,0.48) 0%, transparent 60%);
    filter: blur(4px);
  }
  .bo-mini-sheen {
    position: absolute; inset: 0; border-radius: 50%;
    background: radial-gradient(ellipse 40% 36% at 30% 24%, rgba(255,255,255,0.92) 0%, transparent 60%);
  }
  .bo-head-text { display: flex; flex-direction: column; line-height: 1.22; }
  .bo-head-text strong {
    font-size: 0.92rem; color: #FFFFFF; font-weight: 600; letter-spacing: -0.01em;
    font-family: 'Playfair Display', Georgia, serif; font-style: italic;
  }
  .bo-head-sub {
    font-size: 0.68rem; color: #A3B899; margin-top: 2px;
    font-family: 'Satoshi', 'Inter', sans-serif;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .bo-close {
    margin-left: auto; border: none; background: transparent;
    font-size: 1.3rem; line-height: 1; color: #A3B899; cursor: pointer;
    width: 32px; height: 32px; border-radius: 8px;
    display: grid; place-items: center;
    transition: background 0.2s cubic-bezier(0.16,1,0.3,1), color 0.2s;
  }
  .bo-close:hover { background: rgba(255,255,255,0.06); color: #FFFFFF; }

  /* Message thread */
  .bo-thread {
    flex: 1; overflow-y: auto;
    padding: 16px; display: flex; flex-direction: column; gap: 10px;
    background: #0D1914;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent;
  }
  .bo-thread::-webkit-scrollbar { width: 4px; }
  .bo-thread::-webkit-scrollbar-track { background: transparent; }
  .bo-thread::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  .bo-msg { display: flex; }
  .bo-msg span {
    max-width: 82%; padding: 10px 14px; border-radius: 16px;
    font-size: 0.875rem; line-height: 1.5;
    font-family: 'Satoshi', 'Inter', sans-serif;
  }
  /* Bot messages — surface card on dark background */
  .bo-msg-bot { justify-content: flex-start; }
  .bo-msg-bot span {
    background: #111D17; color: #FFFFFF; border-bottom-left-radius: 4px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  /* User messages — mint (site primary), dark text */
  .bo-msg-user { justify-content: flex-end; }
  .bo-msg-user span {
    background: #E6F0DC; color: #0D1914; border-bottom-right-radius: 4px;
    font-weight: 500;
  }

  /* Quick-action chip */
  .bo-chip {
    align-self: flex-start; margin-top: 4px;
    background: transparent; color: #A3B899;
    border: 1px solid rgba(255,255,255,0.14);
    padding: 8px 14px; border-radius: 999px;
    font-size: 0.8rem; font-family: 'Satoshi', 'Inter', sans-serif; font-weight: 500;
    cursor: pointer; letter-spacing: 0.01em;
    transition: border-color 0.3s cubic-bezier(0.16,1,0.3,1),
                color 0.3s cubic-bezier(0.16,1,0.3,1),
                background 0.3s cubic-bezier(0.16,1,0.3,1),
                transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .bo-chip:hover {
    border-color: rgba(230,240,220,0.5); color: #E6F0DC;
    background: rgba(230,240,220,0.06); transform: translateY(-1px);
  }

  /* Input row */
  .bo-input-row {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 14px; border-top: 1px solid rgba(255,255,255,0.06);
    background: #09110E; flex-shrink: 0;
  }
  .bo-input {
    flex: 1; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px;
    padding: 10px 16px; font-size: 0.875rem;
    font-family: 'Satoshi', 'Inter', sans-serif;
    color: #FFFFFF; background: transparent; outline: none;
    transition: border-color 0.25s cubic-bezier(0.16,1,0.3,1);
    -webkit-font-smoothing: antialiased;
  }
  .bo-input:focus { border-color: rgba(255,255,255,0.38); }
  .bo-input::placeholder { color: rgba(163,184,153,0.40); }

  /* Send — matches site's btn-primary pill */
  .bo-send {
    width: 40px; height: 40px; flex: none;
    border: 1px solid #E6F0DC; border-radius: 50%;
    background: #E6F0DC; color: #0D1914; font-size: 1.05rem; cursor: pointer;
    display: grid; place-items: center;
    transition: background 0.35s cubic-bezier(0.16,1,0.3,1),
                color 0.35s cubic-bezier(0.16,1,0.3,1),
                transform 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .bo-send:hover { background: transparent; color: #E6F0DC; transform: translateY(-1px); }
  .bo-send:active { transform: scale(0.94); }

  /* Branding footer */
  .bo-brand {
    display: block; text-align: center; padding: 8px 14px;
    font-size: 0.68rem; letter-spacing: 0.04em;
    color: rgba(163,184,153,0.35); text-decoration: none;
    background: #09110E; border-top: 1px solid rgba(255,255,255,0.06);
    transition: color 0.2s; flex-shrink: 0;
    font-family: 'Satoshi', 'Inter', sans-serif;
  }
  .bo-brand:hover { color: rgba(163,184,153,0.65); }
  .bo-brand strong { color: rgba(163,184,153,0.55); font-weight: 600; }

  @media (max-width: 420px) {
    .bo-root { right: 14px; bottom: max(14px, calc(env(safe-area-inset-bottom, 0px) + 10px)); }
    .bo-panel { width: calc(100vw - 28px); }
  }
`;

export default function BookingOrb({
  clinicName = "our clinic",
  welcomeMessage,
  accent = "#7FB7C4",
  size = 120,
  showBranding = true,
  connomiUrl = "https://connomi.com",
  className = "",
}: BookingOrbProps) {
  const greeting = welcomeMessage ?? `Hi! Welcome to ${clinicName} \u{1F44B}`;

  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { id: nextId(), role: "bot", text: greeting },
  ]);

  const threadRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Pop the welcome bubble shortly after load (only before panel is opened)
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Keep thread scrolled to latest message
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const openPanel = useCallback(() => {
    setOpen(true);
    setShowBubble(false);
  }, []);

  // ── Placeholder send — wire this to the real chat/booking API later ──────
  const sendMessage = useCallback((raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "bot",
          text: "Thanks! (Placeholder reply — booking logic gets wired here.)",
        },
      ]);
    }, 650);
  }, []);

  const quickBook = useCallback(() => {
    sendMessage("I’d like to book an appointment");
  }, [sendMessage]);

  return (
    <div
      className={`bo-root ${className}`}
      style={
        {
          "--bo-accent": accent,
          "--bo-size": `${size}px`,
        } as React.CSSProperties
      }
    >
      {/* Inject styles once — React 19 hoists & deduplicates by href */}
      <style href="booking-orb" precedence="default">
        {ORB_CSS}
      </style>

      {/* ── Chat panel ── */}
      <div
        className={`bo-panel ${open ? "bo-panel-open" : ""}`}
        role="dialog"
        aria-label={`Chat with ${clinicName}`}
        aria-hidden={!open}
      >
        <div className="bo-panel-head">
          <div className="bo-mini-orb" aria-hidden="true">
            <span className="bo-mini-f1" />
            <span className="bo-mini-f2" />
            <span className="bo-mini-sheen" />
          </div>
          <div className="bo-head-text">
            <strong>{clinicName}</strong>
            <span className="bo-head-sub">Typically replies instantly</span>
          </div>
          <button
            className="bo-close"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
        </div>

        <div className="bo-thread" ref={threadRef}>
          {messages.map((m) => (
            <div key={m.id} className={`bo-msg bo-msg-${m.role}`}>
              <span>{m.text}</span>
            </div>
          ))}
          <button className="bo-chip" onClick={quickBook}>
            &#128197; Book an appointment
          </button>
        </div>

        <div className="bo-input-row">
          <input
            className="bo-input"
            value={input}
            placeholder="Type a message…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(input);
            }}
            aria-label="Message"
          />
          <button
            className="bo-send"
            aria-label="Send"
            onClick={() => sendMessage(input)}
          >
            &#8593;
          </button>
        </div>

        {showBranding && (
          <a
            className="bo-brand"
            href={connomiUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by <strong>Connomi</strong>
          </a>
        )}
      </div>

      {/* ── Welcome bubble ── */}
      {showBubble && !open && (
        <button
          className="bo-bubble"
          onClick={openPanel}
          aria-label="Open chat"
        >
          {greeting}
          <span className="bo-bubble-tail" aria-hidden="true" />
        </button>
      )}

      {/* ── The orb ── */}
      <button
        className={`bo-orb${pressed ? " bo-orb-pressed" : ""}${reduceMotion.current ? " bo-reduced" : ""}`}
        aria-label={open ? "Close chat" : "Open chat to book an appointment"}
        onClick={() => (open ? setOpen(false) : openPanel())}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        {/* Slow-rotating wrapper gives the whole colour field a drift */}
        <span className="bo-field">
          <span className="bo-fluid bo-fluid-1" />
          <span className="bo-fluid bo-fluid-2" />
          <span className="bo-fluid bo-fluid-3" />
          <span className="bo-fluid bo-fluid-4" />
          <span className="bo-fluid bo-fluid-5" />
        </span>
        {/* Top-left gloss + glass rim */}
        <span className="bo-sheen" />
        <span className="bo-rim" />
      </button>
    </div>
  );
}
