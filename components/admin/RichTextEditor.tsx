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
  function addLink() {
    const url = window.prompt("Enter link URL");
    if (url) command("createLink", url);
  }
  return <label className="rich-editor-label">{label}
    <input ref={hidden} type="hidden" name={name} defaultValue={defaultValue}/>
    <div className="rich-toolbar" role="toolbar" aria-label={`${label} formatting`}>
      <button type="button" onClick={() => command("bold")}><strong>B</strong></button>
      <button type="button" onClick={() => command("italic")}><em>I</em></button>
      <button type="button" onClick={() => command("underline")}><u>U</u></button>
      <select aria-label="Text style" defaultValue="p" onChange={event => command("formatBlock", event.target.value)}>
        <option value="p">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="blockquote">Quote</option>
      </select>
      <select aria-label="Font size" defaultValue="3" onChange={event => command("fontSize", event.target.value)}>
        <option value="2">Small</option>
        <option value="3">Normal</option>
        <option value="4">Large</option>
        <option value="5">Extra large</option>
      </select>
      <button type="button" onClick={() => command("insertUnorderedList")}>• List</button>
      <button type="button" onClick={() => command("insertOrderedList")}>1. List</button>
      <button type="button" onClick={() => command("justifyLeft")}>Left</button>
      <button type="button" onClick={() => command("justifyCenter")}>Center</button>
      <button type="button" onClick={() => command("justifyRight")}>Right</button>
      <label className="color-tool">Color<input type="color" defaultValue="#2b241d" onChange={event => command("foreColor", event.target.value)}/></label>
      <button type="button" onClick={addLink}>Link</button>
      <button type="button" onClick={() => command("unlink")}>Unlink</button>
      <button type="button" onClick={() => command("removeFormat")}>Clear</button>
    </div>
    <div ref={editor} className="rich-editor" contentEditable suppressContentEditableWarning onInput={sync} onBlur={sync} dangerouslySetInnerHTML={{ __html: defaultValue }}/>
  </label>;
}
