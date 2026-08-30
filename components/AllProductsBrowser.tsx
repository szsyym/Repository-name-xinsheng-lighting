"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function AllProductsBrowser({ products, categories, selectedCategory, searchPlaceholder, searchHelp, emptyMessage, countLabel }: { products: Product[]; categories: string[]; selectedCategory?: string; searchPlaceholder: string; searchHelp: string; emptyMessage: string; countLabel: string }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (!normalized) return true;
    return [product.name, product.model, product.category, product.subcategory, product.short_description].some(value => String(value || "").toLowerCase().includes(normalized));
  }), [products, selectedCategory, normalized]);
  const visibleCategories = categories.filter(category => filtered.some(product => product.category === category));

  return <>
    <div className="all-products-search"><label htmlFor="product-search">{searchHelp}</label><div className="product-search-row"><input id="product-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={searchPlaceholder}/><span>{filtered.length} {countLabel}</span></div></div>
    {visibleCategories.length ? visibleCategories.map(category => <section className="category-section all-products-category" key={category}><div className="category-heading"><h2>{category}</h2><span>{filtered.filter(product => product.category === category).length} {countLabel}</span></div><div className="product-grid all-products-grid">{filtered.filter(product => product.category === category).map(product => <ProductCard product={product} key={product.id}/>)}</div></section>) : <div className="empty products-empty">{emptyMessage}</div>}
  </>;
}
