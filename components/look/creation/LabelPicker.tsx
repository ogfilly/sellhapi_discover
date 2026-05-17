import { GARMENT_OPTIONS } from "@/types/garment";
import type { FashnCategory } from "@/types/garment";

interface Props {
  value:    FashnCategory | null;
  onChange: (v: FashnCategory) => void;
}

export function LabelPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">
        What type of garment?
      </p>
      <div className="grid grid-cols-3 gap-2">
        {GARMENT_OPTIONS.map(opt => (
          <button
            key={opt.category}
            onClick={() => onChange(opt.category)}
            className={`py-3 px-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              value === opt.category
                ? "border-[#9355A6] bg-[#F8F4FF] text-[#9355A6]"
                : "border-zinc-200 bg-white text-black hover:border-zinc-400"
            }`}
          >
            <span className="text-[12px] font-medium leading-tight">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
