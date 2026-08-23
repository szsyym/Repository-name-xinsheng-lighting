export type MediaItem = { type: "image" | "video"; url: string; alt?: string };
export type QA = { question: string; answer: string };
export type Spec = { label: string; value: string };
export type Product = {
  id: string; slug: string; name: string; category: string; subcategory?: string;
  short_description: string; description: string; features: string[]; specifications: Spec[];
  packing_size: Spec[]; parts_list: string[]; faqs: QA[]; media: MediaItem[];
  youtube_url?: string; moq?: string; featured: boolean; status: "draft" | "published";
  sort_order: number; created_at?: string;
};
export type NewsPost = { id: string; slug: string; title: string; excerpt: string; content: string; category: string; cover_url?: string; published_at: string; status: "draft" | "published" };
export type SitePage = { slug: string; title: string; eyebrow?: string; heading: string; body: string; content: Record<string, unknown>; media: MediaItem[]; published: boolean };
export type GalleryItem = { id: string; collection: "hero" | "customer" | "logo" | "scene" | "factory"; title: string; caption?: string; media_type: "image" | "video"; media_url: string; link_url?: string; sort_order: number; published: boolean };
