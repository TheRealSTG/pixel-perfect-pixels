import type { CreationMode } from "@/lib/bouquet-data";
import { Check, Sparkles, Palette } from "lucide-react";

interface Props {
  selected: CreationMode | null;
  onSelect: (mode: CreationMode) => void;
}

const modes = [
  {
    id: "guided" as CreationMode,
    label: "Guided",
    description: "We'll compose a beautiful bouquet based on your choices — sit back and enjoy.",
    emoji: <Sparkles className="text-accent" size={28} />,
    tag: "Quick & easy",
  },
  {
    id: "pro" as CreationMode,
    label: "Pro Florist",
    description: "Hand-pick every flower, arrange the layout, and craft it exactly how you want.",
    emoji: <Palette className="text-primary" size={28} />,
    tag: "Full control",
  },
];

const ModeStep = ({ selected, onSelect }: Props) => (
  <div>
    <h2 className="text-3xl font-serif font-semibold text-foreground text-center mb-2">
      How would you like to create?
    </h2>
    <p className="text-sm text-muted-foreground font-sans text-center mb-10">
      Go guided for a curated experience, or take full creative control.
    </p>

    <div className="flex flex-col gap-3 max-w-sm mx-auto">
      {modes.map((m) => {
        const isSelected = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`group relative flex items-start gap-4 px-6 py-5 rounded-2xl transition-all duration-300 ease-out text-left ${
              isSelected
                ? "bg-primary/10 shadow-[0_2px_16px_-4px_hsl(var(--primary)/0.25)] scale-[1.02]"
                : "bg-transparent hover:bg-muted/60 hover:scale-[1.01] active:scale-[0.98]"
            }`}
          >
            <span className={`mt-0.5 transition-transform duration-300 ${
              isSelected ? "scale-110" : "group-hover:scale-110"
            }`}>{m.emoji}</span>
            <div className="flex-1">
              <span className={`font-sans font-semibold text-sm block mb-1 transition-colors duration-300 ${
                isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              }`}>{m.label}</span>
              <span className="font-sans text-xs text-muted-foreground leading-relaxed block">
                {m.description}
              </span>
              <span className={`inline-block mt-2.5 text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full transition-colors duration-300 ${
                isSelected
                  ? "text-primary bg-primary/15"
                  : "text-muted-foreground bg-muted/60"
              }`}>
                {m.tag}
              </span>
            </div>
            <span className={`absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 ${
              isSelected
                ? "bg-primary scale-100 opacity-100"
                : "bg-transparent scale-0 opacity-0"
            }`}>
              <Check className="text-primary-foreground" size={12} strokeWidth={3} />
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default ModeStep;
