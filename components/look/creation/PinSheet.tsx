"use client";

import { useState, useCallback }  from "react";
import Image                       from "next/image";
import { v4 as uuidv4 }           from "uuid";
import { ShoppingBag, Plus, X }   from "lucide-react";
import type { PinnedProduct }      from "@/types/garment";

interface Props {
  imageUrl:   string;
  products:   PinnedProduct[];
  pendingPin: { x: number; y: number } | null;
  onTap:      (x: number, y: number) => void;
  onAdd:      (product: PinnedProduct) => void;
  onRemove:   (id: string) => void;
  onClearPin: () => void;
}

const EMPTY_FORM = { name: "", price: "", currency: "NGN", imageUrl: "", externalSource: "", isInternational: false };
type FormState = typeof EMPTY_FORM;

export function PinSheet({ imageUrl, products, pendingPin, onTap, onAdd, onRemove, onClearPin }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)  / rect.height) * 100;
    onTap(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
  }, [onTap]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price || !pendingPin) return;
    onAdd({
      id:              uuidv4(),
      name:            form.name.trim(),
      price:           parseFloat(form.price),
      currency:        form.currency,
      imageUrl:        form.imageUrl || undefined,
      xPosition:       pendingPin.x,
      yPosition:       pendingPin.y,
      externalSource:  form.externalSource || undefined,
      isInternational: form.isInternational,
    });
    setForm(EMPTY_FORM);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
          Tag products
        </p>
        <p className="text-[12px] text-zinc-400">Tap the image to pin a product</p>
      </div>

      {/* Image with pins */}
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 cursor-crosshair"
        onClick={handleImageClick}
      >
        <Image src={imageUrl} alt="Try-on" fill sizes="100vw" className="object-cover" />

        {products.map(p => (
          <button
            key={p.id}
            onClick={e => { e.stopPropagation(); onRemove(p.id); }}
            className="absolute z-10 w-8 h-8 -translate-x-1/2 -translate-y-1/2
                       rounded-full bg-white/90 border-2 border-white shadow-lg
                       flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            style={{ left: `${p.xPosition}%`, top: `${p.yPosition}%` }}
            title={`Remove: ${p.name}`}
          >
            <ShoppingBag size={13} className="text-[#9355A6]" />
          </button>
        ))}

        {pendingPin && (
          <div
            className="absolute z-20 w-8 h-8 -translate-x-1/2 -translate-y-1/2
                       rounded-full bg-[#9355A6] border-2 border-white shadow-lg
                       flex items-center justify-center animate-pulse"
            style={{ left: `${pendingPin.x}%`, top: `${pendingPin.y}%` }}
          >
            <Plus size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Add product form */}
      {pendingPin && (
        <div className="bg-zinc-50 rounded-2xl p-4 space-y-3 border border-zinc-200">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-black">Add product</p>
            <button onClick={onClearPin} className="text-zinc-400 hover:text-black transition cursor-pointer">
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Product name *"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full h-10 px-3 border border-zinc-200 rounded-xl text-[13px] bg-white
                       focus:outline-none focus:border-[#9355A6]"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Price *"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="flex-1 h-10 px-3 border border-zinc-200 rounded-xl text-[13px] bg-white
                         focus:outline-none focus:border-[#9355A6]"
            />
            <select
              value={form.currency}
              onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
              className="h-10 px-2 border border-zinc-200 rounded-xl text-[13px] bg-white
                         focus:outline-none focus:border-[#9355A6] cursor-pointer"
            >
              <option>NGN</option>
              <option>USD</option>
              <option>GBP</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Source (e.g. Zara, ASOS)"
            value={form.externalSource}
            onChange={e => setForm(f => ({ ...f, externalSource: e.target.value }))}
            className="w-full h-10 px-3 border border-zinc-200 rounded-xl text-[13px] bg-white
                       focus:outline-none focus:border-[#9355A6]"
          />
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || !form.price}
            className="w-full h-10 bg-[#9355A6] text-white rounded-xl text-[13px] font-semibold
                       cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7d4690] transition"
          >
            Pin product
          </button>
        </div>
      )}

      {/* Pinned products list */}
      {products.length > 0 && (
        <div className="space-y-2">
          <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">
            {products.length} product{products.length !== 1 ? "s" : ""} tagged
          </p>
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-zinc-50 rounded-xl px-3 py-2.5 border border-zinc-200">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-black truncate">{p.name}</p>
                <p className="text-[12px] text-zinc-500">{p.currency} {p.price.toLocaleString()}</p>
              </div>
              <button
                onClick={() => onRemove(p.id)}
                className="ml-3 text-zinc-400 hover:text-red-500 transition cursor-pointer flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
