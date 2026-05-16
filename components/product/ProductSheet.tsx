"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
}                         from "react";
import { ProductCard }    from "./ProductCard";
import type { LookProduct } from "@/types/product";
import { X }              from "lucide-react";
import toast              from "react-hot-toast";

interface Props {
  products: LookProduct[];
  onClose:  () => void;
}

export function ProductSheet({ products, onClose }: Props) {
  const sheetRef              = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [cart, setCart]       = useState<Set<string>>(new Set());

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const handleOrder = useCallback((product: LookProduct) => {
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        toast(`Removed ${product.name}`, { icon: "🗑️" });
      } else {
        next.add(product.id);
        toast.success(`Added ${product.name}`);
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

  return (
    <div
      className="absolute inset-0 z-30 flex items-end"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition:      "background-color 0.3s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal
      aria-label="Shop this look"
    >
      <div
        ref={sheetRef}
        style={{
          transform:  visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        className="w-full bg-white rounded-t-[24px] max-h-[80vh]
                   flex flex-col overflow-hidden"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden>
          <div className="w-10 h-1 bg-[#E0E0E0] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-1">
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
            className="w-8 h-8 flex items-center justify-center
                       rounded-full bg-[#F0F0F0] cursor-pointer hover:bg-[#E8E8E8] transition"
          >
            <X size={16} color="#666" />
          </button>
        </div>

        {/* Product list */}
        <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                outline:      cart.has(product.id) ? "2px solid #9355A6" : "none",
                borderRadius: 14,
              }}
            >
              <ProductCard product={product} onOrder={handleOrder} />
            </div>
          ))}
        </div>

        {/* Checkout */}
        <div className="px-4 pb-8 pt-3 border-t border-[#F0F0F0]">
          <button
            onClick={handleCheckout}
            disabled={cart.size === 0}
            className="w-full h-[52px] bg-[#9355A6] text-white rounded-full
                       text-[15px] font-bold cursor-pointer
                       hover:bg-[#7d4690] transition-all active:scale-[0.98]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-[#9355A6]"
          >
            {cart.size > 0
              ? `Order ${cart.size} item${cart.size !== 1 ? "s" : ""} via SellHapi`
              : "Select items to order"
            }
          </button>
          <p className="text-[11px] text-[#999] text-center mt-2">
            SellHapi handles all orders and delivery
          </p>
        </div>
      </div>
    </div>
  );
}
