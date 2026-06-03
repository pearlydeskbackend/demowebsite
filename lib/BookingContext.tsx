"use client";
import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";

type Ctx = { isOpen: boolean; open: () => void; close: () => void };

const BookingCtx = createContext<Ctx>({ isOpen: false, open: () => {}, close: () => {} });

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
    // Return focus after the slide-out transition finishes
    setTimeout(() => triggerRef.current?.focus(), 320);
  }, []);

  return <BookingCtx.Provider value={{ isOpen, open, close }}>{children}</BookingCtx.Provider>;
}

export const useBooking = () => useContext(BookingCtx);
