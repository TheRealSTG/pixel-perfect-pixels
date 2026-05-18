import { useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { flowerComponents, type FlowerType } from "@/components/flowers/FlowerSVGs";
import { flowerMetadata, colorTheoryTips, bouquetDesignTips } from "@/lib/flower-metadata";
import { wrapStyles, type WrapStyle, type BouquetLayer } from "@/lib/bouquet-engine";
import WrapRenderer from "@/components/flowers/WrapRenderer";
import BouquetCanvas from "@/components/flowers/BouquetCanvas";
import type { BouquetConfig, ArtStyle } from "@/lib/bouquet-data";

interface PlacedFlower {
  id: string;
  type: FlowerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  accentColor: string;
  layer: BouquetLayer;
}

const allFlowers = Object.values(flowerMetadata);
const greeneryTypes: FlowerType[] = ["eucalyptus", "fern", "babys_breath"];

let idCounter = 0;

const FloristStudio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config as BouquetConfig | undefined;
  const artStyle: ArtStyle = config?.artStyle || "flat";

  const [flowers, setFlowers] = useState<PlacedFlower[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredFlower, setHoveredFlower] = useState<FlowerType | null>(null);
  const [showTips, setShowTips] = useState(true);
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
  const [wrapStyle, setWrapStyle] = useState<WrapStyle>("paper");
  const [stemLength, setStemLength] = useState<number>(1);
  const [hideStems, setHideStems] = useState<boolean>(false);
  const [wrapScale, setWrapScale] = useState<number>(1);
  const [showParity, setShowParity] = useState(false);
  const didDrag = useRef(false);

  const addFlower = useCallback((type: FlowerType, color: string, accent: string) => {
    const id = `flower-${++idCounter}`;
    const isGreenery = greeneryTypes.includes(type);
    setFlowers((prev) => {
      // "Spawn near nearest existing bloom":
      // 1. Prefer the currently-selected flower as the anchor (intentional placement).
      // 2. Otherwise, find the centroid of all blooms, then anchor on the existing
      //    flower that is closest to that centroid (the densest spot of the bouquet).
      // 3. If the canvas is empty, use a sensible default for the layer.
      let baseX = 0;
      let baseY = isGreenery ? -25 : -45;
      if (prev.length > 0) {
        let anchor = selectedFlower ? prev.find((p) => p.id === selectedFlower) : undefined;
        if (!anchor) {
          const blooms = prev.filter((p) => !greeneryTypes.includes(p.type));
          const pool = blooms.length > 0 ? blooms : prev;
          const cx = pool.reduce((s, p) => s + p.x, 0) / pool.length;
          const cy = pool.reduce((s, p) => s + p.y, 0) / pool.length;
          anchor = pool.reduce((best, p) => {
            const d = (p.x - cx) ** 2 + (p.y - cy) ** 2;
            const bd = (best.x - cx) ** 2 + (best.y - cy) ** 2;
            return d < bd ? p : best;
          }, pool[0]);
        }
        baseX = anchor.x;
        baseY = anchor.y;
      }
      const x = baseX + (Math.random() - 0.5) * 16;
      const y = baseY + (Math.random() - 0.5) * 10;
      return [
        ...prev,
        {
          id, type,
          x: Math.max(-58, Math.min(58, x)),
          y: Math.max(-82, Math.min(-8, y)),
          scale: 0.9 + Math.random() * 0.7,
          rotation: (Math.random() - 0.5) * 25,
          color, accentColor: accent,
          layer: isGreenery ? "back" : "front",
        },
      ];
    });
  }, [selectedFlower]);

  const updateFlower = useCallback((id: string, updates: Partial<PlacedFlower>) => {
    setFlowers((prev) => prev.map((f) => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>, id: string) => {
    e.stopPropagation();
    const svg = e.currentTarget.closest("svg") as SVGSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const flower = flowers.find((f) => f.id === id)!;
    setDragOffset({ x: svgPt.x - flower.x, y: svgPt.y - flower.y });
    setDragging(id);
    didDrag.current = false;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    didDrag.current = true;
    const svg = e.currentTarget as SVGSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    setFlowers((prev) =>
      prev.map((f) =>
        f.id === dragging ? { ...f, x: svgPt.x - dragOffset.x, y: svgPt.y - dragOffset.y } : f
      )
    );
  };

  const handlePointerUp = () => {
    if (dragging && !didDrag.current) {
      // It was a tap, not a drag — select/toggle
      setSelectedFlower((prev) => prev === dragging ? null : dragging);
    } else if (dragging) {
      // Was dragging — keep current selection on the dragged flower
      setSelectedFlower(dragging);
    }
    setDragging(null);
  };

  const removeFlower = (id: string) => {
    setFlowers((prev) => prev.filter((f) => f.id !== id));
    if (selectedFlower === id) setSelectedFlower(null);
  };

  const styleVariant = artStyle === "pixel" ? "pixel" : artStyle === "botanical" ? "botanical" : "flat";
  const hoveredInfo = hoveredFlower ? flowerMetadata[hoveredFlower] : null;
  const selected = selectedFlower ? flowers.find((f) => f.id === selectedFlower) : null;
  const wrap = wrapStyles[wrapStyle];

  // Sort for rendering: back → mid → front
  const layerOrder: Record<string, number> = { back: 0, mid: 1, front: 2 };
  const sortedFlowers = [...flowers].sort((a, b) => {
    const la = layerOrder[a.layer] ?? 1;
    const lb = layerOrder[b.layer] ?? 1;
    return la !== lb ? la - lb : a.y - b.y;
  });
  const backFlowers = sortedFlowers.filter((f) => f.layer === "back");
  const midFrontFlowers = sortedFlowers.filter((f) => f.layer !== "back");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <button onClick={() => navigate(-1)}
          className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <h1 className="text-xl font-serif font-semibold text-foreground">Pro Florist Studio</h1>
        <div className="flex items-center gap-3">
        <button
          onClick={() => setShowParity((s) => !s)}
          disabled={flowers.length === 0}
          className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">
          {showParity ? "Hide parity" : "Parity check"}
        </button>
        <button
          onClick={() => {
            if (config && flowers.length > 0) {
              navigate("/bouquet", {
                state: {
                  config,
                  wrapStyle,
                  stemLength,
                  customFlowers: flowers.map((f) => ({
                    type: f.type, x: f.x, y: f.y, scale: f.scale,
                    rotation: f.rotation, color: f.color, accentColor: f.accentColor, delay: 0, layer: f.layer,
                  })),
                },
              });
            }
          }}
          disabled={flowers.length === 0}
          className="text-sm font-sans font-medium text-primary hover:text-accent transition-colors disabled:opacity-40">
          Done →
        </button>
        </div>
      </nav>

      {showParity && flowers.length > 0 && (
        <div className="px-4 max-w-7xl mx-auto w-full mb-3 animate-fade-up">
          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-semibold text-foreground">Studio ↔ Final output parity</span>
              <span className="text-[10px] font-sans text-muted-foreground">
                {wrap.emoji} {wrap.label} · viewBox -100 -100 200 200
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] font-sans text-muted-foreground mb-1 text-center">Studio</p>
                <div className="aspect-square bg-background rounded-xl overflow-hidden border border-border">
                  <BouquetCanvas
                    flowers={flowers.map((f) => ({
                      type: f.type, x: f.x, y: f.y, scale: f.scale, rotation: f.rotation,
                      color: f.color, accentColor: f.accentColor, delay: 0, layer: f.layer,
                    }))}
                    wrapColor={wrap.color} wrapAccent={wrap.accent}
                    artStyle={artStyle} animated={false}
                    wrapStyle={wrapStyle} stemLength={stemLength}
                    hideStems={hideStems} wrapScale={wrapScale}
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-sans text-muted-foreground mb-1 text-center">Final output</p>
                <div className="aspect-square bg-background rounded-xl overflow-hidden border border-border">
                  <BouquetCanvas
                    flowers={flowers.map((f) => ({
                      type: f.type, x: f.x, y: f.y, scale: f.scale, rotation: f.rotation,
                      color: f.color, accentColor: f.accentColor, delay: 0, layer: f.layer,
                    }))}
                    wrapColor={wrap.color} wrapAccent={wrap.accent}
                    artStyle={artStyle} animated={false}
                    wrapStyle={wrapStyle} stemLength={stemLength}
                    hideStems={hideStems} wrapScale={wrapScale}
                  />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-sans text-muted-foreground mb-1 text-center">
                  Diff <span className="opacity-60">(any colour = mismatch)</span>
                </p>
                <div className="aspect-square bg-black rounded-xl overflow-hidden border border-border relative">
                  {/* Stack both renders with mix-blend-difference. Identical pixels = pure black. */}
                  <div className="absolute inset-0">
                    <BouquetCanvas
                      flowers={flowers.map((f) => ({
                        type: f.type, x: f.x, y: f.y, scale: f.scale, rotation: f.rotation,
                        color: f.color, accentColor: f.accentColor, delay: 0, layer: f.layer,
                      }))}
                      wrapColor={wrap.color} wrapAccent={wrap.accent}
                      artStyle={artStyle} animated={false}
                      wrapStyle={wrapStyle} stemLength={stemLength}
                      hideStems={hideStems} wrapScale={wrapScale}
                    />
                  </div>
                  <div className="absolute inset-0 mix-blend-difference">
                    <BouquetCanvas
                      flowers={flowers.map((f) => ({
                        type: f.type, x: f.x, y: f.y, scale: f.scale, rotation: f.rotation,
                        color: f.color, accentColor: f.accentColor, delay: 0, layer: f.layer,
                      }))}
                      wrapColor={wrap.color} wrapAccent={wrap.accent}
                      artStyle={artStyle} animated={false}
                      wrapStyle={wrapStyle} stemLength={stemLength}
                      hideStems={hideStems} wrapScale={wrapScale}
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-sans text-muted-foreground text-center mt-2">
              ✅ Pure black diff = 1:1 parity. Any visible colour means the two renders disagree.
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 px-4 pb-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-4">
        {/* Left sidebar */}
        <div className="lg:w-72 flex-shrink-0 space-y-3 overflow-y-auto max-h-[calc(100vh-100px)]">
          {/* Flower picker */}
          <p className="text-xs font-sans text-muted-foreground font-medium">🌸 Flowers</p>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {allFlowers.filter(f => !greeneryTypes.includes(f.type)).map((f) => (
              <button key={f.type}
                onClick={() => addFlower(f.type, f.defaultColor, f.defaultAccent)}
                onMouseEnter={() => setHoveredFlower(f.type)}
                onMouseLeave={() => setHoveredFlower(null)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-left"
              >
                <span className="text-base">{f.emoji}</span>
                <div className="min-w-0">
                  <span className="text-xs font-sans font-medium text-foreground block">{f.label}</span>
                  <span className="text-[10px] font-sans text-muted-foreground block truncate">{f.birthMonth}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Greenery picker */}
          <p className="text-xs font-sans text-muted-foreground font-medium mt-3">🌿 Greenery & Filler</p>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {allFlowers.filter(f => greeneryTypes.includes(f.type)).map((f) => (
              <button key={f.type}
                onClick={() => addFlower(f.type, f.defaultColor, f.defaultAccent)}
                onMouseEnter={() => setHoveredFlower(f.type)}
                onMouseLeave={() => setHoveredFlower(null)}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-left"
              >
                <span className="text-base">{f.emoji}</span>
                <div className="min-w-0">
                  <span className="text-xs font-sans font-medium text-foreground block">{f.label}</span>
                  <span className="text-[10px] font-sans text-muted-foreground block truncate">{f.meaning.split(".")[0]}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Wrap style selector */}
          <p className="text-xs font-sans text-muted-foreground font-medium mt-3">📦 Wrap Style</p>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            {Object.entries(wrapStyles).map(([key, ws]) => (
              <button key={key}
                onClick={() => setWrapStyle(key as WrapStyle)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-200 text-left ${
                  wrapStyle === key ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/40 hover:bg-muted/70"
                }`}>
                <span className="text-base">{ws.emoji}</span>
                <span className="text-xs font-sans font-medium text-foreground">{ws.label}</span>
              </button>
            ))}
          </div>

          {/* Hover tooltip - consistent text styling */}
          {hoveredInfo && (
            <div className="hidden lg:block p-3 rounded-xl bg-card border border-border animate-fade-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{hoveredInfo.emoji}</span>
                <div>
                  <h3 className="text-sm font-sans font-semibold text-foreground">{hoveredInfo.label}</h3>
                  <p className="text-[10px] font-sans text-muted-foreground">Birth month: {hoveredInfo.birthMonth}</p>
                </div>
              </div>
              <p className="text-xs font-sans text-muted-foreground mb-1.5">{hoveredInfo.meaning}</p>
              <p className="text-xs font-sans text-muted-foreground italic mb-1.5">💡 {hoveredInfo.careTip}</p>
              <p className="text-xs font-sans text-muted-foreground mb-1.5">🎨 {hoveredInfo.colorTheory}</p>
              <p className="text-xs font-sans text-muted-foreground">✨ {hoveredInfo.funFact}</p>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Stem length control */}
          <div className="mb-2 grid grid-cols-1 sm:grid-cols-3 gap-2 px-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-sans text-muted-foreground whitespace-nowrap">🌱 Stem</label>
              <input type="range" min="0" max="150" value={Math.round(stemLength * 100)} disabled={hideStems}
                onChange={(e) => setStemLength(Number(e.target.value) / 100)}
                className="flex-1 h-1.5 accent-primary disabled:opacity-40" />
              <span className="text-[10px] font-sans text-muted-foreground w-8 text-right">{hideStems ? "—" : `${Math.round(stemLength * 100)}%`}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-sans text-muted-foreground whitespace-nowrap">📦 Wrap size</label>
              <input type="range" min="60" max="140" value={Math.round(wrapScale * 100)}
                onChange={(e) => setWrapScale(Number(e.target.value) / 100)}
                className="flex-1 h-1.5 accent-primary" />
              <span className="text-[10px] font-sans text-muted-foreground w-8 text-right">{Math.round(wrapScale * 100)}%</span>
            </div>
            <label className="flex items-center gap-2 text-[11px] font-sans text-foreground">
              <input type="checkbox" checked={hideStems} onChange={(e) => setHideStems(e.target.checked)} className="accent-primary" />
              Hide stems behind wrap
            </label>
          </div>
          <div className="bg-card rounded-2xl border border-border flex-1 min-h-[400px] flex items-center justify-center relative overflow-hidden">
            {/* Active wrap badge — shows shape switching live */}
            <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur border border-border shadow-sm flex items-center gap-1.5 pointer-events-none">
              <span className="text-xs">{wrap.emoji}</span>
              <span className="text-[10px] font-sans font-medium text-foreground">{wrap.label}</span>
            </div>
            {flowers.length === 0 ? (
              <p className="text-muted-foreground font-sans text-sm">Tap a flower to start 🌸</p>
            ) : (
              <svg
                viewBox="-100 -100 200 200"
                className="w-full h-full max-h-[60vh]"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ touchAction: "none" }}
                onClick={(e) => {
                  // Only deselect if clicking the SVG background itself
                  if (e.target === e.currentTarget) setSelectedFlower(null);
                }}
              >
                {/* Back-layer greenery (behind wrap) */}
                {backFlowers.map((f) => {
                  const FlowerComp = flowerComponents[f.type];
                  const isSelected = f.id === selectedFlower;
                  return (
                    <g key={f.id}
                      onPointerDown={(e) => handlePointerDown(e, f.id)}
                      onDoubleClick={() => removeFlower(f.id)}
                      style={{ cursor: dragging === f.id ? "grabbing" : "grab" }}>
                      {/* Generous transparent hit area for easier tap selection */}
                      <circle cx={f.x} cy={f.y} r={Math.max(10, 14 * f.scale)} fill="transparent" pointerEvents="all" />
                      <FlowerComp x={f.x} y={f.y} scale={f.scale} rotation={f.rotation}
                        color={f.color} accentColor={f.accentColor} style={styleVariant} />
                      {isSelected && (
                        <circle cx={f.x} cy={f.y} r={15 * f.scale} fill="transparent"
                          stroke="hsl(var(--primary))" strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
                      )}
                    </g>
                  );
                })}

                {/* Straight vertical stems — uniform endpoint across every wrap
                    style so the stem-length slider maps to the same physical
                    length here as in BouquetCanvas. y=7 sits just above the
                    vase rim so stems never poke through any wrap. */}
                {!hideStems && midFrontFlowers.map((f, i) => {
                  const startY = f.y + 4 * f.scale;
                  const wrapEndY = 7 * wrapScale;
                  const maxLen = Math.max(0, wrapEndY - startY);
                  const len = Math.max(0, maxLen * stemLength);
                  if (len < 0.5) return null;
                  return (
                    <line key={`stem-${f.id}`}
                      x1={f.x} y1={startY} x2={f.x} y2={startY + len}
                      stroke="#5A8A5A" strokeWidth={1 + 0.4 * f.scale}
                      opacity={0.7} strokeLinecap="round" />
                  );
                })}

                {/* Wrap (shared renderer; scaled around top center 0,10) */}
                <g transform={`translate(0 ${10 - 10 * wrapScale}) scale(${wrapScale})`}>
                  <WrapRenderer wrapStyle={wrapStyle} wrapColor={wrap.color} wrapAccent={wrap.accent} />
                </g>

                {/* Mid + front flowers, in front of wrap */}
                {midFrontFlowers.map((f) => {
                  const FlowerComp = flowerComponents[f.type];
                  const isSelected = f.id === selectedFlower;
                  return (
                    <g key={f.id}
                      onPointerDown={(e) => handlePointerDown(e, f.id)}
                      onDoubleClick={() => removeFlower(f.id)}
                      style={{ cursor: dragging === f.id ? "grabbing" : "grab" }}>
                      <circle cx={f.x} cy={f.y} r={Math.max(10, 14 * f.scale)} fill="transparent" pointerEvents="all" />
                      <FlowerComp x={f.x} y={f.y} scale={f.scale} rotation={f.rotation}
                        color={f.color} accentColor={f.accentColor} style={styleVariant} />
                      {isSelected && (
                        <circle cx={f.x} cy={f.y} r={15 * f.scale} fill="transparent"
                          stroke="hsl(var(--primary))" strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Controls for selected flower — persists until deselected */}
          {selected && (
            <div className="mt-3 p-3 rounded-xl bg-card border border-border animate-fade-up">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans font-semibold text-foreground">
                  {flowerMetadata[selected.type]?.emoji} {flowerMetadata[selected.type]?.label || selected.type}
                </span>
                <button onClick={() => removeFlower(selected.id)}
                  className="text-xs text-destructive hover:text-destructive/80 font-sans">Remove</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Rotation */}
                <div>
                  <label className="text-[10px] font-sans text-muted-foreground block mb-1">Rotation</label>
                  <input type="range" min="-180" max="180" value={selected.rotation}
                    onChange={(e) => updateFlower(selected.id, { rotation: Number(e.target.value) })}
                    className="w-full h-1.5 accent-primary" />
                  <span className="text-[10px] font-sans text-muted-foreground">{Math.round(selected.rotation)}°</span>
                </div>
                {/* Scale */}
                <div>
                  <label className="text-[10px] font-sans text-muted-foreground block mb-1">Size</label>
                  <input type="range" min="30" max="250" value={Math.round(selected.scale * 100)}
                    onChange={(e) => updateFlower(selected.id, { scale: Number(e.target.value) / 100 })}
                    className="w-full h-1.5 accent-primary" />
                  <span className="text-[10px] font-sans text-muted-foreground">{Math.round(selected.scale * 100)}%</span>
                </div>
                {/* Layer */}
                <div>
                  <label className="text-[10px] font-sans text-muted-foreground block mb-1">Layer</label>
                  <div className="flex gap-1">
                    {(["back", "mid", "front"] as BouquetLayer[]).map((l) => (
                      <button key={l} onClick={() => updateFlower(selected.id, { layer: l })}
                        className={`text-[10px] px-2 py-1 rounded font-sans transition-colors ${
                          selected.layer === l ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Quick actions */}
                <div>
                  <label className="text-[10px] font-sans text-muted-foreground block mb-1">Quick</label>
                  <div className="flex gap-1">
                    <button onClick={() => updateFlower(selected.id, { rotation: selected.rotation - 15 })}
                      className="text-xs px-2 py-1 rounded bg-muted/50 hover:bg-muted text-muted-foreground font-sans">↶</button>
                    <button onClick={() => updateFlower(selected.id, { rotation: selected.rotation + 15 })}
                      className="text-xs px-2 py-1 rounded bg-muted/50 hover:bg-muted text-muted-foreground font-sans">↷</button>
                    <button onClick={() => updateFlower(selected.id, { rotation: 0 })}
                      className="text-[10px] px-2 py-1 rounded bg-muted/50 hover:bg-muted text-muted-foreground font-sans">0°</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {flowers.length > 0 && !selected && (
            <p className="text-center text-xs text-muted-foreground font-sans mt-2">
              Tap to select · Drag to move · Double-tap to remove
            </p>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:w-60 flex-shrink-0 space-y-3">
          <button onClick={() => setShowTips(!showTips)}
            className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            {showTips ? "▼" : "▶"} Florist Tips
          </button>

          {showTips && (
            <div className="space-y-3 animate-fade-up">
              <div className="p-3 rounded-xl bg-card border border-border">
                <h3 className="text-xs font-sans font-semibold text-foreground mb-2">🎨 Color Theory</h3>
                <div className="space-y-2">
                  {colorTheoryTips.map((tip, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-xs">{tip.icon}</span>
                      <div>
                        <p className="text-[10px] font-sans font-medium text-foreground">{tip.title}</p>
                        <p className="text-[10px] font-sans text-muted-foreground">{tip.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border">
                <h3 className="text-xs font-sans font-semibold text-foreground mb-2">🌿 Arrangement Tips</h3>
                <ul className="space-y-1.5">
                  {bouquetDesignTips.map((tip, i) => (
                    <li key={i} className="text-[10px] font-sans text-muted-foreground flex gap-1.5 items-start">
                      <span className="text-muted-foreground/50 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border">
                <h3 className="text-xs font-sans font-semibold text-foreground mb-2">✨ Flower Facts</h3>
                <div className="space-y-1.5">
                  {allFlowers.slice(0, 6).map((f) => (
                    <p key={f.type} className="text-[10px] font-sans text-muted-foreground">
                      <span className="font-medium text-foreground">{f.emoji} {f.label}:</span> {f.funFact}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloristStudio;
