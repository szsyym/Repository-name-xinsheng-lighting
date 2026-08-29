export default function RichContent({ html, className = "rich-content" }: { html?: string; className?: string }) {
  const value = String(html || "");
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(value);
  if (looksLikeHtml) return <div className={className} dangerouslySetInnerHTML={{ __html: value }}/>
  return <div className={className}>{value.split("\n").filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}</div>;
}
