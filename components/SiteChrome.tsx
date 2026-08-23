"use client";
import{usePathname}from"next/navigation";import Header from"./Header";import Footer from"./Footer";
export default function SiteChrome({children}:{children:React.ReactNode}){const path=usePathname();if(path.startsWith("/admin"))return <>{children}</>;return <><div className="tech-bg"/><Header/><main>{children}</main><Footer/></>}
