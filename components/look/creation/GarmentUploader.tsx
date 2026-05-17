"use client";

import { useCallback, useRef, useState } from "react";
import Image                              from "next/image";
import { Upload, X }                      from "lucide-react";
import { apiClient }                      from "@/lib/api";

interface Props {
  onUploaded: (url: string) => void;
}

export function GarmentUploader({ onUploaded }: Props) {
  const [preview,     setPreview]     = useState<string | null>(null);
  const [uploading,   setUploading]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const form = new FormData();
      form.append("image", file);
      const res = await apiClient.post<{ data: { url: string } }>(
        "/creators/me/upload",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      onUploaded(res.data.data.url);
    } catch {
      setError("Upload failed — try again");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="space-y-3">
      <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">
        Upload garment photo
      </p>

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-100">
          <Image src={preview} alt="Garment" fill className="object-contain" sizes="100vw" />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!uploading && (
            <button
              onClick={() => { setPreview(null); setError(null); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center
                         justify-center cursor-pointer hover:bg-black/70 transition"
            >
              <X size={14} className="text-white" />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="w-full aspect-[3/4] border-2 border-dashed border-zinc-300 rounded-2xl
                     flex flex-col items-center justify-center gap-3 cursor-pointer
                     hover:border-[#9355A6] hover:bg-[#F8F4FF] transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
            <Upload size={20} className="text-zinc-400" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-semibold text-black">Tap to upload</p>
            <p className="text-[12px] text-zinc-500 mt-0.5">or drag & drop</p>
          </div>
        </button>
      )}

      {error && (
        <p className="text-[12px] text-red-500 text-center">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onFileChange}
      />
    </div>
  );
}
