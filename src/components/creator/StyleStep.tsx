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

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
      {artStyles.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={`group flex flex-col items-start px-6 py-5 rounded-2xl transition-all duration-300 ease-out text-left ${
            selected === style.id
              ? "bg-primary/10 shadow-[0_2px_16px_-4px_hsl(var(--primary)/0.25)] scale-[1.02]"
              : "bg-transparent hover:bg-muted/60 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          <span className={`text-3xl mb-3 transition-transform duration-300 ${
            selected === style.id ? "scale-110" : "group-hover:scale-110"
          }`}>{style.emoji}</span>
          <span className={`font-sans font-semibold text-sm mb-1 transition-colors duration-300 ${
            selected === style.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          }`}>
            {style.label}
          </span>
          <span className="font-sans text-xs text-muted-foreground leading-relaxed">
            {style.description}
          </span>
          <span className={`mt-3 text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full transition-colors duration-300 ${
            selected === style.id
              ? "text-primary bg-primary/15"
              : "text-muted-foreground bg-muted/60"
          }`}>
            {style.speed}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default StyleStep;
