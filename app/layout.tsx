import type { Metadata } from "next";
import "./globals.css";
import "./v3.css";
import SiteChrome from "@/components/SiteChrome";
import { getCategories, getSetting } from "@/lib/queries";

export async function generateMetadata():Promise<Metadata>{const row=await getSetting("global_seo"),seo:any=row?.value||{};const title=seo.title||"Xinshern Lighting | LED Lighting Manufacturer",description=seo.description||"Shenzhen Xinshern Technology designs and manufactures festival, gift, ambient, home and custom lighting for global B2B buyers.";return{metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"),title:{default:title,template:"%s | Xinshern Lighting"},description,keywords:String(seo.keywords||"LED lighting manufacturer, custom lighting factory, OEM lighting, gift lighting, festival lighting").split(",").map((x:string)=>x.trim()),alternates:{canonical:"/"},openGraph:{title,description,type:"website"},twitter:{card:"summary_large_image",title,description}}}

export default async function RootLayout({children}:{children:React.ReactNode}){
  const [categoryRows,entity]=await Promise.all([getCategories(),getSetting("company_entity")]);
  const categories=categoryRows.map(category=>category.name),e:any=entity?.value||{};
  const organization={"@context":"https://schema.org","@type":"Organization",name:e.name||"Shenzhen Xinshern Technology Co., Ltd.",alternateName:e.brand||"XINSHERN",url:process.env.NEXT_PUBLIC_SITE_URL||"https://repository-name-xinsheng-lighting.vercel.app",address:{"@type":"PostalAddress",addressLocality:"Shenzhen",addressCountry:"CN"},description:e.products||"OEM and ODM LED lighting manufacturer."};
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization)}}/><SiteChrome categories={categories}>{children}</SiteChrome></body></html>;
}
