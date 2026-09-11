"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { deleteProductMedia } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";
import type { MediaItem } from "@/lib/types";

type Slot = {
  token: string;
  existing?: MediaItem;
  originalIndex?: number;
  uploaded?: MediaItem;
  storagePath?: string;
  preview?: string;
  fileName?: string;
  uploading?: boolean;
  error?: string;
};

function emptySlot() {
  return { token: `n${Date.now()}-${Math.random().toString(36).slice(2)}` } satisfies Slot;
}

export default function ProductMediaManager({ existing = [], productId }: { existing?: MediaItem[]; productId?: string }) {
  const initial = useMemo<Slot[]>(() => {
    const retained = existing.slice(0, 8).map((media, index) => ({ token: `e${index}`, existing: media, originalIndex: index }));
    return [...retained, ...Array.from({ length: 8 - retained.length }, emptySlot)];
  }, [existing]);
  const [slots, setSlots] = useState(initial);
  const [dragged, setDragged] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const previewsRef = useRef(new Set<string>());
  const uploading = slots.some(slot => slot.uploading);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!submit) return;
    submit.disabled = uploading;
    submit.textContent = uploading ? "Uploading images..." : "Save Product";
    return () => {
      submit.disabled = false;
      submit.textContent = "Save Product";
    };
  }, [uploading]);

  useEffect(() => () => {
    previewsRef.current.forEach(url => URL.revokeObjectURL(url));
  }, []);

  function drop(event: DragEvent, target: number) {
    event.preventDefault();
    if (dragged === null || dragged === target) return;
    setSlots(current => {
      const next = [...current];
      const [item] = next.splice(dragged, 1);
      next.splice(target, 0, item);
      return next;
    });
    setDragged(null);
  }

  async function uploadFile(token: string, file: File) {
    const client = createClient();
    if (!client) {
      setSlots(current => current.map(slot => slot.token === token ? { ...slot, uploading: false, error: "Supabase is not connected." } : slot));
      return;
    }
    const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "bin";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      setSlots(current => current.map(slot => slot.token === token ? { ...slot, uploading: false, error: error.message } : slot));
      return;
    }
    const { data } = client.storage.from("media").getPublicUrl(path);
    const media: MediaItem = { type: file.type.startsWith("video/") ? "video" : "image", url: data.publicUrl, alt: file.name };
    setSlots(current => current.map(slot => {
      if (slot.token !== token) return slot;
      if (slot.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(slot.preview);
        previewsRef.current.delete(slot.preview);
      }
      return { ...slot, uploaded: media, storagePath: path, preview: data.publicUrl, uploading: false, error: undefined };
    }));
  }

  function addFiles(files: File[]) {
    setMessage("");
    const available = slots.filter(slot => !slot.existing && !slot.uploaded && !slot.uploading && !slot.preview).length;
    const selected = files.slice(0, available);
    if (files.length > available) setMessage(`Only ${available} more file(s) can be added. The product limit is 8.`);
    if (!selected.length) return;
    const additions = selected.map(file => {
      const preview = URL.createObjectURL(file);
      previewsRef.current.add(preview);
      return { token: `u${crypto.randomUUID()}`, file, preview };
    });
    setSlots(current => {
      const next = [...current];
      for (const addition of additions) {
        const index = next.findIndex(slot => !slot.existing && !slot.uploaded && !slot.uploading && !slot.preview);
        if (index !== -1) next[index] = { token: addition.token, preview: addition.preview, fileName: addition.file.name, uploading: true };
      }
      return next;
    });
    void Promise.all(additions.map(addition => uploadFile(addition.token, addition.file)));
  }

  function selectBatch(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files || []));
    event.target.value = "";
  }

  function selectSingle(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) addFiles([file]);
    event.target.value = "";
  }

  function clearSlot(slot: Slot) {
    if (slot.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(slot.preview);
      previewsRef.current.delete(slot.preview);
    }
    setSlots(current => current.map(item => item.token === slot.token ? emptySlot() : item));
  }

  async function removeSlot(slot: Slot) {
    if (slot.uploading || deleting) return;
    setMessage("");
    setDeleting(slot.token);
    try {
      if (slot.existing) {
        if (!productId) throw new Error("Save the product before deleting stored media.");
        await deleteProductMedia(productId, slot.existing.url);
        clearSlot(slot);
      } else if (slot.uploaded) {
        clearSlot(slot);
        if (slot.storagePath) {
          const client = createClient();
          const { error } = client ? await client.storage.from("media").remove([slot.storagePath]) : { error: new Error("Supabase is not connected.") };
          if (error) setMessage(`The image was removed, but storage cleanup failed: ${error.message}`);
        }
      } else {
        clearSlot(slot);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  const uploadedMedia = Object.fromEntries(slots.filter(slot => slot.uploaded).map(slot => [slot.token, slot.uploaded]));

  return <div ref={rootRef}>
    <h3>Product Images / Videos</h3>
    <p className="hint">Choose several files at once, up to 8 total. Files upload directly before Save. After upload, drag the numbered windows to reorder them. Position 1 becomes the cover image.</p>
    <label className="batch-upload-label">Upload Multiple Images / Videos at Once<input type="file" accept="image/*,video/*" multiple onChange={selectBatch}/></label>
    <input type="hidden" name="uploaded_media" value={JSON.stringify(uploadedMedia)}/>
    <input type="hidden" name="media_order" value={slots.map(slot => slot.token).join(",")}/>
    {message && <p className="media-manager-error" role="alert">{message}</p>}
    {uploading && <p className="media-manager-status" role="status">Uploading images. Save will unlock automatically when all uploads finish.</p>}
    <div className="product-upload-grid">{slots.map((slot, index) => <div className="product-upload-slot" key={slot.token} draggable={!slot.uploading} onDragStart={() => setDragged(index)} onDragOver={event => event.preventDefault()} onDrop={event => drop(event, index)}>
      <span className="upload-number">{index + 1}</span><span className="drag-handle">{slot.uploading ? "Uploading..." : "↕ Drag"}</span>
      <div className="upload-preview">{slot.preview ? <img src={slot.preview} alt={slot.fileName || "New upload"}/> : slot.existing ? (slot.existing.type === "video" ? <video src={slot.existing.url} muted/> : <img src={slot.existing.url} alt={slot.existing.alt || ""}/>) : <span>＋<small>Choose media</small></span>}</div>
      {slot.error && <p className="media-slot-error">{slot.error}</p>}
      {(slot.existing || slot.uploaded || slot.preview) && <button className="remove-media-button" type="button" disabled={slot.uploading || deleting === slot.token} onClick={() => void removeSlot(slot)}>{slot.uploading ? "Uploading..." : deleting === slot.token ? "Deleting..." : "Delete now"}</button>}
      {!slot.existing && !slot.uploaded && !slot.preview && (
        <input className="slot-file-input" type="file" accept="image/*,video/*" onChange={selectSingle}/>
      )}
    </div>)}</div>
  </div>;
}
