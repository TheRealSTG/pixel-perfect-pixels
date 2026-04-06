import React, { useState, useEffect } from "react";
import { flowerComponents } from "@/components/flowers/FlowerSVGs";
import type { ArtStyle } from "@/lib/bouquet-data";
import type { BouquetLayer, WrapStyle } from "@/lib/bouquet-engine";

interface FlowerPlacement {
  type: keyof typeof flowerComponents;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  accentColor: string;
  delay: number;
  layer?: BouquetLayer;
}

interface Props {
  flowers: FlowerPlacement[];
  wrapColor: string;
  wrapAccent: string;
  artStyle: ArtStyle;
  animated?: boolean;
  wrapStyle?: WrapStyle;
}

const BouquetCanvas: React.FC<Props> = ({ flowers, wrapColor, wrapAccent, artStyle, animated = true, wrapStyle = "paper" }) => {
  const [visibleCount, setVisibleCount] = useState(animated ? 0 : flowers.length);

  useEffect(() => {
    if (!animated) return;
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    flowers.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount((c) => c + 1), 200 + i * 100));
    });
    return () => timers.forEach(clearTimeout);
  }, [flowers, animated]);

  const styleVariant = artStyle === "pixel" ? "pixel" : artStyle === "botanical" ? "botanical" : "flat";

  // Sort flowers by layer: back → mid → front
  const layerOrder: Record<string, number> = { back: 0, mid: 1, front: 2 };
  const sortedFlowers = [...flowers].sort((a, b) => {
    const la = layerOrder[a.layer || "mid"] ?? 1;
    const lb = layerOrder[b.layer || "mid"] ?? 1;
    if (la !== lb) return la - lb;
    return a.y - b.y;
  });

  const renderWrap = () => {
    switch (wrapStyle) {
      case "kraft":
        return (
          <>
            <path d="M -38 48 Q -48 75, -26 108 L 26 108 Q 48 75, 38 48 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.8} opacity={0.95} />
            <path d="M -30 60 Q 0 58, 30 60" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.2} />
            <path d="M -28 72 Q 0 70, 28 72" stroke={wrapAccent} strokeWidth={0.4} fill="none" opacity={0.15} />
            <path d="M -24 84 Q 0 82, 24 84" stroke={wrapAccent} strokeWidth={0.4} fill="none" opacity={0.15} />
            <path d="M -20 96 Q 0 94, 20 96" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.1} />
            <path d="M -12 48 Q -20 38, -8 34 Q 0 42, -12 48" stroke="#8B7355" strokeWidth={1} fill="none" opacity={0.6} />
            <path d="M 12 48 Q 20 38, 8 34 Q 0 42, 12 48" stroke="#8B7355" strokeWidth={1} fill="none" opacity={0.6} />
            <circle cx="0" cy="47" r="2.5" fill="#8B7355" opacity={0.7} />
            <path d="M 0 49 Q -4 58, -6 65" stroke="#8B7355" strokeWidth={0.8} fill="none" opacity={0.4} />
            <path d="M 0 49 Q 3 56, 5 62" stroke="#8B7355" strokeWidth={0.8} fill="none" opacity={0.4} />
          </>
        );
      case "tissue":
        return (
          <>
            <path d="M -40 46 Q -44 32, -32 28 Q -38 38, -30 46 Q -36 38, -40 46" fill={wrapColor} opacity={0.45} />
            <path d="M -28 44 Q -30 30, -22 26 Q -26 36, -20 44 Q -24 36, -28 44" fill={wrapColor} opacity={0.4} />
            <path d="M 40 46 Q 44 32, 32 28 Q 38 38, 30 46 Q 36 38, 40 46" fill={wrapColor} opacity={0.45} />
            <path d="M 28 44 Q 30 30, 22 26 Q 26 36, 20 44 Q 24 36, 28 44" fill={wrapColor} opacity={0.4} />
            <path d="M -36 48 Q -44 74, -24 108 L 24 108 Q 44 74, 36 48 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.6} opacity={0.8} />
            <path d="M -18 52 Q -20 74, -14 100" stroke={wrapAccent} strokeWidth={0.25} fill="none" opacity={0.2} />
            <path d="M 18 52 Q 20 74, 14 100" stroke={wrapAccent} strokeWidth={0.25} fill="none" opacity={0.2} />
            <rect x="-20" y="46" width="40" height="5" rx="2.5" fill={wrapAccent} opacity={0.6} />
            <path d="M -10 48 Q -18 38, -7 34 Q 0 42, -10 48" fill={wrapAccent} opacity={0.5} />
            <path d="M 10 48 Q 18 38, 7 34 Q 0 42, 10 48" fill={wrapAccent} opacity={0.5} />
            <ellipse cx="0" cy="48" rx="3" ry="2.5" fill={wrapAccent} opacity={0.7} />
          </>
        );
      case "burlap":
        return (
          <>
            <path d="M -34 50 Q -42 74, -22 105 L 22 105 Q 42 74, 34 50 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={2} opacity={0.92} />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h-${i}`} x1="-30" y1={54 + i * 6} x2="30" y2={54 + i * 6}
                stroke={wrapAccent} strokeWidth={0.4} opacity={0.2} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`v-${i}`} x1={-22 + i * 7} y1="52" x2={-20 + i * 7} y2="103"
                stroke={wrapAccent} strokeWidth={0.35} opacity={0.15} />
            ))}
            <path d="M -14 50 Q -14 46, 0 45 Q 14 46, 14 50" stroke="#7A6A50" strokeWidth={1.5} fill="none" opacity={0.5} />
            <circle cx="0" cy="49" r="2" fill="#7A6A50" opacity={0.5} />
          </>
        );
      case "vase":
        return (
          <>
            <path d="M -20 42 Q -24 58, -22 90 Q -20 100, 0 103 Q 20 100, 22 90 Q 24 58, 20 42 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.5} />
            <path d="M -21 65 Q 0 62, 21 65 L 22 90 Q 20 100, 0 103 Q -20 100, -22 90 Z"
              fill="#B8D8E8" opacity={0.2} />
            <path d="M -16 48 Q -17 62, -16 85" stroke="#FFFFFF" strokeWidth={2} opacity={0.25} fill="none" strokeLinecap="round" />
            <path d="M -12 52 Q -13 65, -12 80" stroke="#FFFFFF" strokeWidth={0.8} opacity={0.15} fill="none" strokeLinecap="round" />
            <ellipse cx="0" cy="42" rx="20" ry="5" fill={wrapColor} stroke={wrapAccent} strokeWidth={0.8} opacity={0.6} />
            <ellipse cx="0" cy="103" rx="10" ry="3" fill={wrapAccent} opacity={0.3} />
          </>
        );
      default: // paper
        return (
          <>
            <path d="M -34 52 Q -42 76, -24 104 L 24 104 Q 42 76, 34 52 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.2} opacity={0.92} />
            <path d="M -16 58 Q -20 76, -14 98" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.3} />
            <path d="M 16 58 Q 20 76, 14 98" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.3} />
            <path d="M 0 54 Q -1 74, 0 98" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.2} />
            <path d="M -36 52 Q -34 46, -20 44 Q 0 42, 20 44 Q 34 46, 36 52"
              stroke={wrapAccent} strokeWidth={0.8} fill={wrapColor} opacity={0.85} />
            <ellipse cx="0" cy="52" rx="14" ry="4.5" fill={wrapAccent} opacity={0.6} />
            <path d="M -7 52 Q -14 44, -5 42 Q 0 48, -7 52" fill={wrapAccent} opacity={0.5} />
            <path d="M 7 52 Q 14 44, 5 42 Q 0 48, 7 52" fill={wrapAccent} opacity={0.5} />
            <circle cx="0" cy="52" r="2" fill={wrapAccent} opacity={0.7} />
          </>
        );
    }
  };

  // Stem length varies by layer
  const getStemBottom = (layer?: BouquetLayer) => {
    switch (layer) {
      case "back": return 62;
      case "front": return 78;
      default: return 70;
    }
  };

  return (
    <svg viewBox="-120 -160 240 300" className="w-full h-auto max-w-xs sm:max-w-sm mx-auto" role="img" aria-label="Your bouquet">

      {/* Wrap */}
      {renderWrap()}

      {/* Flowers by layer */}
      {sortedFlowers.slice(0, visibleCount).map((f, i) => {
        const FlowerComp = flowerComponents[f.type];
        return (
          <g
            key={i}
            style={{
              animation: animated ? `bouquet-pop 0.4s ease-out forwards` : undefined,
              opacity: animated ? 0 : 1,
              animationDelay: animated ? `${f.delay}s` : undefined,
            }}
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
          </g>
        );
      })}
    </svg>
  );
};

export default BouquetCanvas;
