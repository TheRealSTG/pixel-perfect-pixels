import type { BouquetConfig } from "@/lib/bouquet-data";
import { occasions, moods, artStyles } from "@/lib/bouquet-data";
import heroBouquet from "@/assets/hero-bouquet.png";

interface Props {
  config: BouquetConfig;
}

const ReviewStep = ({ config }: Props) => {
  const occ = occasions.find((o) => o.id === config.occasion);
  const m = moods.find((m) => m.id === config.mood);
  const style = artStyles.find((s) => s.id === config.artStyle);

  return (
    <div>
      <h2 className="text-3xl font-serif font-semibold text-foreground text-center mb-2">
        Ready to bloom
      </h2>
      <p className="text-sm text-muted-foreground font-sans text-center mb-10">
        Here's what we'll create for {config.recipient.name}.
      </p>

      {/* Preview */}
      <div className="max-w-sm mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex justify-center mb-6">
            <img
              src={heroBouquet}
              alt={`A bouquet for ${config.recipient.name}`}
              className="w-48 h-auto animate-gentle-float"
              loading="lazy"
              width={800}
              height={1024}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                For
              </span>
              <span className="font-sans font-medium text-sm text-foreground">
                {config.recipient.name}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                Occasion
              </span>
              <span className="font-sans font-medium text-sm text-foreground">
                {occ?.emoji} {occ?.label}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                Mood
              </span>
              <span className="font-sans font-medium text-sm text-foreground">{m?.label}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                Style
              </span>
              <span className="font-sans font-medium text-sm text-foreground">
                {style?.emoji} {style?.label}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                Mode
              </span>
              <span className="font-sans font-medium text-sm text-foreground">
                {config.mode === "pro" ? "🎨 Pro Florist" : "✨ Guided"}
              </span>
            </div>
            {config.recipient.relationship && (
              <>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                    Relationship
                  </span>
                  <span className="font-sans font-medium text-sm text-foreground">
                    {config.recipient.relationship}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground font-sans">
          {config.mode === "pro"
            ? "You'll arrange everything by hand in the studio 🎨"
            : "We'll compose something beautiful for you ✨"}
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
