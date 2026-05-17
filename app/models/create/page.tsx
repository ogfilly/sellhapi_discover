"use client";

import { useState }    from "react";
import { useRouter }   from "next/navigation";
import { ArrowLeft }   from "lucide-react";
import { Loader2, Sparkles } from "lucide-react";
import toast           from "react-hot-toast";
import { apiRequest }  from "@/lib/api";

// ── Constants (identical to vendor page) ────────────────────────────────────

const GENDERS = [
  { value: "female", label: "Female", emoji: "👩🏽" },
  { value: "male",   label: "Male",   emoji: "👨🏽" },
];

const ETHNICITIES = [
  { value: "yoruba",          label: "Yoruba 🇳🇬" },
  { value: "igbo",            label: "Igbo 🇳🇬" },
  { value: "hausa",           label: "Hausa 🇳🇬" },
  { value: "south_african",   label: "South African 🇿🇦" },
  { value: "ethiopian",       label: "Ethiopian 🇪🇹" },
  { value: "ghanaian",        label: "Ghanaian 🇬🇭" },
  { value: "kenyan",          label: "Kenyan 🇰🇪" },
  { value: "african_american", label: "African American 🇺🇸" },
  { value: "latino",          label: "Latino 🌎" },
  { value: "indian",          label: "Indian 🇮🇳" },
  { value: "korean",          label: "Korean 🇰🇷" },
  { value: "japanese",        label: "Japanese 🇯🇵" },
  { value: "chinese",         label: "Chinese 🇨🇳" },
  { value: "arabic",          label: "Arabic 🌙" },
  { value: "english",         label: "English 🇬🇧" },
  { value: "scandinavian",    label: "Scandinavian 🇸🇪" },
  { value: "mediterranean",   label: "Mediterranean 🇮🇹" },
  { value: "brazilian",       label: "Brazilian 🇧🇷" },
  { value: "mixed",           label: "Mixed 🌍" },
];

const AGE_RANGES = [
  { value: "teens",    label: "Teens" },
  { value: "20s",      label: "20s"   },
  { value: "30s",      label: "30s"   },
  { value: "40s",      label: "40s"   },
  { value: "50s_plus", label: "50s+"  },
];

const SKIN_TONES = [
  { value: "porcelain", label: "Porcelain", color: "#F5D6C3" },
  { value: "ivory",     label: "Ivory",     color: "#F0D0A8" },
  { value: "sand",      label: "Sand",      color: "#DEB887" },
  { value: "honey",     label: "Honey",     color: "#C8956C" },
  { value: "caramel",   label: "Caramel",   color: "#A0724A" },
  { value: "toffee",    label: "Toffee",    color: "#8B5E3C" },
  { value: "chestnut",  label: "Chestnut",  color: "#6B4226" },
  { value: "cocoa",     label: "Cocoa",     color: "#4E3020" },
  { value: "espresso",  label: "Espresso",  color: "#3B2412" },
  { value: "ebony",     label: "Ebony",     color: "#2A1A0E" },
];

const BODY_SHAPES = [
  { value: "slim",      label: "Slim",    emoji: "🦴" },
  { value: "athletic",  label: "Athletic", emoji: "💪" },
  { value: "average",   label: "Average",  emoji: "🧍" },
  { value: "curvy",     label: "Curvy",    emoji: "⏳" },
  { value: "plus",      label: "Plus",     emoji: "🫶" },
];

const FEMALE_HAIR_TYPES = [
  { value: "short",   label: "Short"          },
  { value: "medium",  label: "Medium"         },
  { value: "long",    label: "Long"           },
  { value: "afro",    label: "Afro"           },
  { value: "braids",  label: "Braids / Locs"  },
  { value: "curly",   label: "Curly"          },
  { value: "straight", label: "Straight"      },
  { value: "hijab",   label: "Hijab / Headwrap" },
];

