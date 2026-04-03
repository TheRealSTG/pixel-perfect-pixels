import { occasions, type Occasion } from "@/lib/bouquet-data";

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
      {occasions.map((occ) => (
        <button
          key={occ.id}
          onClick={() => onSelect(occ.id)}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all text-left ${
            selected === occ.id
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/30 bg-card"
          }`}
        >
          <span className="text-2xl">{occ.emoji}</span>
          <span className="font-sans font-medium text-sm text-foreground">{occ.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default OccasionStep;
