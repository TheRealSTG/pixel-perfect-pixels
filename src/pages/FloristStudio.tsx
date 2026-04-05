import { useState, useCallback } from "react";
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
    setSelectedFlower(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
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

  const handlePointerUp = () => setDragging(null);
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

          {/* Hover tooltip */}
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
              <p className="text-xs font-sans text-muted-foreground/80 italic">💡 {hoveredInfo.careTip}</p>
              <p className="text-[10px] font-sans text-muted-foreground/70 mt-1">🎨 {hoveredInfo.colorTheory}</p>
              <p className="text-[10px] font-sans text-muted-foreground/60 mt-1">✨ {hoveredInfo.funFact}</p>
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
                onClick={() => setSelectedFlower(null)}
              >
                {/* Stems */}
                {sortedFlowers.map((f) => {
                  const stemBottom = f.layer === "back" ? 65 : f.layer === "front" ? 80 : 72;
                  const convergeX = f.x * 0.08;
                  const midY = (f.y + stemBottom) / 2;
                  return (
                    <path key={`stem-${f.id}`}
                      d={`M ${f.x} ${f.y + 12 * f.scale} Q ${f.x * 0.5} ${midY}, ${convergeX} ${stemBottom}`}
                      stroke={f.type === "cherry_blossom" ? "#8B6040" : "#5A8A5A"}
                      strokeWidth={f.layer === "front" ? 1.5 + f.scale * 0.3 : 0.8 + f.scale * 0.2}
                      strokeLinecap="round" fill="none"
                      opacity={f.layer === "back" ? 0.35 : 0.45} />
                  );
                })}

                {/* Wrap */}
                {wrapStyle === "vase" ? (
                  <>
                    <path d="M -18 45 Q -22 65, -20 95 Q -18 102, 0 104 Q 18 102, 20 95 Q 22 65, 18 45 Z"
                      fill={wrap.color} stroke={wrap.accent} strokeWidth={1} opacity={0.6} />
                    <path d="M -19 70 Q 0 68, 19 70 L 20 95 Q 18 102, 0 104 Q -18 102, -20 95 Z"
                      fill="#C8E0E8" opacity={0.25} />
                    <path d="M -14 50 Q -15 65, -14 90" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.3} fill="none" strokeLinecap="round" />
                    <ellipse cx="0" cy="45" rx="18" ry="4" fill={wrap.color} stroke={wrap.accent} strokeWidth={0.8} opacity={0.7} />
                  </>
                ) : wrapStyle === "kraft" ? (
                  <>
                    <path d="M -35 50 Q -44 72, -24 105 L 24 105 Q 44 72, 35 50 Z"
                      fill={wrap.color} stroke={wrap.accent} strokeWidth={1.5} opacity={0.95} />
                    <circle cx="0" cy="49" r="2" fill={wrap.accent} opacity={0.6} />
                  </>
                ) : wrapStyle === "burlap" ? (
                  <>
                    <path d="M -33 52 Q -40 72, -20 102 L 20 102 Q 40 72, 33 52 Z"
                      fill={wrap.color} stroke={wrap.accent} strokeWidth={1.8} opacity={0.9} />
                    <ellipse cx="0" cy="52" rx="12" ry="3" fill="none" stroke={wrap.accent} strokeWidth={1} opacity={0.6} />
                  </>
                ) : wrapStyle === "tissue" ? (
                  <>
                    <path d="M -38 48 Q -42 36, -30 32 Q -35 44, -28 50" fill={wrap.color} opacity={0.5} />
                    <path d="M 38 48 Q 42 36, 30 32 Q 35 44, 28 50" fill={wrap.color} opacity={0.5} />
                    <path d="M -34 50 Q -42 72, -22 105 L 22 105 Q 42 72, 34 50 Z"
                      fill={wrap.color} stroke={wrap.accent} strokeWidth={0.8} opacity={0.85} />
                    <rect x="-16" y="48" width="32" height="4" rx="2" fill={wrap.accent} opacity={0.7} />
                  </>
                ) : (
                  <>
                    <path d="M -32 55 Q -40 75, -22 100 L 22 100 Q 40 75, 32 55 Z"
                      fill={wrap.color} stroke={wrap.accent} strokeWidth={1.2} opacity={0.92} />
                    <ellipse cx="0" cy="54" rx="14" ry="5" fill={wrap.accent} opacity={0.75} />
                  </>
                )}

                {/* Flowers by layer */}
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
                      <circle cx={f.x} cy={f.y} r={15 * f.scale} fill="transparent"
                        stroke={isSelected ? "#3B82F6" : "none"} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Controls for selected flower */}
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
