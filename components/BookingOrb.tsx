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
  /** Orb diameter on mobile (≤768px). Falls back to size if not set. */
  mobileSize?: number;
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

// SF Pro system stack — matches iMessage on all Apple platforms, falls back to
// Helvetica Neue / Arial on Windows/Android
const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif`;
// Thread background colour — must match the ::after carve-out box-shadow colour
const THREAD = "#F2F2F7";

// ── All component styles (bo- prefix prevents collisions) ──────────────────
const ORB_CSS = `
  .bo-root {
    position: fixed; right: 24px; bottom: max(24px, calc(env(safe-area-inset-bottom, 0px) + 16px)); z-index: 9999;
    /* Explicit orb-sized box — no flex container bounding rectangle */
    width: var(--bo-size); height: var(--bo-size);
    background: transparent;
    font-family: ${SF};
  }

  /* ─── ORB ───────────────────────────────────────────────────────── */
  .bo-orb {
    position: relative;
    width: var(--bo-size); height: var(--bo-size);
    border-radius: 50%;
    border: none; padding: 0; cursor: pointer;
    background: conic-gradient(
      from 200deg,
      #eef9f3 0%, #e8eeff 26%, #f2e9ff 52%, #fff4ee 76%, #eef9f3 100%
    );
    overflow: hidden;
    isolation: isolate;
    clip-path: circle(50% at 50% 50%);
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

  .bo-field {
    position: absolute; inset: -22%; border-radius: 50%;
    animation: bo-rotate 32s linear infinite;
  }
  .bo-fluid {
    position: absolute; border-radius: 50%;
    mix-blend-mode: soft-light; will-change: transform;
  }
  .bo-fluid-1 {
    width: 82%; height: 82%; left: 0%; top: -2%;
    background: radial-gradient(circle, rgba(48,210,135,0.90) 0%, rgba(68,200,148,0.40) 42%, transparent 70%);
    filter: blur(17px); opacity: 1;
    animation: bo-drift1 9s cubic-bezier(0.42,0.06,0.58,0.94) infinite;
  }
  .bo-fluid-2 {
    width: 80%; height: 80%; right: -4%; top: 2%;
    background: radial-gradient(circle, rgba(90,150,255,0.86) 0%, rgba(110,162,255,0.38) 42%, transparent 70%);
    filter: blur(19px); opacity: 1;
    animation: bo-drift2 12s cubic-bezier(0.42,0.06,0.58,0.94) infinite;
  }
  .bo-fluid-3 {
    width: 78%; height: 78%; left: -2%; bottom: -4%;
    background: radial-gradient(circle, rgba(185,125,248,0.80) 0%, rgba(195,135,255,0.35) 42%, transparent 70%);
    filter: blur(19px); opacity: 1;
    animation: bo-drift3 14.5s cubic-bezier(0.42,0.06,0.58,0.94) infinite;
  }
  .bo-fluid-4 {
    width: 84%; height: 84%; right: -6%; bottom: -6%;
    background: radial-gradient(circle, rgba(255,162,82,0.78) 0%, rgba(255,175,95,0.32) 42%, transparent 70%);
    filter: blur(17px); opacity: 1;
    animation: bo-drift4 10.5s cubic-bezier(0.42,0.06,0.58,0.94) infinite;
  }
  .bo-fluid-5 {
    width: 55%; height: 55%; left: 22%; top: 22%;
    background: radial-gradient(circle, rgba(255,205,225,0.55) 0%, transparent 65%);
    filter: blur(13px); opacity: 0.85;
    animation: bo-drift5 18s ease-in-out infinite;
  }
  .bo-orb-pressed .bo-fluid-1 { animation-duration: 2.6s; }
  .bo-orb-pressed .bo-fluid-2 { animation-duration: 3.2s; }
  .bo-orb-pressed .bo-fluid-3 { animation-duration: 3.8s; }
  .bo-orb-pressed .bo-fluid-4 { animation-duration: 2.9s; }
  .bo-orb-pressed .bo-fluid-5 { animation-duration: 3.5s; }
  .bo-orb-pressed .bo-field   { animation-duration: 5s; }

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
  .bo-rim {
    position: absolute; inset: 0; border-radius: 50%;
    box-shadow:
      inset 0 0 0 1.5px rgba(255,255,255,0.52),
      inset -10px -12px 30px rgba(120,132,165,0.14),
      inset 4px 4px 10px rgba(255,255,255,0.20);
    pointer-events: none;
  }
  .bo-reduced .bo-fluid,
  .bo-reduced .bo-field { animation: none !important; }

  /* ─── WELCOME BUBBLE ─────────────────────────────────────────────── */
  .bo-bubble {
    position: absolute; right: 0; bottom: calc(var(--bo-size) + 10px);
    max-width: 240px;
    background: #FFFFFF; color: #1C1C1E;
    font-size: 14px; line-height: 1.4; text-align: left;
    padding: 12px 16px; border-radius: 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.06);
    border: 0.5px solid rgba(0,0,0,0.08);
    cursor: pointer;
    animation: bo-pop 0.44s cubic-bezier(0.16,1,0.3,1);
    font-family: ${SF};
    -webkit-tap-highlight-color: transparent;
  }
  .bo-bubble-tail {
    position: absolute; right: 26px; bottom: -7px;
    width: 13px; height: 13px; background: #FFFFFF;
    transform: rotate(45deg);
    border-right: 0.5px solid rgba(0,0,0,0.08);
    border-bottom: 0.5px solid rgba(0,0,0,0.08);
  }
  @keyframes bo-pop {
    0%   { opacity: 0; transform: translateY(12px) scale(0.9); }
    100% { opacity: 1; transform: none; }
  }

  /* ─── CHAT PANEL ─────────────────────────────────────────────────── */
  .bo-panel {
    position: absolute; right: 0; bottom: calc(var(--bo-size) + 14px);
    width: 340px; max-width: calc(100vw - 48px);
    height: 520px; max-height: calc(100vh - 140px);
    background: #FFFFFF;
    border-radius: 18px; overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06);
    border: 0.5px solid rgba(0,0,0,0.10);
    transform-origin: bottom right;
    opacity: 0; transform: translateY(18px) scale(0.95);
    pointer-events: none; visibility: hidden;
    transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1), visibility 0s linear 0.28s;
  }
  .bo-panel-open {
    opacity: 1; transform: none; pointer-events: auto; visibility: visible;
    transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1), visibility 0s linear 0s;
  }

  /* ── Header — centered iMessage layout ── */
  .bo-panel-head {
    position: relative;
    display: flex; flex-direction: column; align-items: center;
    padding: 16px 16px 13px;
    background: #F9F9F9;
    border-bottom: 0.5px solid rgba(0,0,0,0.10); flex-shrink: 0;
  }
  /* Avatar */
  .bo-mini-orb {
    width: 48px; height: 48px; border-radius: 50%; flex: none;
    background: conic-gradient(from 0deg, #bef0d0, #c8f0d8, #d8f5e4, #e0f5e8, #bef0d0);
    position: relative; overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,0.14);
    margin-bottom: 7px;
  }
  .bo-mini-f1 {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 36% 30%, rgba(30,160,90,0.62) 0%, transparent 60%);
    filter: blur(4px);
  }
  .bo-mini-f2 {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 66% 68%, rgba(60,180,110,0.48) 0%, transparent 60%);
    filter: blur(4px);
  }
  .bo-mini-sheen {
    position: absolute; inset: 0; border-radius: 50%;
    background: radial-gradient(ellipse 40% 36% at 30% 24%, rgba(255,255,255,0.92) 0%, transparent 60%);
  }
  .bo-head-name {
    font-size: 13px; font-weight: 600; color: #1C1C1E; letter-spacing: -0.2px;
    font-family: ${SF};
  }
  .bo-head-sub {
    font-size: 11px; color: #8E8E93; margin-top: 2px;
    font-family: ${SF};
  }
  /* Ghost × button — top-right, circular */
  .bo-close {
    position: absolute; top: 11px; right: 11px;
    border: none; background: rgba(0,0,0,0.06);
    width: 28px; height: 28px; border-radius: 50%;
    display: grid; place-items: center; cursor: pointer;
    color: #6C6C70;
    transition: background 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .bo-close:hover  { background: rgba(0,0,0,0.10); }
  .bo-close:active { background: rgba(0,0,0,0.16); }

  /* ── Thread ── */
  .bo-thread {
    flex: 1; overflow-y: auto;
    padding: 10px 12px 8px;
    display: flex; flex-direction: column;
    background: ${THREAD};
    scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.08) transparent;
  }
  .bo-thread::-webkit-scrollbar { width: 4px; }
  .bo-thread::-webkit-scrollbar-track { background: transparent; }
  .bo-thread::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.10); border-radius: 4px; }

  /* ── Message rows ── */
  .bo-msg { display: flex; align-items: flex-end; }
  /* 2px gap within a sender group, 10px between groups */
  .bo-msg + .bo-msg { margin-top: 2px; }
  .bo-group-start  { margin-top: 10px; }

  /* Shared bubble */
  .bo-msg span {
    position: relative;
    max-width: 72%;
    padding: 9px 13px;
    border-radius: 18px;
    font-size: 16px; line-height: 1.3;
    font-family: ${SF};
    word-break: break-word;
  }

  /* ── Received (bot) — gray, left ── */
  .bo-msg-bot { justify-content: flex-start; }
  .bo-msg-bot span { background: #E9E9EB; color: #1C1C1E; }

  /* Tail: last bot in group
     ::before = filled gray triangle extending left-downward
     ::after  = concave carve using box-shadow in thread bg colour */
  .bo-last-bot span { border-bottom-left-radius: 2px; }
  .bo-last-bot span::before {
    content: ''; position: absolute;
    bottom: 0; left: -9px;
    width: 16px; height: 18px;
    background: #E9E9EB;
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
  }
  .bo-last-bot span::after {
    content: ''; position: absolute;
    bottom: 0; left: -14px;
    width: 12px; height: 12px;
    border-radius: 0 0 12px 0;
    box-shadow: 4px 4px 0 4px ${THREAD};
  }

  /* ── Sent (user) — Apple blue, right ── */
  .bo-msg-user { justify-content: flex-end; }
  .bo-msg-user span {
    background: #007AFF; color: #FFFFFF;
    animation: bo-bubble-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  /* Tail: last user in group — mirror of bot tail */
  .bo-last-user span { border-bottom-right-radius: 2px; }
  .bo-last-user span::before {
    content: ''; position: absolute;
    bottom: 0; right: -9px;
    width: 16px; height: 18px;
    background: #007AFF;
    clip-path: polygon(0 0, 0 100%, 100% 100%);
  }
  .bo-last-user span::after {
    content: ''; position: absolute;
    bottom: 0; right: -14px;
    width: 12px; height: 12px;
    border-radius: 0 0 0 12px;
    box-shadow: -4px 4px 0 4px ${THREAD};
  }

  /* Sent bubbles spring in when added to the DOM */
  @keyframes bo-bubble-in {
    from { opacity: 0; transform: scale(0.82); transform-origin: bottom right; }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── Quick action chip ── */
  .bo-chip {
    align-self: flex-start; margin-top: 8px;
    background: rgba(0,122,255,0.08);
    color: #007AFF;
    border: 1px solid rgba(0,122,255,0.22);
    padding: 7px 14px; border-radius: 18px;
    font-size: 14px; font-weight: 500;
    font-family: ${SF};
    cursor: pointer; letter-spacing: -0.1px;
    transition: background 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .bo-chip:active { background: rgba(0,122,255,0.18); }

  /* ── Input bar — frosted glass bottom ── */
  .bo-input-row {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 12px;
    padding-bottom: max(10px, calc(env(safe-area-inset-bottom, 0px) + 6px));
    background: rgba(249,249,249,0.90);
    backdrop-filter: blur(20px) saturate(1.8);
    -webkit-backdrop-filter: blur(20px) saturate(1.8);
    border-top: 0.5px solid rgba(0,0,0,0.12); flex-shrink: 0;
  }
  .bo-input {
    flex: 1;
    border: 1px solid #C5C5C7; border-radius: 999px;
    padding: 8px 14px; font-size: 16px;
    font-family: ${SF};
    color: #1C1C1E; background: #FFFFFF; outline: none;
    transition: border-color 0.18s ease;
    -webkit-font-smoothing: antialiased;
  }
  .bo-input:focus { border-color: #007AFF; }
  .bo-input::placeholder { color: #8E8E93; }

  /* Circular blue send button with upward-arrow icon */
  .bo-send {
    width: 30px; height: 30px; flex: none;
    border: none; border-radius: 50%;
    background: #007AFF; cursor: pointer;
    display: grid; place-items: center;
    transition: background 0.15s ease, transform 0.15s ease;
    -webkit-tap-highlight-color: transparent;
  }
  .bo-send:hover  { background: #0066E0; }
  .bo-send:active { transform: scale(0.88); }

  /* ── Branding ── */
  .bo-brand {
    display: block; text-align: center; padding: 5px 14px 7px;
    font-size: 11px; letter-spacing: 0.01em;
    color: #8E8E93; text-decoration: none;
    background: rgba(249,249,249,0.90);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 0.5px solid rgba(0,0,0,0.08);
    transition: color 0.18s ease; flex-shrink: 0;
    font-family: ${SF};
  }
  .bo-brand:hover { color: #3C3C43; }
  .bo-brand strong { color: #6C6C70; font-weight: 600; }

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
  mobileSize,
  showBranding = true,
  connomiUrl = "https://connomi.com",
  className = "",
}: BookingOrbProps) {
  const greeting = welcomeMessage ?? `Hi! Welcome to ${clinicName} \u{1F44B}`;

  const [activeSize, setActiveSize] = useState(size);
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

  useEffect(() => {
    if (!mobileSize) return;
    const mq = window.matchMedia("(max-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setActiveSize(e.matches ? mobileSize : size);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [size, mobileSize]);

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
    sendMessage("I'd like to book an appointment");
  }, [sendMessage]);

  // Determine group boundaries for tail + spacing classes
  const isLastInGroup  = (i: number) => !messages[i + 1] || messages[i + 1].role !== messages[i].role;
  const isFirstInGroup = (i: number) => !messages[i - 1] || messages[i - 1].role !== messages[i].role;

  return (
    <div
      className={`bo-root ${className}`}
      style={{ "--bo-accent": accent, "--bo-size": `${activeSize}px` } as React.CSSProperties}
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
        {/* Header — centered iMessage layout */}
        <div className="bo-panel-head">
          <div className="bo-mini-orb" aria-hidden="true">
            <span className="bo-mini-f1" />
            <span className="bo-mini-f2" />
            <span className="bo-mini-sheen" />
          </div>
          <span className="bo-head-name">{clinicName}</span>
          <span className="bo-head-sub">Typically replies instantly</span>
          {/* Ghost × button — absolute top-right */}
          <button
            className="bo-close"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Thread */}
        <div className="bo-thread" ref={threadRef}>
          {messages.map((m, i) => (
            <div
              key={m.id}
              className={[
                "bo-msg",
                `bo-msg-${m.role}`,
                isLastInGroup(i)  ? `bo-last-${m.role}`  : "",
                isFirstInGroup(i) ? "bo-group-start"      : "",
              ].filter(Boolean).join(" ")}
            >
              <span>{m.text}</span>
            </div>
          ))}

          {/* Quick action — blue outlined pill */}
          <button className="bo-chip" onClick={quickBook}>
            &#128197; Book an appointment
          </button>
        </div>

        {/* Input bar — frosted */}
        <div className="bo-input-row">
          <input
            className="bo-input"
            value={input}
            placeholder="Message"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }}
            aria-label="Message"
          />
          <button
            className="bo-send"
            aria-label="Send"
            onClick={() => sendMessage(input)}
          >
            {/* SF Symbol arrow.up — upward stroke arrow */}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M6.5 11V2M2.5 5.5L6.5 2L10.5 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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

      {/* ── The orb (unchanged) ── */}
      <button
        className={`bo-orb${pressed ? " bo-orb-pressed" : ""}${reduceMotion.current ? " bo-reduced" : ""}`}
        aria-label={open ? "Close chat" : "Open chat to book an appointment"}
        onClick={() => (open ? setOpen(false) : openPanel())}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        <span className="bo-field">
          <span className="bo-fluid bo-fluid-1" />
          <span className="bo-fluid bo-fluid-2" />
          <span className="bo-fluid bo-fluid-3" />
          <span className="bo-fluid bo-fluid-4" />
          <span className="bo-fluid bo-fluid-5" />
        </span>
        <span className="bo-sheen" />
        <span className="bo-rim" />
      </button>
    </div>
  );
}
