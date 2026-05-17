"use client";

import {
  useEffect, useState, useCallback,
}                         from "react";
import { ProductCard }    from "./ProductCard";
import type { LookProduct } from "@/types/product";
import { X }              from "lucide-react";
import toast              from "react-hot-toast";

interface Props {
  products: LookProduct[];
  isOpen:   boolean;
  onClose:  () => void;
}

export function ProductSheet({ products, isOpen, onClose }: Props) {
  const [cart,    setCart]    = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(false);

  // Animate in after mount
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleToggle = useCallback((product: LookProduct) => {
    setCart(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  }, []);

  const handleCheckout = () => {
    if (cart.size === 0) {
      toast.error("Select at least one item");
      return;
    }
    // TODO: wire to order creation endpoint
    toast.success("Proceeding to checkout");
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal
        aria-label="Shop this look"
        className={`absolute inset-x-0 bottom-0 z-40 flex flex-col
                    bg-white rounded-t-3xl max-h-[80vh]
                    transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden>
          <div className="w-10 h-1 bg-zinc-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-1
                        border-b border-zinc-100">
          <div>
            <h3 className="text-[16px] font-bold text-black">Shop this Look</h3>
            {cart.size > 0 && (
              <p className="text-[12px] text-[#9355A6] font-medium">
                {cart.size} item{cart.size !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-zinc-100 flex items-center
                       justify-center cursor-pointer hover:bg-zinc-200 transition"
          >
            <X size={16} className="text-zinc-600" />
          </button>
        </div>

        {/* Product list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              selected={cart.has(product.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="px-4 pb-8 pt-3 border-t border-zinc-100">
          <button
            onClick={handleCheckout}
            disabled={cart.size === 0}
            className="w-full h-[50px] bg-[#9355A6] hover:bg-[#7d4690]
                       active:bg-[#6b3880] text-white rounded-full
                       text-[15px] font-bold cursor-pointer transition-all
                       active:scale-[0.98] disabled:opacity-40
                       disabled:cursor-not-allowed
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-[#9355A6] focus-visible:ring-offset-2"
          >
            {cart.size > 0
              ? `Order ${cart.size} item${cart.size !== 1 ? "s" : ""} via SellHapi`
              : "Select items to order"
            }
          </button>
          <p className="text-[11px] text-zinc-400 text-center mt-2">
            SellHapi handles all orders and delivery
          </p>
        </div>
      </div>
    </>
  );
}
