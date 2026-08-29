"use client";

import { useRef } from "react";

export default function RichTextEditor({ name, defaultValue = "", label }: { name: string; defaultValue?: string; label: string }) {
  const editor = useRef<HTMLDivElement>(null);
  const hidden = useRef<HTMLInputElement>(null);
  function sync() { if (hidden.current && editor.current) hidden.current.value = editor.current.innerHTML; }
  function command(type: string, value?: string) {
    editor.current?.focus();
    document.execCommand(type, false, value);
    sync();
  }
  return <label className="rich-editor-label">{label}
    <input ref={hidden} type="hidden" name={name} defaultValue={defaultValue}/>
    <div className="rich-toolbar" role="toolbar" aria-label={`${label} formatting`}>
      <button type="button" onClick={() => command("bold")}><strong>B</strong></button>
      <button type="button" onClick={() => command("italic")}><em>I</em></button>
      <button type="button" onClick={() => command("insertUnorderedList")}>• List</button>
      <button type="button" onClick={() => command("justifyLeft")}>Left</button>
      <button type="button" onClick={() => command("justifyCenter")}>Center</button>
      <button type="button" onClick={() => command("justifyRight")}>Right</button>
      <label className="color-tool">Color<input type="color" defaultValue="#2b241d" onChange={event => command("foreColor", event.target.value)}/></label>
      <button type="button" onClick={() => command("removeFormat")}>Clear</button>
    </div>
    <div ref={editor} className="rich-editor" contentEditable suppressContentEditableWarning onInput={sync} onBlur={sync} dangerouslySetInnerHTML={{ __html: defaultValue }}/>
  </label>;
}
