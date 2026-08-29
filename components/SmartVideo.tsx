function embedUrl(url: string) {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/i);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return "";
}

export default function SmartVideo({ src, title, className }: { src: string; title: string; className?: string }) {
  const embed = embedUrl(src);
  if (embed) return <iframe className={className} src={embed} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>;
  return <video className={className} src={src} controls playsInline preload="metadata" aria-label={title}/>;
}
