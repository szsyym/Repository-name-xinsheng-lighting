import type { Metadata } from "next";
import"./admin.css";import"./login-fix.css";import AdminSidebar from"@/components/admin/AdminSidebar";

export const metadata: Metadata = { other: { google: "notranslate" } };

export default function AdminLayout({children}:{children:React.ReactNode}){return <div className="admin-body notranslate" translate="no"><AdminSidebar/><section className="admin-content">{children}</section></div>}
