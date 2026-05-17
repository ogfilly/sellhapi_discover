"use client";

export const runtime = "edge";

import { useState, useCallback }   from "react";
import { useRouter }               from "next/navigation";
import { ArrowLeft }               from "lucide-react";
import toast                       from "react-hot-toast";
import { useNewLook }              from "@/hooks/useNewLook";
import { apiRequest }              from "@/lib/api";
import { StepIndicator }           from "@/components/look/creation/StepIndicator";
import { ModelSelector }           from "@/components/look/creation/ModelSelector";
import { LabelPicker }             from "@/components/look/creation/LabelPicker";
import { GarmentUploader }         from "@/components/look/creation/GarmentUploader";
import { TryOnProcessor }          from "@/components/look/creation/TryOnProcessor";
import { PinSheet }                from "@/components/look/creation/PinSheet";
import type { FashnCategory }      from "@/types/garment";

export default function NewLookPage() {
  const router            = useRouter();
  const { state, dispatch } = useNewLook();
  const [garmentLabel, setGarmentLabel] = useState<FashnCategory | null>(null);
  const [garmentUrl, setGarmentUrl]     = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [caption, setCaption]           = useState("");

  const handleGarmentReady = useCallback(() => {
    if (!garmentUrl || !garmentLabel) {
      toast.error("Upload a photo and choose the garment type");
      return;
    }
    dispatch({ type: "SET_GARMENT", payload: { url: garmentUrl, label: garmentLabel } });
  }, [garmentUrl, garmentLabel, dispatch]);

  const handlePublish = async () => {
    if (!state.tryOnUrl || !state.model) return;
    setIsPublishing(true);
    try {
      await apiRequest({
        method: "POST",
        url:    "/creators/looks",
        data:   {
          coverImage: state.tryOnUrl,
          images:     [state.tryOnUrl, ...(state.garmentUrl ? [state.garmentUrl] : [])],
          caption:    caption.trim() || null,
          status:     "published",
          products:   state.products.map(p => ({
            name:            p.name,
            price:           p.price,
            currency:        p.currency,
            imageUrl:        p.imageUrl,
            xPosition:       p.xPosition,
            yPosition:       p.yPosition,
            externalSource:  p.externalSource,
            isInternational: p.isInternational ?? false,
          })),
        },
      });
      toast.success("Look published!");
      router.push(`/${state.model.id}`);
    } catch (err: any) {
      toast.error(err?.error ?? "Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-white max-w-[480px] mx-auto pb-10">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white border-b border-zinc-200 flex items-center px-4 h-11 gap-3">
        <button
          onClick={() => state.step === "model" ? router.back() : dispatch({ type: "GO_BACK" })}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer"
        >
          <ArrowLeft size={18} className="text-black" />
        </button>
        <h1 className="text-[15px] font-bold text-black">New Look</h1>
      </nav>

      {/* Step indicator */}
      <div className="py-4 border-b border-zinc-100">
        <StepIndicator current={state.step} />
      </div>

      {/* Steps */}
      {state.step === "model" && (
        <ModelSelector onSelect={model => dispatch({ type: "SET_MODEL", payload: model })} />
      )}

      {state.step === "garment" && state.model && (
        <div className="px-4 py-6 space-y-6">
          <div>
            <h2 className="text-[16px] font-bold text-black">Upload your garment</h2>
            <p className="text-[13px] text-zinc-500 mt-0.5">
              A flat-lay or product photo on white background works best
            </p>
          </div>
          <GarmentUploader onUploaded={setGarmentUrl} />
          <LabelPicker value={garmentLabel} onChange={setGarmentLabel} />
          <button
            onClick={handleGarmentReady}
            disabled={!garmentUrl || !garmentLabel}
            className="w-full h-[50px] bg-black text-white rounded-full text-[15px] font-bold
                       cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                       hover:bg-zinc-800 transition-colors"
          >
            Generate Try-on
          </button>
        </div>
      )}

      {state.step === "tryon" && state.model && state.garmentUrl && state.garmentLabel && (
        <div className="px-4 py-6">
          <div className="mb-5">
            <h2 className="text-[16px] font-bold text-black">Your try-on</h2>
            <p className="text-[13px] text-zinc-500 mt-0.5">Powered by fashn.ai</p>
          </div>
          <TryOnProcessor
            model={state.model}
            garmentUrl={state.garmentUrl}
            category={state.garmentLabel}
            onResult={url => dispatch({ type: "SET_TRYON", payload: url })}
            onRetry={() => dispatch({ type: "RETRY_TRYON" })}
          />
        </div>
      )}

      {state.step === "publish" && state.tryOnUrl && (
        <div className="px-4 py-6 space-y-6">
          <div>
            <h2 className="text-[16px] font-bold text-black">Finish your look</h2>
            <p className="text-[13px] text-zinc-500 mt-0.5">Tag products and add a caption</p>
          </div>

          <PinSheet
            imageUrl={state.tryOnUrl}
            products={state.products}
            pendingPin={state.pendingPin}
            onTap={(x, y) => dispatch({ type: "SET_PENDING_PIN", payload: { x, y } })}
            onAdd={p => dispatch({ type: "ADD_PRODUCT", payload: p })}
            onRemove={id => dispatch({ type: "REMOVE_PRODUCT", payload: id })}
            onClearPin={() => dispatch({ type: "SET_PENDING_PIN", payload: null })}
          />

          <div>
            <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Caption
            </p>
            <textarea
              rows={3}
              maxLength={300}
              placeholder="Describe this look..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-2xl text-[14px] text-black
                         resize-none focus:outline-none focus:border-[#9355A6]"
            />
            <p className="text-[11px] text-zinc-400 text-right mt-1">{caption.length}/300</p>
          </div>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full h-[50px] bg-[#9355A6] text-white rounded-full text-[15px] font-bold
                       cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                       hover:bg-[#7d4690] transition-colors active:scale-[0.98]"
          >
            {isPublishing ? "Publishing..." : "Publish Look"}
          </button>
        </div>
      )}
    </main>
  );
}
