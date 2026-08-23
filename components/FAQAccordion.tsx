"use client";
import{Plus,Minus}from"lucide-react";import{useState}from"react";import type{QA}from"@/lib/types";
export default function FAQAccordion({items}:{items:QA[]}){const[active,setActive]=useState<number|null>(0);return <div className="faq-list">{items.map((x,i)=><div className="faq-item" key={x.question}><button className="faq-question" onClick={()=>setActive(active===i?null:i)}><span>{x.question}</span>{active===i?<Minus size={20}/>:<Plus size={20}/>}</button>{active===i&&<div className="faq-answer">{x.answer}</div>}</div>)}</div>}
