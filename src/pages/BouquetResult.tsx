import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { composeBouquet, wrapStyles, type WrapStyle } from "@/lib/bouquet-engine";
import BouquetCanvas from "@/components/flowers/BouquetCanvas";
import { occasions, moods, artStyles, type BouquetConfig, type Occasion, type Mood, type ArtStyle } from "@/lib/bouquet-data";

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

  const [occasion, setOccasion] = useState<Occasion>(initialConfig?.occasion ?? "birthday");
  const [mood, setMood] = useState<Mood>(initialConfig?.mood ?? "just-because");
  const [city, setCity] = useState<string>(initialConfig?.recipient.city ?? "");
  const [wrapStyle, setWrapStyle] = useState<WrapStyle>(customWrapStyle ?? "paper");
  const [variant, setVariant] = useState<number>(0);
  const [variantCount, setVariantCount] = useState<number>(8);
  const [flowerDensity, setFlowerDensity] = useState<number>(1);
  const [greeneryDensity, setGreeneryDensity] = useState<number>(1);
  const [stemLength, setStemLength] = useState<number>(customStemLength ?? 1.0);
  const [wrapScale, setWrapScale] = useState<number>(1.0);
  const [hideStems, setHideStems] = useState<boolean>(false);
  const [showStyleComparison, setShowStyleComparison] = useState<boolean>(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");

  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<number>(2000);

  useEffect(() => {
    if (!autoPlay || isPro) return;
    const id = window.setInterval(() => {
      setVariant((v) => (v + 1) % variantCount);
    }, autoPlaySpeed);
    return () => window.clearInterval(id);
  }, [autoPlay, autoPlaySpeed, variantCount, customFlowers]);

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

  const composition = useMemo(() => {
    if (isPro) {
      const wrap = wrapStyles[wrapStyle];
      return { flowers: customFlowers!, wrapColor: wrap.color, wrapAccent: wrap.accent, backgroundColor: "#F8F5F0", wrapStyle };
    }
    const c = composeBouquet(occasion, mood, config.artStyle, config.recipient.name,
      config.recipient.favouriteColour, city, { variant, flowerDensity, greeneryDensity });
    const wrap = wrapStyles[wrapStyle];
    return { ...c, wrapStyle, wrapColor: wrap.color, wrapAccent: wrap.accent };
  }, [isPro, customFlowers, occasion, mood, city, config.artStyle, config.recipient.name,
    config.recipient.favouriteColour, variant, flowerDensity, greeneryDensity, wrapStyle]);

  // All 4 style compositions (same layout, different style palettes)
  const allStyleCompositions = useMemo(() => {
    if (!showStyleComparison) return null;
    return (["flat", "botanical", "pixel", "watercolour"] as ArtStyle[]).map((style) => ({
      style,
      comp: composeBouquet(occasion, mood, style, config.recipient.name,
        config.recipient.favouriteColour, city, { variant, flowerDensity, greeneryDensity }),
    }));
  }, [showStyleComparison, occasion, mood, config.recipient.name,
    config.recipient.favouriteColour, city, variant, flowerDensity, greeneryDensity]);

  const variantThumbs = useMemo(() => {
    if (isPro) return [];
    return Array.from({ length: variantCount }, (_, v) => ({
      v,
      comp: composeBouquet(occasion, mood, config.artStyle, config.recipient.name,
        config.recipient.favouriteColour, city, { variant: v, flowerDensity, greeneryDensity }),
    }));
  }, [isPro, occasion, mood, city, config.artStyle, config.recipient.name,
    config.recipient.favouriteColour, flowerDensity, greeneryDensity, variantCount]);

  const styleLabels: Record<ArtStyle, string> = {
    flat: "Flat Illustration",
    botanical: "Botanical Print",
    pixel: "Pixel Art",
    watercolour: "Watercolour",
  };

  // Share — encode bouquet config into URL params so the link is self-contained.
  const handleShare = useCallback(async () => {
    const params = new URLSearchParams({
      name:    config.recipient.name,
      occ:     occasion,
      mood,
      style:   config.artStyle,
      variant: String(variant),
      wrap:    wrapStyle,
      ...(city                             && { city }),
      ...(config.recipient.relationship    && { rel: config.recipient.relationship }),
      ...(config.recipient.favouriteColour && { colour: config.recipient.favouriteColour }),
    });
    const url = `${window.location.origin}/bouquet?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2500);
    } catch {
      if (navigator.share) {
        await navigator.share({ title: `A bouquet for ${config.recipient.name}`, url });
      } else {
        setShareStatus("error");
        setTimeout(() => setShareStatus("idle"), 2500);
      }
    }
  }, [config, occasion, mood, variant, wrapStyle, city]);

  const shareLabel =
    shareStatus === "copied" ? "✓ Link copied!" :
    shareStatus === "error"  ? "Copy failed" :
    "Share 💌";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <nav className="sticky top-0 z-20 backdrop-blur-md bg-background/70 border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
          <button onClick={() => navigate("/create")}
            className="group flex items-center gap-1.5 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>New bouquet</span>
          </button>
          <h1 className="text-base font-serif italic text-foreground/80 tracking-wide">Bloom Studio</h1>
          <button
            onClick={handleShare}
            className={`px-4 py-1.5 text-xs font-sans rounded-full transition-all ${
              shareStatus === "copied"
                ? "bg-green-600 text-white"
                : shareStatus === "error"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {shareLabel}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-8">
        <header className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/40 border border-border/50 mb-4">
            <span className="text-xs font-sans text-secondary-foreground tracking-wider uppercase">A bouquet for</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-foreground tracking-tight">
            <span className="text-gradient-rose">{config.recipient.name}</span>
          </h2>
          {config.recipient.relationship && (
            <p className="text-sm font-sans text-muted-foreground mt-2 italic">Your {config.recipient.relationship}</p>
          )}
        </header>

        {/* ── Style comparison toggle button ── */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowStyleComparison((s) => !s)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-sans font-medium border transition-all ${
              showStyleComparison
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card border-border text-foreground hover:border-primary/40"
            }`}
          >
            <span>🎨</span>
            <span>{showStyleComparison ? "Hide style comparison" : "Compare all styles"}</span>
          </button>
        </div>

        {/* ── Style comparison 2×2 grid ── */}
        {showStyleComparison && allStyleCompositions && (
          <div className="mb-10 p-5 rounded-3xl bg-[#FAF7F4] border border-border/60 shadow-lg">
            <h3 className="text-center text-sm font-sans font-semibold text-foreground mb-4">
              Layout {variant + 1} — all four styles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {allStyleCompositions.map(({ style, comp }) => (
                <div key={style} className="text-center">
                  <div className="rounded-2xl bg-white/60 border border-border/40 p-2">
                    <BouquetCanvas
                      flowers={comp.flowers}
                      wrapColor={comp.wrapColor} wrapAccent={comp.wrapAccent}
                      artStyle={style} animated={false}
                      wrapStyle={comp.wrapStyle}
                      stemLength={0} hideStems={false} wrapScale={wrapScale}
                    />
                  </div>
                  <p className="text-[11px] font-sans text-muted-foreground mt-1.5">{styleLabels[style]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Main canvas */}
          <div className="animate-fade-up-delay-1 lg:sticky lg:top-20">
            <div className="relative rounded-3xl bg-[#FAF7F4] border border-border/60 shadow-xl shadow-primary/5 p-4 sm:p-6 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              <BouquetCanvas
                flowers={composition.flowers}
                wrapColor={composition.wrapColor} wrapAccent={composition.wrapAccent}
                artStyle={config.artStyle}
                animated={true}
                wrapStyle={composition.wrapStyle}
                stemLength={stemLength} hideStems={hideStems} wrapScale={wrapScale}
              />
              {!isPro && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-sans text-muted-foreground">
                  <span>Layout {variant + 1} of {variantCount}</span>
                  {autoPlay && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Auto-playing
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4 animate-fade-up-delay-2">
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
                      <button onClick={() => setVariant(Math.floor(Math.random() * variantCount))}
                        className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        🎲 Shuffle
                      </button>
                      <button onClick={() => setVariantCount((c) => Math.min(c + 4, 24))}
                        className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-muted hover:bg-muted/70 transition-colors">
                        + More
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/30 border border-border/50">
                    <button onClick={() => setAutoPlay((p) => !p)}
                      className={`flex items-center gap-1.5 text-[11px] font-sans font-medium px-3 py-1.5 rounded-full transition-all ${
                        autoPlay ? "bg-primary text-primary-foreground shadow-sm" : "bg-background border border-border hover:border-primary/40"
                      }`}>
                      {autoPlay ? "⏸ Pause" : "▶ Auto-play"}
                    </button>
                    <label className="flex-1 flex items-center gap-2">
                      <span className="text-[10px] font-sans text-muted-foreground whitespace-nowrap">
                        {(autoPlaySpeed / 1000).toFixed(1)}s
                      </span>
                      <input type="range" min="500" max="5000" step="250" value={autoPlaySpeed}
                        onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                        className="flex-1 h-1.5 accent-primary" />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {variantThumbs.map(({ v, comp }) => (
                      <button key={v} onClick={() => setVariant(v)}
                        className={`rounded-xl overflow-hidden border-2 transition-all ${
                          variant === v ? "border-primary shadow-md scale-[1.02]" : "border-border hover:border-muted-foreground/40"
                        }`}>
                        <div className="aspect-square bg-[#FAF7F4]">
                          <BouquetCanvas
                            flowers={comp.flowers}
                            wrapColor={comp.wrapColor} wrapAccent={comp.wrapAccent}
                            artStyle={config.artStyle} animated={false}
                            wrapStyle={comp.wrapStyle}
                            stemLength={0} hideStems={false} wrapScale={wrapScale}
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
                      <input type="range" min="50" max="150" value={Math.round(flowerDensity * 100)}
                        onChange={(e) => setFlowerDensity(Number(e.target.value) / 100)}
                        className="w-full h-1.5 accent-primary" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-sans text-muted-foreground flex justify-between mb-1">
                        <span>Greenery & filler</span><span>{Math.round(greeneryDensity * 100)}%</span>
                      </span>
                      <input type="range" min="50" max="150" value={Math.round(greeneryDensity * 100)}
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
        </div>

        <div className="mt-12 text-center animate-fade-up-delay-2">
          <p className="text-sm text-muted-foreground font-sans italic mb-6">Crafted with care · Free forever 🌸</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate("/create")}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-sans font-medium text-sm hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
              Create another
            </button>
            <button className="px-8 py-3 bg-card border border-border text-foreground rounded-full font-sans font-medium text-sm hover:bg-secondary/50 transition-colors">
              Save to favourites ♥
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BouquetResult;
