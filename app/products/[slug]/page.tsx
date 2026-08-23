import Link from "next/link";
import { notFound } from "next/navigation";
import MediaGallery from "@/components/MediaGallery";
import { getProduct } from "@/lib/queries";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  return product
    ? { title: product.name, description: product.short_description }
    : { title: "Product" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <>
      <section className="section product-top-section">
        <div className="container product-detail">
          <MediaGallery items={product.media || []} name={product.name} />
          <div className="product-summary">
            <div className="kicker">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ""}</div>
            <h1>{product.name}</h1>
            <p className="product-description">{product.short_description}</p>

            <div className="feature-panel">
              <h2>Features</h2>
              {product.features?.length ? (
                <ul className="feature-list">
                  {product.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              ) : <p>Contact us for product features and customization options.</p>}
            </div>

            <div className="hero-actions product-actions">
              <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="btn-primary">Inquiry</Link>
              {product.youtube_url && <a className="btn-secondary" href={product.youtube_url} target="_blank" rel="noreferrer">Video</a>}
            </div>
            {product.moq && <p className="product-moq"><strong>MOQ:</strong> {product.moq}</p>}
          </div>
        </div>
      </section>

      <section className="section product-spec-section section-divider">
        <div className="container">
          <div className="product-section-heading">
            <div>
              <div className="kicker">Technical Data</div>
              <h2>Specifications</h2>
            </div>
            {product.description && <p>{product.description}</p>}
          </div>
          {product.specifications?.length ? (
            <div className="spec-table">
              {product.specifications.map((spec, index) => (
                <div className="spec-table-row" key={`${spec.label}-${index}`}>
                  <strong>{spec.label}</strong><span>{spec.value}</span>
                </div>
              ))}
            </div>
          ) : <div className="empty-detail">Specifications are available on request.</div>}
        </div>
      </section>

      <section className="section product-lower-section">
        <div className="container product-info-columns">
          <article className="product-info-table">
            <h3>Packing Info.</h3>
            {product.packing_size?.length ? product.packing_size.map((item, index) => (
              <div className="product-info-row" key={`${item.label}-${index}`}><strong>{item.label}</strong><span>{item.value}</span></div>
            )) : <p className="detail-placeholder">Packing details are available on request.</p>}
          </article>

          <article className="product-info-table">
            <h3>Package Included</h3>
            {product.parts_list?.length ? <ul className="package-list">{product.parts_list.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="detail-placeholder">Package contents are available on request.</p>}
          </article>

          <article className="product-info-table">
            <h3>Q&amp;A</h3>
            {product.faqs?.length ? <div className="product-qa-list">{product.faqs.map((item, index) => <div className="qa-row" key={`${item.question}-${index}`}><strong>{item.question}</strong><p>{item.answer}</p></div>)}</div> : <p className="detail-placeholder">Send us your questions through the inquiry form.</p>}
          </article>
        </div>
      </section>

      <section className="section contact-band">
        <div className="container section-head">
          <div className="kicker">OEM / ODM Support</div>
          <h2>Need a customized <span className="accent">lighting solution?</span></h2>
          <p>Tell us your specifications, target market and expected quantity.</p>
          <div className="hero-actions"><Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="btn-primary">Request a Quote</Link></div>
        </div>
      </section>
    </>
  );
}
