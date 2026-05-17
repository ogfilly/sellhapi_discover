import type { NewLookStep } from "@/hooks/useNewLook";

const STEPS: { key: NewLookStep; label: string }[] = [
  { key: "model",   label: "Model"   },
  { key: "garment", label: "Garment" },
  { key: "tryon",   label: "Try-on"  },
  { key: "publish", label: "Publish" },
];

interface Props {
  current: NewLookStep;
}

export function StepIndicator({ current }: Props) {
  const currentIdx = STEPS.findIndex(s => s.key === current);

  return (
    <div className="flex items-center gap-0 px-4">
      {STEPS.map((step, i) => {
        const done    = i < currentIdx;
        const active  = i === currentIdx;

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                done   ? "bg-[#9355A6] text-white"
                : active ? "bg-black text-white"
                : "bg-zinc-200 text-zinc-500"
              }`}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-medium uppercase tracking-wider ${
                active ? "text-black" : done ? "text-[#9355A6]" : "text-zinc-400"
              }`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-4 transition-all ${done ? "bg-[#9355A6]" : "bg-zinc-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
