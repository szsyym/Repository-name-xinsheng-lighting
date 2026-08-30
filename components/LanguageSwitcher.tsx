"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global { interface Window { google?: any; googleTranslateElementInit?: () => void; } }

const languages = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "zh-CN", flag: "🇨🇳", label: "中文" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "hi", flag: "🇮🇳", label: "हिन्दी" },
];

function languageFromCookie() {
  if (typeof document === "undefined") return "en";
  const value = document.cookie.split("; ").find((item) => item.startsWith("googtrans="))?.split("=")[1];
  return value?.split("/").pop() || "en";
}

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("en");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLanguage(languageFromCookie());
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate || document.querySelector("#google_translate_element select")) return;
      new window.google.translate.TranslateElement({pageLanguage:"en",includedLanguages:"en,zh-CN,ja,de,fr,hi",autoDisplay:false}, "google_translate_element");
    };
    const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function changeLanguage(code: string) {
    setLanguage(code);
    setOpen(false);
    const translation = code === "en" ? "/en/en" : `/en/${code}`;
    document.cookie = `googtrans=${translation};path=/;max-age=31536000;SameSite=Lax`;
    document.cookie = `googtrans=${translation};path=/;domain=${location.hostname};max-age=31536000;SameSite=Lax`;
    window.location.reload();
  }

  const selected = languages.find((item) => item.code === language) || languages[0];
  return <div className="language-switcher notranslate" ref={rootRef}>
    <button className="language-flag-button" type="button" aria-label={`Language: ${selected.label}`} aria-expanded={open} onClick={() => setOpen(!open)}>{selected.flag}<span aria-hidden="true">⌄</span></button>
    {open && <div className="language-flag-menu">{languages.map((item) => <button key={item.code} type="button" title={item.label} aria-label={item.label} className={item.code === language ? "active" : ""} onClick={() => changeLanguage(item.code)}>{item.flag}</button>)}</div>}
    <div id="google_translate_element" aria-hidden="true" />
    <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" onLoad={() => window.googleTranslateElementInit?.()}/>
  </div>;
}
