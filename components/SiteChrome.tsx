"use client";
import{usePathname}from"next/navigation";import Header from"./Header";import Footer from"./Footer";
export default function SiteChrome({children,categories}:{children:React.ReactNode;categories:string[]}){const path=usePathname();if(path.startsWith("/admin"))return <>{children}</>;return <><div className="tech-bg"/><Header categories={categories}/><main>{children}</main><Footer/></>}
