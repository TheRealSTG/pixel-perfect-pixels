import { occasions, type Occasion } from "@/lib/bouquet-data";
import { Check } from "lucide-react";

interface Props {
  selected: Occasion | null;
  onSelect: (occasion: Occasion) => void;
}

const OccasionStep = ({ selected, onSelect }: Props) => (
  <div>
    <h2 className="text-3xl font-serif font-semibold text-foreground text-center mb-2">
      What's the occasion?
    </h2>
    <p className="text-sm text-muted-foreground font-sans text-center mb-10">
      This shapes the flowers, colours, and feel of the bouquet.
    </p>

    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
      {occasions.map((occ) => {
        const isSelected = selected === occ.id;
        return (
          <button
            key={occ.id}
            onClick={() => onSelect(occ.id)}
            className={`group relative flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ease-out text-left ${
              isSelected
                ? "bg-primary/10 shadow-[0_2px_16px_-4px_hsl(var(--primary)/0.25)] scale-[1.02]"
                : "bg-transparent hover:bg-muted/60 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            <span className={`text-2xl transition-transform duration-300 ${
              isSelected ? "scale-110" : "group-hover:scale-110"
            }`}>{occ.emoji}</span>
            <span className={`font-sans font-medium text-sm transition-colors duration-300 ${
              isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
            }`}>{occ.label}</span>
            <span className={`absolute top-2.5 right-2.5 flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300 ${
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

export default OccasionStep;
