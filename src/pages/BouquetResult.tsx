import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { composeBouquet, wrapStyles, type WrapStyle } from "@/lib/bouquet-engine";
import BouquetCanvas from "@/components/flowers/BouquetCanvas";
import { occasions, moods, type BouquetConfig, type Occasion, type Mood } from "@/lib/bouquet-data";

interface LocationState {
  config: BouquetConfig;
  customFlowers?: Parameters<typeof BouquetCanvas>[0]["flowers"];
  wrapStyle?: WrapStyle;
  stemLength?: number;
}

const BouquetResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  const initialConfig = state?.config;
  const customFlowers = state?.customFlowers;
  const customWrapStyle = state?.wrapStyle;
  const customStemLength = state?.stemLength;

  // Live editable controls (only used in guided mode — pro mode uses customFlowers).
  const [occasion, setOccasion] = useState<Occasion>(initialConfig?.occasion ?? "birthday");
  const [mood, setMood] = useState<Mood>(initialConfig?.mood ?? "just-because");
  const [city, setCity] = useState<string>(initialConfig?.recipient.city ?? "");
  const [wrapStyle, setWrapStyle] = useState<WrapStyle>(customWrapStyle ?? "paper");
  const [variant, setVariant] = useState<number>(0);
  const [variantCount, setVariantCount] = useState<number>(8);
  const [flowerDensity, setFlowerDensity] = useState<number>(1);
  const [greeneryDensity, setGreeneryDensity] = useState<number>(1);
  const [stemLength, setStemLength] = useState<number>(customStemLength ?? 1);
  const [hideStems, setHideStems] = useState<boolean>(false);
  const [wrapScale, setWrapScale] = useState<number>(1);

  if (!initialConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-sans mb-4">No bouquet found.</p>
          <button onClick={() => navigate("/create")}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-sans text-sm hover:opacity-90 transition-opacity">
            Create one
          </button>
        </div>
      </div>
    );
  }
  const config = initialConfig;

  const isPro = !!customFlowers;

  // Recompute composition live whenever any guided control changes.
  const composition = useMemo(() => {
    if (isPro) {
      const wrap = wrapStyles[wrapStyle];
      return {
        flowers: customFlowers!,
        wrapColor: wrap.color,
        wrapAccent: wrap.accent,
        backgroundColor: "#F8F5F0",
        wrapStyle,
      };
    }
    const c = composeBouquet(occasion, mood, config.artStyle, config.recipient.name, config.recipient.favouriteColour, city, {
      variant, flowerDensity, greeneryDensity,
    });
    // Allow user override of wrap style after composition.
    const wrap = wrapStyles[wrapStyle];
    return { ...c, wrapStyle, wrapColor: wrap.color, wrapAccent: wrap.accent };
  }, [isPro, customFlowers, occasion, mood, city, config.artStyle, config.recipient.name, config.recipient.favouriteColour, variant, flowerDensity, greeneryDensity, wrapStyle]);

  // Pre-compute layout variants for the picker (guided mode only).
  const variantThumbs = useMemo(() => {
    if (isPro) return [];
    return Array.from({ length: variantCount }, (_, v) => ({
      v,
      comp: composeBouquet(occasion, mood, config.artStyle, config.recipient.name, config.recipient.favouriteColour, city, {
        variant: v, flowerDensity, greeneryDensity,
      }),
    }));
  }, [isPro, occasion, mood, city, config.artStyle, config.recipient.name, config.recipient.favouriteColour, flowerDensity, greeneryDensity, variantCount]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
        <button onClick={() => navigate("/create")}
          className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
          ← New bouquet
        </button>
        <h1 className="text-xl font-serif font-semibold text-foreground">Bouquet</h1>
        <div className="w-12" />
      </nav>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        <div className="text-center mb-8 animate-fade-up">
          <p className="text-sm font-sans text-muted-foreground tracking-wide mb-2">A bouquet for</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground">
            {config.recipient.name}
          </h2>
          {config.recipient.relationship && (
            <p className="text-sm font-sans text-muted-foreground mt-1 italic">
              Your {config.recipient.relationship}
            </p>
          )}
        </div>

        <div className="animate-fade-up-delay-1">
          <BouquetCanvas
            flowers={composition.flowers}
            wrapColor={composition.wrapColor}
            wrapAccent={composition.wrapAccent}
            artStyle={config.artStyle}
            animated={true}
            wrapStyle={composition.wrapStyle}
            stemLength={stemLength}
            hideStems={hideStems}
            wrapScale={wrapScale}
          />
        </div>

        {/* Live controls */}
        <div className="mt-8 space-y-4 animate-fade-up-delay-2">
          {!isPro && (
            <>
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <h3 className="text-xs font-sans font-semibold text-foreground">🎯 Tweak your bouquet</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <label className="block">
                    <span className="text-[10px] font-sans text-muted-foreground block mb-1">Occasion</span>
                    <select value={occasion} onChange={(e) => setOccasion(e.target.value as Occasion)}
                      className="w-full text-xs font-sans px-2 py-1.5 rounded-md bg-background border border-border">
                      {occasions.map((o) => <option key={o.id} value={o.id}>{o.emoji} {o.label}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-sans text-muted-foreground block mb-1">Mood</span>
                    <select value={mood} onChange={(e) => setMood(e.target.value as Mood)}
                      className="w-full text-xs font-sans px-2 py-1.5 rounded-md bg-background border border-border">
                      {moods.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-sans text-muted-foreground block mb-1">City</span>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Tokyo"
                      className="w-full text-xs font-sans px-2 py-1.5 rounded-md bg-background border border-border" />
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-sans font-semibold text-foreground">🌸 Pick a layout</h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setVariant(Math.floor(Math.random() * variantCount))}
                      className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      title="Pick a random layout"
                    >
                      🎲 Shuffle
                    </button>
                    <button
                      onClick={() => setVariantCount((c) => Math.min(c + 4, 24))}
                      className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-muted hover:bg-muted/70 transition-colors"
                      title="Generate more variants"
                    >
                      + More
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {variantThumbs.map(({ v, comp }) => (
                    <button key={v} onClick={() => setVariant(v)}
                      className={`rounded-xl overflow-hidden border-2 transition-all ${
                        variant === v ? "border-primary shadow-md scale-[1.02]" : "border-border hover:border-muted-foreground/40"
                      }`}>
                      <div className="aspect-square bg-background">
                        <BouquetCanvas
                          flowers={comp.flowers}
                          wrapColor={comp.wrapColor} wrapAccent={comp.wrapAccent}
                          artStyle={config.artStyle} animated={false}
                          wrapStyle={comp.wrapStyle}
                          stemLength={stemLength} hideStems={hideStems} wrapScale={wrapScale}
                        />
                      </div>
                      <p className="text-[11px] font-sans py-1.5 text-center text-muted-foreground">
                        {variant === v ? "✓ " : ""}Layout {v + 1}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <h3 className="text-xs font-sans font-semibold text-foreground">🌿 Density</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-sans text-muted-foreground flex justify-between mb-1">
                      <span>Flowers</span><span>{Math.round(flowerDensity * 100)}%</span>
                    </span>
                    <input type="range" min="40" max="180" value={Math.round(flowerDensity * 100)}
                      onChange={(e) => setFlowerDensity(Number(e.target.value) / 100)}
                      className="w-full h-1.5 accent-primary" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-sans text-muted-foreground flex justify-between mb-1">
                      <span>Greenery & filler</span><span>{Math.round(greeneryDensity * 100)}%</span>
                    </span>
                    <input type="range" min="40" max="180" value={Math.round(greeneryDensity * 100)}
                      onChange={(e) => setGreeneryDensity(Number(e.target.value) / 100)}
                      className="w-full h-1.5 accent-primary" />
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
            <h3 className="text-xs font-sans font-semibold text-foreground">📦 Wrap & stems</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(wrapStyles).map(([key, ws]) => (
                <button key={key} onClick={() => setWrapStyle(key as WrapStyle)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all ${
                    wrapStyle === key ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/40 hover:bg-muted/70"
                  }`}>
                  <span className="text-sm">{ws.emoji}</span>
                  <span className="text-[10px] font-sans font-medium text-foreground truncate">{ws.label}</span>
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 pt-1">
              <label className="block">
                <span className="text-[10px] font-sans text-muted-foreground flex justify-between mb-1">
                  <span>Wrap size</span><span>{Math.round(wrapScale * 100)}%</span>
                </span>
                <input type="range" min="60" max="140" value={Math.round(wrapScale * 100)}
                  onChange={(e) => setWrapScale(Number(e.target.value) / 100)}
                  className="w-full h-1.5 accent-primary" />
              </label>
              <label className="block">
                <span className="text-[10px] font-sans text-muted-foreground flex justify-between mb-1">
                  <span>Visible stem length</span><span>{hideStems ? "Hidden" : `${Math.round(stemLength * 100)}%`}</span>
                </span>
                <input type="range" min="0" max="150" value={Math.round(stemLength * 100)} disabled={hideStems}
                  onChange={(e) => setStemLength(Number(e.target.value) / 100)}
                  className="w-full h-1.5 accent-primary disabled:opacity-40" />
              </label>
              <label className="flex items-end gap-2 pb-1">
                <input type="checkbox" checked={hideStems} onChange={(e) => setHideStems(e.target.checked)}
                  className="accent-primary" />
                <span className="text-[11px] font-sans text-foreground">Hide stems behind wrap</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center animate-fade-up-delay-2">
          <p className="text-sm text-muted-foreground font-sans italic mb-6">
            Made with love, free forever 🌸
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate("/create")}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-sans font-medium text-sm hover:opacity-90 transition-opacity shadow-md">
              Create another
            </button>
            <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-sans font-medium text-sm hover:opacity-80 transition-opacity">
              Share 💌
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BouquetResult;
