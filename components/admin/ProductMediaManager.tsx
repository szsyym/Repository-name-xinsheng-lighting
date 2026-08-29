"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { MediaItem } from "@/lib/types";

type Slot = { token: string; existing?: MediaItem; originalIndex?: number; preview?: string; fileName?: string; batch?: boolean };

export default function ProductMediaManager({ existing = [] }: { existing?: MediaItem[] }) {
  const initial = useMemo<Slot[]>(() => {
    const retained = existing.slice(0, 8).map((media, index) => ({ token: `e${index}`, existing: media, originalIndex: index }));
    const empty = Array.from({ length: Math.max(0, 8 - retained.length) }, (_, index) => ({ token: `n${index}` }));
    return [...retained, ...empty];
  }, [existing]);
  const [slots, setSlots] = useState(initial);
  const [dragged, setDragged] = useState<number | null>(null);

  function drop(event: DragEvent, target: number) {
    event.preventDefault();
    if (dragged === null || dragged === target) return;
    setSlots(current => { const next = [...current]; const [item] = next.splice(dragged, 1); next.splice(target, 0, item); return next; });
    setDragged(null);
  }

  function selectBatch(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    setSlots(current => {
      const retained = current.filter(slot => slot.existing);
      const capacity = Math.max(0, 8 - retained.length);
      const selected: Slot[] = files.slice(0, capacity).map((file, index) => ({ token: `b${index}`, preview: URL.createObjectURL(file), fileName: file.name, batch: true }));
      const empty = Array.from({ length: Math.max(0, capacity - selected.length) }, (_, index) => ({ token: `n${index}` }));
      return [...retained, ...selected, ...empty];
    });
  }

  function previewFile(token: string, file?: File) {
    setSlots(current => current.map(slot => slot.token === token ? { ...slot, preview: file ? URL.createObjectURL(file) : undefined, fileName: file?.name } : slot));
  }

  return <div>
    <h3>Product Images / Videos</h3>
    <p className="hint">Choose several files at once, up to 8 total. After selection, drag the numbered windows to reorder them. Position 1 becomes the cover image.</p>
    <label className="batch-upload-label">Upload Multiple Images / Videos at Once<input type="file" name="media_batch" accept="image/*,video/*" multiple onChange={selectBatch}/></label>
    <input type="hidden" name="media_order" value={slots.map(slot => slot.token).join(",")}/>
    <div className="product-upload-grid">{slots.map((slot, index) => <div className="product-upload-slot" key={slot.token} draggable onDragStart={() => setDragged(index)} onDragOver={event => event.preventDefault()} onDrop={event => drop(event, index)}>
      <span className="upload-number">{index + 1}</span><span className="drag-handle">↕ Drag</span>
      <div className="upload-preview">{slot.preview ? <img src={slot.preview} alt={slot.fileName || "New upload"}/> : slot.existing ? (slot.existing.type === "video" ? <video src={slot.existing.url} muted/> : <img src={slot.existing.url} alt={slot.existing.alt || ""}/>) : <span>＋<small>Choose media</small></span>}</div>
      {slot.existing ? <label className="delete-media-check"><input type="checkbox" name={`delete_media_${slot.originalIndex}`}/> Delete</label> : slot.batch ? <div className="batch-file-name" title={slot.fileName}>{slot.fileName}</div> : <input className="slot-file-input" type="file" name={`media_${slot.token}`} accept="image/*,video/*" onChange={event => previewFile(slot.token, event.target.files?.[0])}/>} 
    </div>)}</div>
  </div>;
}