const MALE_HAIR_TYPES = [
  { value: "bald",   label: "Bald / Shaved" },
  { value: "buzz",   label: "Buzz Cut"      },
  { value: "fade",   label: "Fade"          },
  { value: "short",  label: "Short"         },
  { value: "afro",   label: "Afro"          },
  { value: "braids", label: "Braids / Locs" },
  { value: "curly",  label: "Curly"         },
  { value: "long",   label: "Long"          },
];

const HAIR_COLORS = [
  { value: "jet_black",    label: "Black",   color: "#0A0A0A" },
  { value: "dark_brown",   label: "Brown",   color: "#3B2412" },
  { value: "honey_blonde", label: "Blonde",  color: "#C8943E" },
  { value: "bright_red",   label: "Red",     color: "#CC2222" },
  { value: "grey_silver",  label: "Grey",    color: "#9E9E9E" },
  { value: "dyed_purple",  label: "Colored", color: "#9C27B0" },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CreateModelPage() {
  const router = useRouter();

  const [name,       setName]       = useState("");
  const [gender,     setGender]     = useState("");
  const [ethnicity,  setEthnicity]  = useState("");
  const [ageRange,   setAgeRange]   = useState("");
  const [skinTone,   setSkinTone]   = useState("");
  const [bodyShape,  setBodyShape]  = useState("");
  const [hairType,   setHairType]   = useState("");
  const [hairColor,  setHairColor]  = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const canCreate = name.trim() && gender && ageRange && skinTone && bodyShape;

  const handleCreate = async () => {
    if (!canCreate || isCreating) return;
    setIsCreating(true);
    try {
      const res = await apiRequest<{ data: { modelId: string } }>({
        url:     "/creators/me/models",
        method:  "POST",
        data:    {
          name:      name.trim(),
          gender,
          ageRange,
          skinTone,
          bodyShape,
          ethnicity:  ethnicity  || undefined,
          hairType:   hairType   || undefined,
          hairColor:  hairColor  || undefined,
          imageCount: 1,
        },
        timeout: 30_000,
      });
      toast.success("Model generation started!");
      router.push(`/models/${res.data.modelId}`);
    } catch (err: any) {
      toast.error(err?.error ?? "Failed to create model");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-white max-w-[480px] mx-auto pb-10">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white border-b border-zinc-200 flex items-center px-4 h-11 gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer"
        >
          <ArrowLeft size={18} className="text-black" />
        </button>
        <h1 className="text-[15px] font-bold text-black">Build Model</h1>
      </nav>

      <div className="px-4 py-6 space-y-6">

        {/* Name */}
        <Section label="Name your model">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Amara, Jin, Sofia"
            maxLength={30}
            className="w-full px-3 py-2.5 border border-zinc-200 rounded-2xl text-[14px] text-black
                       focus:border-[#9355A6] focus:outline-none text-center"
          />
        </Section>

        {/* Gender */}
        <Section label="Gender">
          <div className="grid grid-cols-2 gap-2">
            {GENDERS.map(g => (
              <SelectCard
                key={g.value}
                selected={gender === g.value}
                onClick={() => { setGender(g.value); setHairType(""); setHairColor(""); }}
              >
                <span className="text-[24px] mb-1">{g.emoji}</span>
                <span className="text-[12px] font-medium">{g.label}</span>
              </SelectCard>
            ))}
          </div>
        </Section>

        {/* Ethnicity */}
        <Section label="Ethnicity">
          <div className="flex flex-wrap gap-2">
            {ETHNICITIES.map(e => (
              <Pill
                key={e.value}
                selected={ethnicity === e.value}
                onClick={() => setEthnicity(ethnicity === e.value ? "" : e.value)}
              >
                {e.label}
              </Pill>
            ))}
          </div>
        </Section>

        {/* Age Range */}
        <Section label="Age Range">
          <div className="flex gap-2">
            {AGE_RANGES.map(a => (
              <Pill
                key={a.value}
                selected={ageRange === a.value}
                onClick={() => setAgeRange(a.value)}
                className="flex-1 justify-center"
              >
                {a.label}
              </Pill>
            ))}
          </div>
        </Section>

        {/* Skin Tone */}
        <Section label="Skin Tone">
          <div className="flex gap-1.5 flex-wrap">
            {SKIN_TONES.map(t => (
              <button
                key={t.value}
                onClick={() => setSkinTone(t.value)}
                title={t.label}
                className={`w-[30px] h-[30px] rounded-full cursor-pointer transition-all relative
                            flex items-center justify-center ${
                  skinTone === t.value
                    ? "ring-2 ring-black ring-offset-2"
                    : "hover:ring-1 hover:ring-zinc-400 hover:ring-offset-1"
                }`}
                style={{ backgroundColor: t.color }}
              >
                {skinTone === t.value && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke={["porcelain","ivory","sand","honey"].includes(t.value) ? "#000" : "#fff"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {skinTone && (
            <p className="text-[11px] text-zinc-500 mt-1.5">
              {SKIN_TONES.find(t => t.value === skinTone)?.label}
            </p>
          )}
        </Section>

        {/* Body Shape */}
        <Section label="Body Shape">
          <div className="grid grid-cols-5 gap-2">
            {BODY_SHAPES.map(b => (
              <SelectCard
                key={b.value}
                selected={bodyShape === b.value}
                onClick={() => setBodyShape(b.value)}
                compact
              >
                <span className="text-[20px]">{b.emoji}</span>
                <span className="text-[10px] font-medium mt-0.5">{b.label}</span>
              </SelectCard>
            ))}
          </div>
        </Section>

        {/* Hair */}
        <Section label="Hair">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {(gender === "male" ? MALE_HAIR_TYPES : FEMALE_HAIR_TYPES).map(h => (
              <Pill
                key={h.value}
                selected={hairType === h.value}
                onClick={() => setHairType(hairType === h.value ? "" : h.value)}
                className="justify-center text-center"
              >
                {h.label}
              </Pill>
            ))}
          </div>
          {hairType && !["bald", "buzz", "hijab"].includes(hairType) && (
            <div>
              <p className="text-[11px] text-zinc-400 mb-2">Hair Color</p>
              <div className="flex gap-1.5 flex-wrap">
                {HAIR_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setHairColor(hairColor === c.value ? "" : c.value)}
                    title={c.label}
                    className={`w-[28px] h-[28px] rounded-full cursor-pointer transition-all relative
                                flex items-center justify-center ${
                      hairColor === c.value
                        ? "ring-2 ring-black ring-offset-2"
                        : "hover:ring-1 hover:ring-zinc-400 hover:ring-offset-1"
                    }`}
                    style={{ background: c.color }}
                  >
                    {hairColor === c.value && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              {hairColor && (
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  {HAIR_COLORS.find(c => c.value === hairColor)?.label}
                </p>
              )}
            </div>
          )}
        </Section>

        {/* Create */}
        <button
          onClick={handleCreate}
          disabled={!canCreate || isCreating}
          className="w-full h-[50px] bg-[#9355A6] text-white rounded-full text-[15px] font-bold
                     cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-[#7d4690] transition-colors flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <><Loader2 size={18} className="animate-spin" /> Generating...</>
          ) : (
            <><Sparkles size={18} /> Create Model</>
          )}
        </button>
        <p className="text-[11px] text-zinc-400 text-center -mt-3">
          AI will generate your model in ~30 seconds
        </p>
      </div>
    </main>
  );
}

// ── Reusable sub-components ──────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-black mb-2">{label}</p>
      {children}
    </div>
  );
}

function SelectCard({
  selected, onClick, children, compact,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode; compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 cursor-pointer transition-all ${
        compact ? "py-2" : "py-4"
      } ${selected ? "border-[#9355A6] bg-[#F8F4FF]" : "border-zinc-200 hover:border-zinc-400"}`}
    >
      {children}
    </button>
  );
}

function Pill({
  selected, onClick, children, className = "",
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-[12px] font-medium cursor-pointer transition-all flex items-center ${className} ${
        selected ? "bg-[#9355A6] text-white" : "bg-zinc-100 text-black hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}
