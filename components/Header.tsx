"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner"><Link href="/" className="logo brand-image-link"><img src="/xinshern-logo.jpg" alt="XINSHERN"/></Link><nav className="desktop-nav"><Link href="/">Home</Link><div className="nav-dropdown"><button>Products</button><div className="mega-menu"><Link className="all-products-link" href="/products">All Products</Link>{categories.map(category => <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>{category}</Link>)}</div></div><Link href="/solutions">Solutions</Link><Link href="/factory">Factory</Link><Link href="/faq">FAQ</Link><Link href="/scenes">Scenes</Link><Link href="/resources">Resources</Link><Link href="/news">News</Link><Link href="/contact">Contact</Link></nav><Link href="/contact" className="header-cta">Get a Quote</Link><button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div><div className={`mobile-menu ${open ? "open" : ""}`}>{["Home", "Products", "Solutions", "Factory", "FAQ", "Scenes", "Resources", "News", "Contact"].map(item => <Link key={item} onClick={() => setOpen(false)} href={item === "Home" ? "/" : `/${item.toLowerCase()}`}>{item}</Link>)}</div></header>;
}
