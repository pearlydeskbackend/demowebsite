"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../messages/en.json";
import frMessages from "../messages/fr.json";
import zhMessages from "../messages/zh.json";

export type Locale = "EN" | "FR" | "中文";

const allMessages: Record<Locale, object> = {
  EN: enMessages,
  FR: frMessages,
  "中文": zhMessages,
};

const localeCode: Record<Locale, string> = {
  EN: "en",
  FR: "fr",
  "中文": "zh",
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: "EN", setLocale: () => {} });

export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("EN");

  useEffect(() => {
    const saved = localStorage.getItem("kd-locale") as Locale | null;
    if (saved === "EN" || saved === "FR" || saved === "中文") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("kd-locale", l);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={localeCode[locale]} messages={allMessages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
