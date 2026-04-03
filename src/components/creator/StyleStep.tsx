import { artStyles, type ArtStyle } from "@/lib/bouquet-data";

interface Props {
  selected: ArtStyle | null;
  onSelect: (style: ArtStyle) => void;
}

const StyleStep = ({ selected, onSelect }: Props) => (
  <div>
    <h2 className="text-3xl font-serif font-semibold text-foreground text-center mb-2">
      Choose a style
    </h2>
    <p className="text-sm text-muted-foreground font-sans text-center mb-10">
      Each style creates a different visual feel for the bouquet.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
      {artStyles.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={`flex flex-col items-start px-6 py-5 rounded-xl border-2 transition-all text-left ${
            selected === style.id
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/30 bg-card"
          }`}
        >
          <span className="text-3xl mb-3">{style.emoji}</span>
          <span className="font-sans font-semibold text-sm text-foreground mb-1">
            {style.label}
          </span>
          <span className="font-sans text-xs text-muted-foreground leading-relaxed">
            {style.description}
          </span>
          <span className="mt-3 text-[11px] font-sans font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {style.speed}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default StyleStep;
