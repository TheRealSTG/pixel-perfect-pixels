import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { flowerComponents, type FlowerType } from "@/components/flowers/FlowerSVGs";
import { flowerMetadata, colorTheoryTips, bouquetDesignTips } from "@/lib/flower-metadata";
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
}

const allFlowers = Object.values(flowerMetadata);

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

  const addFlower = useCallback((type: FlowerType, color: string, accent: string) => {
    const id = `flower-${++idCounter}`;
    setFlowers((prev) => [
      ...prev,
      {
        id,
        type,
        x: (Math.random() - 0.5) * 80,
        y: -40 + (Math.random() - 0.5) * 60,
        scale: 0.9 + Math.random() * 0.7,
        rotation: (Math.random() - 0.5) * 35,
        color,
        accentColor: accent,
      },
    ]);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>, id: string) => {
    e.stopPropagation();
    const svg = e.currentTarget.closest("svg") as SVGSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const flower = flowers.find((f) => f.id === id)!;
    setDragOffset({ x: svgPt.x - flower.x, y: svgPt.y - flower.y });
    setDragging(id);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const svg = e.currentTarget as SVGSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    setFlowers((prev) =>
      prev.map((f) =>
        f.id === dragging ? { ...f, x: svgPt.x - dragOffset.x, y: svgPt.y - dragOffset.y } : f
      )
    );
  };

  const handlePointerUp = () => setDragging(null);
  const removeFlower = (id: string) => setFlowers((prev) => prev.filter((f) => f.id !== id));

  const styleVariant = artStyle === "pixel" ? "pixel" : artStyle === "botanical" ? "botanical" : "flat";
  const hoveredInfo = hoveredFlower ? flowerMetadata[hoveredFlower] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
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
                  customFlowers: flowers.map((f) => ({
                    type: f.type, x: f.x, y: f.y, scale: f.scale,
                    rotation: f.rotation, color: f.color, accentColor: f.accentColor, delay: 0,
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

      <div className="flex-1 px-4 pb-6 max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-4">
        {/* Left sidebar — flower picker + info */}
        <div className="lg:w-72 flex-shrink-0 space-y-3">
          <p className="text-xs font-sans text-muted-foreground">Tap to add · Hover for info</p>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {allFlowers.map((f) => (
              <div key={f.type} className="relative">
                <button
                  onClick={() => addFlower(f.type, f.defaultColor, f.defaultAccent)}
                  onMouseEnter={() => setHoveredFlower(f.type)}
                  onMouseLeave={() => setHoveredFlower(null)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-left"
                >
                  <span className="text-lg">{f.emoji}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-sans font-medium text-foreground block">{f.label}</span>
                    <span className="text-[10px] font-sans text-muted-foreground block truncate">{f.birthMonth} · {f.meaning.split(".")[0]}</span>
                  </div>
                </button>
              </div>
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
              >
                {/* Wrapping paper */}
                <path d="M -32 55 Q -40 75, -22 100 L 22 100 Q 40 75, 32 55 Z"
                  fill="#E8DDD0" stroke="#D4C8B8" strokeWidth={1.2} opacity={0.92} />
                <path d="M -15 60 Q -18 78, -12 95" stroke="#D4C8B8" strokeWidth={0.5} fill="none" opacity={0.4} />
                <path d="M 15 60 Q 18 78, 12 95" stroke="#D4C8B8" strokeWidth={0.5} fill="none" opacity={0.4} />
                <ellipse cx="0" cy="54" rx="14" ry="5" fill="#D4C8B8" opacity={0.75} />
                <path d="M -6 54 Q -12 48, -4 46 Q 0 50, -6 54" fill="#D4C8B8" opacity={0.6} />
                <path d="M 6 54 Q 12 48, 4 46 Q 0 50, 6 54" fill="#D4C8B8" opacity={0.6} />

                {/* Stems */}
                {flowers.map((f) => {
                  const convergeX = f.x * 0.1;
                  const midY = (f.y + 75) / 2;
                  return (
                    <path key={`stem-${f.id}`}
                      d={`M ${f.x} ${f.y + 12 * f.scale} Q ${f.x * 0.6} ${midY}, ${convergeX} 75`}
                      stroke="#5A8A5A" strokeWidth={1.2 + f.scale * 0.3}
                      strokeLinecap="round" fill="none" opacity={0.45} />
                  );
                })}

                {/* Flowers */}
                {flowers.map((f) => {
                  const FlowerComp = flowerComponents[f.type];
                  return (
                    <g key={f.id}
                      onPointerDown={(e) => handlePointerDown(e, f.id)}
                      onDoubleClick={() => removeFlower(f.id)}
                      style={{ cursor: dragging === f.id ? "grabbing" : "grab" }}>
                      <FlowerComp x={f.x} y={f.y} scale={f.scale} rotation={f.rotation}
                        color={f.color} accentColor={f.accentColor} style={styleVariant} />
                      <circle cx={f.x} cy={f.y} r={15 * f.scale} fill="transparent" />
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
          {flowers.length > 0 && (
            <p className="text-center text-xs text-muted-foreground font-sans mt-2">
              Drag to rearrange · Double-tap to remove
            </p>
          )}
        </div>

        {/* Right sidebar — tips & color theory */}
        <div className="lg:w-64 flex-shrink-0 space-y-3">
          <button onClick={() => setShowTips(!showTips)}
            className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            {showTips ? "▼" : "▶"} Florist Tips & Color Theory
          </button>

          {showTips && (
            <div className="space-y-3 animate-fade-up">
              {/* Color theory */}
              <div className="p-3 rounded-xl bg-card border border-border">
                <h3 className="text-xs font-sans font-semibold text-foreground mb-2">🎨 Color Theory</h3>
                <div className="space-y-2">
                  {colorTheoryTips.slice(0, 4).map((tip, i) => (
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

              {/* Design tips */}
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

              {/* Fun facts */}
              <div className="p-3 rounded-xl bg-card border border-border">
                <h3 className="text-xs font-sans font-semibold text-foreground mb-2">✨ Flower Facts</h3>
                <div className="space-y-1.5">
                  {allFlowers.slice(0, 5).map((f) => (
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
