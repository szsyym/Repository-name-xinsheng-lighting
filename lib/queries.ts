import { createClient } from "./supabase/server";
import { fallbackGallery, fallbackNews, fallbackPages, fallbackProducts } from "./fallback";
import type { GalleryItem, NewsPost, Product, SitePage } from "./types";

export async function getProducts(options?: { featured?: boolean; category?: string; includeDrafts?: boolean }) {
  const supabase = createClient(); if (!supabase) return fallbackProducts;
  let query = supabase.from("products").select("*").order("sort_order").order("created_at", { ascending:false });
  if (!options?.includeDrafts) query = query.eq("status", "published");
  if (options?.featured) query = query.eq("featured", true);
  if (options?.category) query = query.eq("category", options.category);
  const { data, error } = await query; return error || !data?.length ? fallbackProducts : data as Product[];
}
export async function getProduct(slug: string, includeDrafts=false) {
  const supabase = createClient();
  if (!supabase) return fallbackProducts.find(p=>p.slug===slug) || null;
  let query = supabase.from("products").select("*").eq("slug", slug);
  if (!includeDrafts) query = query.eq("status", "published");
  const { data } = await query.maybeSingle(); return (data as Product | null) || fallbackProducts.find(p=>p.slug===slug) || null;
}
export async function getProductById(id: string) {
  const supabase=createClient(); if(!supabase) return fallbackProducts.find(p=>p.id===id)||null;
  const {data}=await supabase.from("products").select("*").eq("id",id).maybeSingle(); return data as Product|null;
}
export async function getPage(slug: string) {
  const supabase=createClient(); if(!supabase) return fallbackPages[slug]||null;
  const {data}=await supabase.from("pages").select("*").eq("slug",slug).eq("published",true).maybeSingle(); return (data as SitePage|null)||fallbackPages[slug]||null;
}
export async function getPagesForAdmin(){ const supabase=createClient(); if(!supabase)return Object.values(fallbackPages); const {data}=await supabase.from("pages").select("*").order("slug"); return (data as SitePage[])||Object.values(fallbackPages); }
export async function getNews(limit?:number, includeDrafts=false){ const supabase=createClient(); if(!supabase)return limit?fallbackNews.slice(0,limit):fallbackNews; let q=supabase.from("news").select("*").order("published_at",{ascending:false}); if(!includeDrafts)q=q.eq("status","published"); if(limit)q=q.limit(limit); const{data}=await q; return data?.length?data as NewsPost[]:(limit?fallbackNews.slice(0,limit):fallbackNews); }
export async function getNewsPost(slug:string){ const supabase=createClient(); if(!supabase)return fallbackNews.find(n=>n.slug===slug)||null; const{data}=await supabase.from("news").select("*").eq("slug",slug).eq("status","published").maybeSingle(); return (data as NewsPost|null)||null; }
export async function getGallery(collection?:GalleryItem["collection"]){ const supabase=createClient(); if(!supabase)return fallbackGallery; let q=supabase.from("site_media").select("*").eq("published",true).order("sort_order"); if(collection)q=q.eq("collection",collection); const{data}=await q; return (data as GalleryItem[])||[]; }
