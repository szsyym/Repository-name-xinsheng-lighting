"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const languages = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "中文" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

function languageFromCookie() {
  if (typeof document === "undefined") return "en";
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith("googtrans="))
    ?.split("=")[1];
  return value?.split("/").pop() || "en";
}

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setLanguage(languageFromCookie());
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate || document.querySelector("#google_translate_element select")) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,zh-CN,de,fr,es",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };
  }, []);

  function changeLanguage(code: string) {
    setLanguage(code);
    const translation = code === "en" ? "/en/en" : `/en/${code}`;
    document.cookie = `googtrans=${translation};path=/;max-age=31536000;SameSite=Lax`;
    document.cookie = `googtrans=${translation};path=/;domain=${location.hostname};max-age=31536000;SameSite=Lax`;
    window.location.reload();
  }

  return (
    <div className="language-switcher notranslate">
      <span className="language-globe" aria-hidden="true">🌐</span>
      <select
        aria-label="Select language"
        value={language}
        onChange={(event) => changeLanguage(event.target.value)}
      >
        {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
      </select>
      <div id="google_translate_element" aria-hidden="true" />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
        onLoad={() => window.googleTranslateElementInit?.()}
      />
    </div>
  );
}
