import"./admin.css";import"./login-fix.css";import AdminSidebar from"@/components/admin/AdminSidebar";
export default function AdminLayout({children}:{children:React.ReactNode}){return <div className="admin-body"><AdminSidebar/><section className="admin-content">{children}</section></div>}
