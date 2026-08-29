"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { GalleryItem } from "@/lib/types";

export default function HeroCarousel({ items, eyebrow, heading, body, ctaLabel = "Request a Quote", ctaUrl = "/contact", catalogLabel = "Download Catalog", catalogUrl = "/contact" }: { items: GalleryItem[]; eyebrow?: string; heading?: string; body?: string; ctaLabel?: string; ctaUrl?: string; catalogLabel?: string; catalogUrl?: string }) {
  const slides = items.slice(0, 3), [index, setIndex] = useState(0);
  const words = (heading || "Illuminate the Future with Intelligent Light").trim().split(/\s+/);
  const accent = words.length > 2 ? words.splice(-2).join(" ") : words.join(" "), plain = words.join(" ");
  useEffect(() => { if (slides.length < 2) return; const timer = setInterval(() => setIndex(value => (value + 1) % slides.length), 5500); return () => clearInterval(timer); }, [slides.length]);
  return <section className={`home-hero ${slides.length ? "has-media" : ""}`}>
    {slides.map((item, itemIndex) => <div key={item.id} className={`hero-slide ${itemIndex === index ? "active" : ""}`}>{item.media_type === "video" ? <video src={item.media_url} autoPlay muted loop playsInline/> : <img src={item.media_url} alt={item.title}/>}</div>)}
    <div className="hero-shade"/><div className="container hero-copy"><div className="eyebrow">{eyebrow || "Smart Lighting Solutions Since 2011"}</div><h1 className="display-title">{plain}{plain ? " " : ""}<span>{accent}</span></h1><p className="lead">{body}</p><div className="hero-actions"><Link className="btn-primary" href={ctaUrl}>{ctaLabel}</Link><a className="btn-secondary" href={catalogUrl || "/contact"} target={catalogUrl?.startsWith("http") ? "_blank" : undefined}>{catalogLabel}</a></div>{slides.length > 1 && <div className="hero-dots">{slides.map((slide, itemIndex) => <button key={slide.id} className={itemIndex === index ? "active" : ""} onClick={() => setIndex(itemIndex)} aria-label={`Show banner ${itemIndex + 1}`}/>)}</div>}</div>
  </section>;
}
