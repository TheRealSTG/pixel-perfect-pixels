import { useMemo } from "react";
import type { BouquetConfig } from "@/lib/bouquet-data";
import { occasions, moods, artStyles } from "@/lib/bouquet-data";
import { composeBouquet } from "@/lib/bouquet-engine";
import BouquetCanvas from "@/components/flowers/BouquetCanvas";

interface Props {
  config: BouquetConfig;
}

const ReviewStep = ({ config }: Props) => {
  const occ   = occasions.find((o) => o.id === config.occasion);
  const m     = moods.find((m) => m.id === config.mood);
  const style = artStyles.find((s) => s.id === config.artStyle);

  // Live preview of the actual bouquet they're about to receive
  const composition = useMemo(() =>
    composeBouquet(
      config.occasion,
      config.mood,
      config.artStyle,
      config.recipient.name,
      config.recipient.favouriteColour,
      config.recipient.city,
    ), [config]);

  return (
    <div>
      <h2 className="text-3xl font-serif font-semibold text-foreground text-center mb-2">
        Ready to bloom
      </h2>
      <p className="text-sm text-muted-foreground font-sans text-center mb-8">
        Here's what we'll create for {config.recipient.name}.
      </p>

      <div className="max-w-sm mx-auto">
        {/* Live bouquet preview */}
        <div className="bg-[#FAF7F4] rounded-2xl border border-border p-4 mb-6 shadow-sm">
          <BouquetCanvas
            flowers={composition.flowers}
            wrapColor={composition.wrapColor}
            wrapAccent={composition.wrapAccent}
            artStyle={config.artStyle}
            wrapStyle={composition.wrapStyle}
            animated={true}
            stemLength={1.0}
            wrapScale={0.9}
          />
          <p className="text-center text-xs text-muted-foreground font-sans mt-2 italic">
            {style?.emoji} {style?.label} · for {config.recipient.name}
          </p>
        </div>

        {/* Config summary */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
          {[
            { label: "For",      value: config.recipient.name },
            { label: "Occasion", value: `${occ?.emoji} ${occ?.label}` },
            { label: "Mood",     value: m?.label ?? "" },
            { label: "Style",    value: `${style?.emoji} ${style?.label}` },
            { label: "Mode",     value: config.mode === "pro" ? "🎨 Pro Florist" : "✨ Guided" },
            ...(config.recipient.relationship
              ? [{ label: "Relationship", value: config.recipient.relationship }]
              : []),
          ].map((row, i, arr) => (
            <div key={row.label}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                  {row.label}
                </span>
                <span className="font-sans font-medium text-sm text-foreground">
                  {row.value}
                </span>
              </div>
              {i < arr.length - 1 && <div className="h-px bg-border mt-3" />}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground font-sans mt-4">
          {config.mode === "pro"
            ? "You'll arrange everything by hand in the studio 🎨"
            : "You can tweak and reshufle after it's generated ✨"}
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
