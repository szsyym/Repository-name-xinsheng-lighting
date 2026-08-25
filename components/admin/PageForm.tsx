import type { SitePage } from "@/lib/types";

const whyDefaults = [
  ["Product Development", "Design support, samples and production engineering around your brief."],
  ["Factory Direct", "An integrated team for manufacturing, inspection and dependable delivery."],
  ["Global Service", "Export documentation, logistics and Amazon FBA preparation for key markets."],
  ["Quality Assurance", "Defined incoming, in-process and finished-product quality checkpoints."],
];

export default function PageForm({ page, action }: { page: SitePage; action: (form: FormData) => void }) {
  const sections = Array.isArray(page.content?.sections) ? page.content.sections as any[] : [];
  const content = page.content || {};

  return <form className="admin-form" action={action}>
    <h2>{page.title}</h2>
    <label>Admin Label / Page Title<input name="title" defaultValue={page.title}/></label>
    <label>Eyebrow Text<input name="eyebrow" defaultValue={page.eyebrow}/></label>
    <label>Main Heading<input name="heading" defaultValue={page.heading}/></label>
    <label>Main Description<textarea name="body" defaultValue={page.body}/></label>

    {page.slug === "home" && <>
      <h3>Homepage Buttons</h3>
      <div className="admin-form-grid">
        <label>Inquiry Button Label<input name="cta_label" defaultValue={String(content.cta_label || "Request a Quote")}/></label>
        <label>Inquiry Button Link<input name="cta_url" defaultValue={String(content.cta_url || "/contact")}/></label>
        <label>Catalog Button Label<input name="catalog_label" defaultValue={String(content.catalog_label || "Download Catalog")}/></label>
        <label>Catalog PDF URL<input name="catalog_url" defaultValue={String(content.catalog_url || "")}/></label>
      </div>

      <h3>Partner Brands Section</h3>
      <div className="admin-form-grid">
        <label>Small Heading<input name="partner_kicker" defaultValue={String(content.partner_kicker || "Trusted by")}/></label>
        <label>Black Title<input name="partner_title" defaultValue={String(content.partner_title || "Partner")}/></label>
        <label>Orange Title<input name="partner_accent" defaultValue={String(content.partner_accent || "Brands")}/></label>
        <label>Description<input name="partner_description" defaultValue={String(content.partner_description || "Selected customer and partner logos.")}/></label>
      </div>

      <h3>Why Partner With Us Section</h3>
      <div className="admin-form-grid">
        <label>Black Title<input name="why_title" defaultValue={String(content.why_title || "Why Partner")}/></label>
        <label>Orange Title<input name="why_accent" defaultValue={String(content.why_accent || "With Us")}/></label>
      </div>
      <label>Section Description<input name="why_description" defaultValue={String(content.why_description || "From prototype to mass production, we deliver reliable support at every stage")}/></label>
      {whyDefaults.map(([title, body], i) => <div className="admin-form-grid" key={title}>
        <label>Card {i + 1} Title<input name={`why_card_title_${i + 1}`} defaultValue={String(content[`why_card_title_${i + 1}`] || title)}/></label>
        <label>Card {i + 1} Description<textarea name={`why_card_body_${i + 1}`} defaultValue={String(content[`why_card_body_${i + 1}`] || body)}/></label>
      </div>)}
    </>}

    {page.slug === "factory" && <>
      <h3>Factory Sections</h3>
      {[1, 2, 3, 4, 5].map((n, i) => <div className="admin-form-grid" key={n}>
        <label>Section {n} Title<input name={`section_title_${n}`} defaultValue={sections[i]?.title}/></label>
        <label>Section {n} Description<textarea name={`section_body_${n}`} defaultValue={sections[i]?.body}/></label>
      </div>)}
    </>}

    <label>External Video URL<input name="video_url" defaultValue={String(content.video_url || "")} placeholder="YouTube or hosted video URL"/></label>
    {page.media?.length ? <div className="admin-media-grid">{page.media.map((m, i) => <label className="admin-media check" key={m.url}>
      {m.type === "video" ? <video src={m.url} controls/> : <img src={m.url} alt=""/>}
      <span><input type="checkbox" name={`keep_page_media_${i}`} defaultChecked/> Keep (uncheck to delete)</span>
    </label>)}</div> : null}
    <label>Upload Page Images / Videos<input type="file" name="media" accept="image/*,video/*" multiple/></label>
    <label className="check"><input type="checkbox" name="published" defaultChecked={page.published}/> Published</label>
    <button className="btn-primary">Save {page.title}</button>
  </form>;
}
