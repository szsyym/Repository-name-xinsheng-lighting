import Link from "next/link";
import { Cog, Factory, Globe2, ShieldCheck } from "lucide-react";
import { getGallery, getNews, getPage } from "@/lib/queries";
import SectionHead from "@/components/SectionHead";
import GalleryCarousel from "@/components/GalleryCarousel";
import HeroCarousel from "@/components/HeroCarousel";

export const revalidate = 60;

const featureDefaults = [
  [Cog, "Product Development", "Design support, samples and production engineering around your brief."],
  [Factory, "Factory Direct", "An integrated team for manufacturing, inspection and dependable delivery."],
  [Globe2, "Global Service", "Export documentation, logistics and Amazon FBA preparation for key markets."],
  [ShieldCheck, "Quality Assurance", "Defined incoming, in-process and finished-product quality checkpoints."],
] as const;

export default async function Home() {
  const [page, news, customers, logos, hero, catalog] = await Promise.all([
    getPage("home"), getNews(3), getGallery("customer"), getGallery("logo"), getGallery("hero"), getGallery("catalog")
  ]);
  const content = page?.content || {};
  const features = featureDefaults.map(([Icon, title, body], index) => ({
    Icon,
    title: String(content[`why_card_title_${index + 1}`] || title),
    body: String(content[`why_card_body_${index + 1}`] || body),
  }));

  return <>
    <div className="trust-bar"><div className="container trust-items"><span>14+ Years Experience</span><span>ISO 9001 Certified</span><span>Global B2B Service</span><span>24h Response Time</span><span>OEM / ODM Available</span></div></div>
    <HeroCarousel items={hero} eyebrow={page?.eyebrow} heading={page?.heading} body={page?.body} ctaLabel={String(content.cta_label || "Request a Quote")} ctaUrl={String(content.cta_url || "/contact")} catalogLabel={String(content.catalog_label || "Download Catalog")} catalogUrl={catalog[0]?.media_url || String(content.catalog_url || "/contact")}/>

    <section className="home-stats"><div className="container stats">{[
      ["stat_value_1", "14+", "stat_label_1", "Years Experience"],
      ["stat_value_2", "3,000", "stat_label_2", "Units / Day"],
      ["stat_value_3", "3,000m²", "stat_label_3", "Factory Area"],
      ["stat_value_4", "20+", "stat_label_4", "Markets Served"],
    ].map(([valueKey, valueDefault, labelKey, labelDefault]) => <div className="stat" key={valueKey}><strong>{String(content[valueKey] || valueDefault)}</strong><span>{String(content[labelKey] || labelDefault)}</span></div>)}</div></section>

    <div className="section-divider"/>
    <section className="section customer-section"><div className="container">
      <SectionHead kicker="Partnerships" title="Customer" accent="Visits" description="Photos with customers and partners from projects, exhibitions and factory visits."/>
      <GalleryCarousel items={customers}/>
      <div className="logo-space"/>
      <SectionHead
        kicker={String(content.partner_kicker || "Trusted by")}
        title={String(content.partner_title || "Partner")}
        accent={String(content.partner_accent || "Brands")}
        description={String(content.partner_description || "Selected customer and partner logos.")}
      />
      <GalleryCarousel items={logos} logos/>
    </div></section>

    <div className="section-divider"/>
    <section className="section"><div className="container">
      <SectionHead
        title={String(content.why_title || "Why Partner")}
        accent={String(content.why_accent || "With Us")}
        description={String(content.why_description || "From prototype to mass production, we deliver reliable support at every stage")}
      />
      <div className="feature-grid">{features.map(({ Icon, title, body }) => <article className="card feature-card" key={title}>
        <div className="feature-icon"><Icon/></div><h3>{title}</h3><p>{body}</p>
      </article>)}</div>
    </div></section>

    <div className="section-divider"/>
    <section className="section"><div className="container">
      <Link href="/news" className="section-head-link" aria-label="View all news"><SectionHead title="Latest" accent="News" description="Company updates, product knowledge and industry insights"/></Link>
      <div className="news-grid">{news.map(n => <Link href={`/news/${n.slug}`} className="card" key={n.id}><div className="news-cover">{n.cover_url ? <img src={n.cover_url} alt={n.title}/> : <span className="accent news-star">✦</span>}<span className="news-date">{new Date(n.published_at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span></div><div className="news-info"><small>{n.category}</small><h3>{n.title}</h3><p>{n.excerpt}</p></div></Link>)}</div>
    </div></section>

    <section className="section contact-band"><div className="container section-head"><div className="kicker">Have a new project?</div><h2>Let’s build your next <span className="accent">lighting product.</span></h2><p>Send your target market, requirements and expected quantity. Our team will respond within 24 hours.</p><div className="hero-actions"><Link href="/contact" className="btn-primary">Start Your Project</Link></div></div></section>
  </>;
}
