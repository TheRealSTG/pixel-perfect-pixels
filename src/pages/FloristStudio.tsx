import { useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { flowerComponents, type FlowerType } from "@/components/flowers/FlowerSVGs";
import { flowerMetadata, colorTheoryTips, bouquetDesignTips } from "@/lib/flower-metadata";
import { wrapStyles, type WrapStyle, type BouquetLayer } from "@/lib/bouquet-engine";
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
  const didDrag = useRef(false);

  const addFlower = useCallback((type: FlowerType, color: string, accent: string) => {
    const id = `flower-${++idCounter}`;
    const isGreenery = greeneryTypes.includes(type);
    setFlowers((prev) => [
      ...prev,
      {
        id, type,
        x: (Math.random() - 0.5) * 80,
        y: isGreenery ? -20 + (Math.random() - 0.5) * 40 : -50 + (Math.random() - 0.5) * 50,
        scale: 0.9 + Math.random() * 0.7,
        rotation: (Math.random() - 0.5) * 35,
        color, accentColor: accent,
        layer: isGreenery ? "back" : "front",
      },
    ]);
  }, []);

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

  const renderStudioWrap = () => {
    switch (wrapStyle) {
      case "kraft":
        return (
          <>
            <path d="M -38 48 Q -48 75, -26 108 L 26 108 Q 48 75, 38 48 Z"
              fill={wrap.color} stroke={wrap.accent} strokeWidth={1.8} opacity={0.95} />
            {/* Kraft texture - horizontal creases */}
            <path d="M -30 60 Q 0 58, 30 60" stroke={wrap.accent} strokeWidth={0.5} fill="none" opacity={0.2} />
            <path d="M -28 72 Q 0 70, 28 72" stroke={wrap.accent} strokeWidth={0.4} fill="none" opacity={0.15} />
            <path d="M -24 84 Q 0 82, 24 84" stroke={wrap.accent} strokeWidth={0.4} fill="none" opacity={0.15} />
            <path d="M -20 96 Q 0 94, 20 96" stroke={wrap.accent} strokeWidth={0.3} fill="none" opacity={0.1} />
            {/* Twine bow */}
            <path d="M -12 48 Q -20 38, -8 34 Q 0 42, -12 48" stroke="#8B7355" strokeWidth={1} fill="none" opacity={0.6} />
            <path d="M 12 48 Q 20 38, 8 34 Q 0 42, 12 48" stroke="#8B7355" strokeWidth={1} fill="none" opacity={0.6} />
            <circle cx="0" cy="47" r="2.5" fill="#8B7355" opacity={0.7} />
            {/* Twine tails */}
            <path d="M 0 49 Q -4 58, -6 65" stroke="#8B7355" strokeWidth={0.8} fill="none" opacity={0.4} />
            <path d="M 0 49 Q 3 56, 5 62" stroke="#8B7355" strokeWidth={0.8} fill="none" opacity={0.4} />
          </>
        );
      case "tissue":
        return (
          <>
            {/* Ruffled edges sticking up */}
            <path d="M -40 46 Q -44 32, -32 28 Q -38 38, -30 46 Q -36 38, -40 46" fill={wrap.color} opacity={0.45} />
            <path d="M -28 44 Q -30 30, -22 26 Q -26 36, -20 44 Q -24 36, -28 44" fill={wrap.color} opacity={0.4} />
            <path d="M 40 46 Q 44 32, 32 28 Q 38 38, 30 46 Q 36 38, 40 46" fill={wrap.color} opacity={0.45} />
            <path d="M 28 44 Q 30 30, 22 26 Q 26 36, 20 44 Q 24 36, 28 44" fill={wrap.color} opacity={0.4} />
            {/* Main body */}
            <path d="M -36 48 Q -44 74, -24 108 L 24 108 Q 44 74, 36 48 Z"
              fill={wrap.color} stroke={wrap.accent} strokeWidth={0.6} opacity={0.8} />
            {/* Subtle vertical crinkle lines */}
            <path d="M -18 52 Q -20 74, -14 100" stroke={wrap.accent} strokeWidth={0.25} fill="none" opacity={0.2} />
            <path d="M 18 52 Q 20 74, 14 100" stroke={wrap.accent} strokeWidth={0.25} fill="none" opacity={0.2} />
            <path d="M 0 50 Q -1 72, 0 100" stroke={wrap.accent} strokeWidth={0.2} fill="none" opacity={0.15} />
            {/* Satin ribbon with bow */}
            <rect x="-20" y="46" width="40" height="5" rx="2.5" fill={wrap.accent} opacity={0.6} />
            <path d="M -10 48 Q -18 38, -7 34 Q 0 42, -10 48" fill={wrap.accent} opacity={0.5} />
            <path d="M 10 48 Q 18 38, 7 34 Q 0 42, 10 48" fill={wrap.accent} opacity={0.5} />
            <ellipse cx="0" cy="48" rx="3" ry="2.5" fill={wrap.accent} opacity={0.7} />
          </>
        );
      case "burlap":
        return (
          <>
            <path d="M -34 50 Q -42 74, -22 105 L 22 105 Q 42 74, 34 50 Z"
              fill={wrap.color} stroke={wrap.accent} strokeWidth={2} opacity={0.92} />
            {/* Woven texture - horizontal */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h-${i}`} x1="-30" y1={54 + i * 6} x2="30" y2={54 + i * 6}
                stroke={wrap.accent} strokeWidth={0.4} opacity={0.2} />
            ))}
            {/* Woven texture - vertical */}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`v-${i}`} x1={-22 + i * 7} y1="52" x2={-20 + i * 7} y2="103"
                stroke={wrap.accent} strokeWidth={0.35} opacity={0.15} />
            ))}
            {/* Cross-hatch for burlap feel */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`d-${i}`} x1={-18 + i * 9} y1="54" x2={-14 + i * 9} y2="100"
                stroke={wrap.accent} strokeWidth={0.2} opacity={0.1} />
            ))}
            {/* Rough twine tie */}
            <path d="M -14 50 Q -14 46, 0 45 Q 14 46, 14 50" stroke="#7A6A50" strokeWidth={1.5} fill="none" opacity={0.5} />
            <circle cx="0" cy="49" r="2" fill="#7A6A50" opacity={0.5} />
          </>
        );
      case "vase":
        return (
          <>
            {/* Glass vase body */}
            <path d="M -20 42 Q -24 58, -22 90 Q -20 100, 0 103 Q 20 100, 22 90 Q 24 58, 20 42 Z"
              fill={wrap.color} stroke={wrap.accent} strokeWidth={1} opacity={0.5} />
            {/* Water */}
            <path d="M -21 65 Q 0 62, 21 65 L 22 90 Q 20 100, 0 103 Q -20 100, -22 90 Z"
              fill="#B8D8E8" opacity={0.2} />
            {/* Glass highlights */}
            <path d="M -16 48 Q -17 62, -16 85" stroke="#FFFFFF" strokeWidth={2} opacity={0.25} fill="none" strokeLinecap="round" />
            <path d="M -12 52 Q -13 65, -12 80" stroke="#FFFFFF" strokeWidth={0.8} opacity={0.15} fill="none" strokeLinecap="round" />
            {/* Rim */}
            <ellipse cx="0" cy="42" rx="20" ry="5" fill={wrap.color} stroke={wrap.accent} strokeWidth={0.8} opacity={0.6} />
            {/* Base */}
            <ellipse cx="0" cy="103" rx="10" ry="3" fill={wrap.accent} opacity={0.3} />
          </>
        );
      default: // paper
        return (
          <>
            {/* Paper cone */}
            <path d="M -34 52 Q -42 76, -24 104 L 24 104 Q 42 76, 34 52 Z"
              fill={wrap.color} stroke={wrap.accent} strokeWidth={1.2} opacity={0.92} />
            {/* Paper fold lines */}
            <path d="M -16 58 Q -20 76, -14 98" stroke={wrap.accent} strokeWidth={0.5} fill="none" opacity={0.3} />
            <path d="M 16 58 Q 20 76, 14 98" stroke={wrap.accent} strokeWidth={0.5} fill="none" opacity={0.3} />
            <path d="M 0 54 Q -1 74, 0 98" stroke={wrap.accent} strokeWidth={0.3} fill="none" opacity={0.2} />
            {/* Top fold / cuff */}
            <path d="M -36 52 Q -34 46, -20 44 Q 0 42, 20 44 Q 34 46, 36 52"
              stroke={wrap.accent} strokeWidth={0.8} fill={wrap.color} opacity={0.85} />
            {/* Ribbon bow */}
            <ellipse cx="0" cy="52" rx="14" ry="4.5" fill={wrap.accent} opacity={0.6} />
            <path d="M -7 52 Q -14 44, -5 42 Q 0 48, -7 52" fill={wrap.accent} opacity={0.5} />
            <path d="M 7 52 Q 14 44, 5 42 Q 0 48, 7 52" fill={wrap.accent} opacity={0.5} />
            <circle cx="0" cy="52" r="2" fill={wrap.accent} opacity={0.7} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <button onClick={() => navigate(-1)}
          className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <h1 className="text-xl font-serif font-semibold text-foreground">Pro Florist Studio</h1>
        <button
          onClick={() => {
            if (config && flowers.length > 0) {
              navigate("/bouquet", {
                state: {
                  config,
                  wrapStyle,
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
      </nav>

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
          <div className="bg-card rounded-2xl border border-border flex-1 min-h-[400px] flex items-center justify-center relative overflow-hidden">
            {flowers.length === 0 ? (
              <p className="text-muted-foreground font-sans text-sm">Tap a flower to start 🌸</p>
            ) : (
              <svg
                viewBox="-120 -160 240 300"
                className="w-full h-full max-h-[60vh]"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ touchAction: "none" }}
                onClick={(e) => {
                  // Only deselect if clicking the SVG background itself
                  if (e.target === e.currentTarget) setSelectedFlower(null);
                }}
              >
                {/* Wrap (rendered behind flowers) */}
                {renderStudioWrap()}

                {/* Flowers by layer — NO stems binding to center */}
                {sortedFlowers.map((f) => {
                  const FlowerComp = flowerComponents[f.type];
                  const isSelected = f.id === selectedFlower;
                  return (
                    <g key={f.id}
                      onPointerDown={(e) => handlePointerDown(e, f.id)}
                      onDoubleClick={() => removeFlower(f.id)}
                      style={{ cursor: dragging === f.id ? "grabbing" : "grab" }}>
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
