import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { flowerComponents, type FlowerType } from "@/components/flowers/FlowerSVGs";
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

const flowerPicker: { type: FlowerType; label: string; emoji: string; color: string; accent: string }[] = [
  { type: "rose", label: "Rose", emoji: "🌹", color: "#E8A0B4", accent: "#D4708A" },
  { type: "peony", label: "Peony", emoji: "🌸", color: "#F5E1E8", accent: "#E8C4D0" },
  { type: "tulip", label: "Tulip", emoji: "🌷", color: "#E06080", accent: "#C84060" },
  { type: "sunflower", label: "Sunflower", emoji: "🌻", color: "#F4C430", accent: "#E0A800" },
  { type: "lavender", label: "Lavender", emoji: "💜", color: "#9B7FBF", accent: "#7B5FA0" },
  { type: "eucalyptus", label: "Eucalyptus", emoji: "🌿", color: "#7BAF7B", accent: "#5A8A5A" },
];

let idCounter = 0;

const FloristStudio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config as BouquetConfig | undefined;
  const artStyle: ArtStyle = config?.artStyle || "flat";

  const [flowers, setFlowers] = useState<PlacedFlower[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addFlower = useCallback((type: FlowerType, color: string, accent: string) => {
    const id = `flower-${++idCounter}`;
    setFlowers((prev) => [
      ...prev,
      {
        id,
        type,
        x: (Math.random() - 0.5) * 80,
        y: -40 + (Math.random() - 0.5) * 60,
        scale: 1.2 + Math.random() * 0.4,
        rotation: (Math.random() - 0.5) * 30,
        color,
        accentColor: accent,
      },
    ]);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>, id: string) => {
    e.stopPropagation();
    const svg = (e.currentTarget.closest("svg") as SVGSVGElement);
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

  const removeFlower = (id: string) => {
    setFlowers((prev) => prev.filter((f) => f.id !== id));
  };

  const styleVariant = artStyle === "pixel" ? "pixel" : artStyle === "botanical" ? "botanical" : "flat";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
        >
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
                    type: f.type,
                    x: f.x,
                    y: f.y,
                    scale: f.scale,
                    rotation: f.rotation,
                    color: f.color,
                    accentColor: f.accentColor,
                    delay: 0,
                  })),
                },
              });
            }
          }}
          disabled={flowers.length === 0}
          className="text-sm font-sans font-medium text-primary hover:text-accent transition-colors disabled:opacity-40"
        >
          Done →
        </button>
      </nav>

      {/* Flower picker */}
      <div className="px-6 max-w-5xl mx-auto w-full mb-4">
        <p className="text-xs font-sans text-muted-foreground mb-2">Tap to add flowers, then drag to arrange</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {flowerPicker.map((f) => (
            <button
              key={f.type}
              onClick={() => addFlower(f.type, f.color, f.accent)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-muted/40 hover:bg-muted/70 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="text-lg">{f.emoji}</span>
              <span className="text-xs font-sans font-medium text-foreground">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 px-6 pb-6 max-w-5xl mx-auto w-full">
        <div className="bg-card rounded-2xl border border-border h-full min-h-[400px] flex items-center justify-center relative overflow-hidden">
          {flowers.length === 0 ? (
            <p className="text-muted-foreground font-sans text-sm">Tap a flower above to start 🌸</p>
          ) : (
            <svg
              viewBox="-100 -140 200 240"
              className="w-full h-full max-h-[60vh]"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{ touchAction: "none" }}
            >
              {/* Wrapping paper */}
              <path
                d="M -28 60 Q -35 80, -20 95 L 20 95 Q 35 80, 28 60 Z"
                fill="#E8DDD0"
                stroke="#D4C8B8"
                strokeWidth={1}
                opacity={0.9}
              />
              <ellipse cx="0" cy="58" rx="12" ry="4" fill="#D4C8B8" opacity={0.7} />

              {/* Stems */}
              {flowers.map((f) => (
                <line
                  key={`stem-${f.id}`}
                  x1={f.x}
                  y1={f.y + 15 * f.scale}
                  x2={f.x * 0.15}
                  y2={80}
                  stroke="#5A8A5A"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  opacity={0.4}
                />
              ))}

              {/* Flowers */}
              {flowers.map((f) => {
                const FlowerComp = flowerComponents[f.type];
                return (
                  <g
                    key={f.id}
                    onPointerDown={(e) => handlePointerDown(e, f.id)}
                    onDoubleClick={() => removeFlower(f.id)}
                    style={{ cursor: dragging === f.id ? "grabbing" : "grab" }}
                  >
                    <FlowerComp
                      x={f.x}
                      y={f.y}
                      scale={f.scale}
                      rotation={f.rotation}
                      color={f.color}
                      accentColor={f.accentColor}
                      style={styleVariant}
                    />
                    {/* Invisible hit area */}
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
    </div>
  );
};

export default FloristStudio;
