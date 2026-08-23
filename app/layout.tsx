import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default:"Xinshern Lighting | LED Lighting Manufacturer", template:"%s | Xinshern Lighting" },
  description:"Shenzhen Xinshern Technology designs and manufactures festival, gift, ambient, home and custom lighting for global B2B buyers.",
  keywords:["LED lighting manufacturer","custom lighting factory","OEM lighting","gift lighting","festival lighting","candle warmer lamp"],
  openGraph:{title:"Xinshern Lighting",description:"Lighting products designed, engineered and manufactured for global brands.",type:"website"}
};

export default async function RootLayout({children}:{children:React.ReactNode}){
  const categories=(await getCategories()).map(category=>category.name);
  return <html lang="en"><body><SiteChrome categories={categories}>{children}</SiteChrome></body></html>;
}
