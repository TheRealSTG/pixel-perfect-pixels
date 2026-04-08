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

  // Split flowers into those behind the wrap and those in front
  const backLayerFlowers = sortedFlowers.filter(f => f.layer === "back");
  const midFrontFlowers = sortedFlowers.filter(f => f.layer !== "back");

  const renderWrap = () => {
    switch (wrapStyle) {
      case "kraft":
        return (
          <>
            {/* Main cone shape - tall kraft paper */}
            <path d="M -52 -15 Q -58 20, -48 55 L -30 85 L 30 85 L 48 55 Q 58 20, 52 -15 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.5} opacity={0.95} />
            {/* Paper texture lines */}
            <path d="M -45 -5 Q 0 -8, 45 -5" stroke={wrapAccent} strokeWidth={0.6} fill="none" opacity={0.15} />
            <path d="M -48 10 Q 0 7, 48 10" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.12} />
            <path d="M -50 25 Q 0 22, 50 25" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.1} />
            <path d="M -46 40 Q 0 37, 46 40" stroke={wrapAccent} strokeWidth={0.4} fill="none" opacity={0.1} />
            <path d="M -40 55 Q 0 52, 40 55" stroke={wrapAccent} strokeWidth={0.4} fill="none" opacity={0.08} />
            {/* Crinkle fold at top */}
            <path d="M -52 -15 Q -42 -22, -30 -18 Q -18 -24, -6 -16 Q 6 -24, 18 -18 Q 30 -22, 42 -16 Q 52 -20, 52 -15"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.8} opacity={0.9} />
            {/* Twine wrapping */}
            <path d="M -38 8 Q -20 3, 0 5 Q 20 3, 38 8" stroke="#8B7355" strokeWidth={1.8} fill="none" opacity={0.7} strokeLinecap="round" />
            <path d="M -38 11 Q -20 6, 0 8 Q 20 6, 38 11" stroke="#8B7355" strokeWidth={1.2} fill="none" opacity={0.5} strokeLinecap="round" />
            {/* Twine bow */}
            <path d="M -8 6 Q -18 -4, -6 -6 Q 0 2, -8 6" fill="#8B7355" opacity={0.6} />
            <path d="M 8 6 Q 18 -4, 6 -6 Q 0 2, 8 6" fill="#8B7355" opacity={0.6} />
            <circle cx="0" cy="6" r="3" fill="#7A6A50" opacity={0.7} />
            {/* Twine tails */}
            <path d="M -2 9 Q -8 20, -12 28" stroke="#8B7355" strokeWidth={1} fill="none" opacity={0.4} strokeLinecap="round" />
            <path d="M 2 9 Q 6 18, 10 25" stroke="#8B7355" strokeWidth={1} fill="none" opacity={0.4} strokeLinecap="round" />
          </>
        );
      case "tissue":
        return (
          <>
            {/* Soft tissue ruffles poking up behind */}
            <path d="M -55 -18 Q -50 -32, -40 -28 Q -35 -18, -28 -26 Q -22 -34, -15 -22" fill={wrapColor} opacity={0.35} />
            <path d="M -20 -20 Q -12 -30, -5 -24 Q 2 -32, 10 -22 Q 16 -30, 22 -20" fill={wrapColor} opacity={0.3} />
            <path d="M 18 -18 Q 25 -30, 32 -24 Q 38 -32, 45 -22 Q 50 -28, 55 -18" fill={wrapColor} opacity={0.35} />
            {/* Main tissue body */}
            <path d="M -50 -15 Q -54 20, -38 60 L -22 82 L 22 82 L 38 60 Q 54 20, 50 -15 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.5} opacity={0.75} />
            {/* Tissue crinkle texture */}
            <path d="M -30 0 Q -32 25, -24 55" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.2} />
            <path d="M -10 -5 Q -12 20, -8 50" stroke={wrapAccent} strokeWidth={0.2} fill="none" opacity={0.15} />
            <path d="M 10 -5 Q 12 20, 8 50" stroke={wrapAccent} strokeWidth={0.2} fill="none" opacity={0.15} />
            <path d="M 30 0 Q 32 25, 24 55" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.2} />
            {/* Satin ribbon */}
            <rect x="-40" y="-2" width="80" height="8" rx="3" fill={wrapAccent} opacity={0.7} />
            <rect x="-40" y="0" width="80" height="3" rx="1.5" fill="white" opacity={0.1} />
            {/* Ribbon bow */}
            <path d="M -12 2 Q -24 -10, -10 -12 Q -2 -2, -12 2" fill={wrapAccent} opacity={0.8} />
            <path d="M 12 2 Q 24 -10, 10 -12 Q 2 -2, 12 2" fill={wrapAccent} opacity={0.8} />
            <ellipse cx="0" cy="2" rx="4" ry="3" fill={wrapAccent} opacity={0.9} />
            {/* Ribbon tails */}
            <path d="M -3 5 Q -10 18, -14 30 Q -12 28, -8 32" stroke={wrapAccent} strokeWidth={2} fill="none" opacity={0.5} strokeLinecap="round" />
            <path d="M 3 5 Q 8 16, 12 28 Q 10 26, 6 30" stroke={wrapAccent} strokeWidth={2} fill="none" opacity={0.5} strokeLinecap="round" />
          </>
        );
      case "burlap":
        return (
          <>
            {/* Rough burlap wrap */}
            <path d="M -48 -12 Q -52 20, -40 55 L -26 82 L 26 82 L 40 55 Q 52 20, 48 -12 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={2.5} opacity={0.92} />
            {/* Woven texture — horizontal */}
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`h-${i}`} x1="-44" y1={-8 + i * 6.5} x2="44" y2={-8 + i * 6.5}
                stroke={wrapAccent} strokeWidth={0.5} opacity={0.18} />
            ))}
            {/* Woven texture — vertical */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v-${i}`} x1={-38 + i * 8} y1="-10" x2={-34 + i * 8} y2="78"
                stroke={wrapAccent} strokeWidth={0.4} opacity={0.12} />
            ))}
            {/* Rough top edge */}
            <path d="M -48 -12 Q -40 -16, -30 -14 Q -20 -10, -10 -14 Q 0 -18, 10 -14 Q 20 -10, 30 -14 Q 40 -16, 48 -12"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.2} opacity={0.85} />
            {/* Jute twine */}
            <path d="M -34 5 Q 0 0, 34 5" stroke="#7A6A50" strokeWidth={2} fill="none" opacity={0.6} strokeLinecap="round" />
            <path d="M -34 8 Q 0 3, 34 8" stroke="#7A6A50" strokeWidth={1.2} fill="none" opacity={0.4} strokeLinecap="round" />
            {/* Simple knot */}
            <circle cx="0" cy="4" r="3.5" fill="#7A6A50" opacity={0.5} />
            <path d="M 0 7 Q -3 14, -5 20" stroke="#7A6A50" strokeWidth={1} fill="none" opacity={0.35} />
            <path d="M 0 7 Q 3 12, 4 18" stroke="#7A6A50" strokeWidth={1} fill="none" opacity={0.35} />
          </>
        );
      case "vase":
        return (
          <>
            {/* Vase lip/rim */}
            <ellipse cx="0" cy="-12" rx="28" ry="7" fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.7} />
            {/* Vase body — rounded */}
            <path d="M -28 -12 Q -32 10, -30 35 Q -28 60, -18 75 Q -8 85, 0 87 Q 8 85, 18 75 Q 28 60, 30 35 Q 32 10, 28 -12"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.2} opacity={0.45} />
            {/* Water level */}
            <path d="M -29 15 Q -10 12, 0 13 Q 10 12, 29 15 L 30 35 Q 28 60, 18 75 Q 8 85, 0 87 Q -8 85, -18 75 Q -28 60, -30 35 Z"
              fill="#B8D8E8" opacity={0.15} />
            {/* Glass highlight left */}
            <path d="M -22 -5 Q -24 15, -22 40 Q -20 55, -16 65"
              stroke="white" strokeWidth={3} opacity={0.2} fill="none" strokeLinecap="round" />
            <path d="M -17 0 Q -18 18, -17 38"
              stroke="white" strokeWidth={1.2} opacity={0.1} fill="none" strokeLinecap="round" />
            {/* Glass highlight right (subtle) */}
            <path d="M 20 5 Q 22 20, 20 40"
              stroke="white" strokeWidth={1} opacity={0.08} fill="none" strokeLinecap="round" />
            {/* Inner rim */}
            <ellipse cx="0" cy="-12" rx="24" ry="5" fill="none" stroke={wrapAccent} strokeWidth={0.5} opacity={0.3} />
            {/* Base shadow */}
            <ellipse cx="0" cy="87" rx="14" ry="4" fill={wrapAccent} opacity={0.25} />
          </>
        );
      default: // paper — classic wrapping paper cone
        return (
          <>
            {/* Main paper cone */}
            <path d="M -50 -15 Q -56 20, -44 55 L -28 85 L 28 85 L 44 55 Q 56 20, 50 -15 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.2} opacity={0.92} />
            {/* Paper fold lines */}
            <path d="M -22 -8 Q -26 20, -20 60" stroke={wrapAccent} strokeWidth={0.6} fill="none" opacity={0.2} />
            <path d="M 22 -8 Q 26 20, 20 60" stroke={wrapAccent} strokeWidth={0.6} fill="none" opacity={0.2} />
            <path d="M 0 -10 Q -2 20, 0 65" stroke={wrapAccent} strokeWidth={0.35} fill="none" opacity={0.15} />
            {/* Folded top edge — scalloped */}
            <path d="M -50 -15 Q -44 -22, -34 -18 Q -24 -24, -14 -17 Q -4 -23, 6 -17 Q 16 -24, 26 -18 Q 36 -22, 46 -17 Q 50 -20, 50 -15"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.8} opacity={0.88} />
            {/* Ribbon band */}
            <rect x="-42" y="-1" width="84" height="7" rx="3" fill={wrapAccent} opacity={0.65} />
            <rect x="-42" y="1" width="84" height="2.5" rx="1" fill="white" opacity={0.08} />
            {/* Bow */}
            <path d="M -10 3 Q -20 -8, -8 -10 Q -2 0, -10 3" fill={wrapAccent} opacity={0.7} />
            <path d="M 10 3 Q 20 -8, 8 -10 Q 2 0, 10 3" fill={wrapAccent} opacity={0.7} />
            <circle cx="0" cy="3" r="3" fill={wrapAccent} opacity={0.8} />
            {/* Bow tails */}
            <path d="M -2 6 Q -6 16, -10 24" stroke={wrapAccent} strokeWidth={1.5} fill="none" opacity={0.4} strokeLinecap="round" />
            <path d="M 2 6 Q 5 14, 8 22" stroke={wrapAccent} strokeWidth={1.5} fill="none" opacity={0.4} strokeLinecap="round" />
          </>
        );
    }
  };

  const renderFlower = (f: FlowerPlacement, i: number) => {
    const FlowerComp = flowerComponents[f.type];
    return (
      <g
        key={`${f.type}-${i}`}
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
  };

  return (
    <svg viewBox="-120 -160 240 280" className="w-full h-auto max-w-xs sm:max-w-sm mx-auto" role="img" aria-label="Your bouquet">
      {/* Back layer flowers (behind wrap) */}
      {backLayerFlowers.slice(0, Math.min(backLayerFlowers.length, visibleCount)).map((f, i) => renderFlower(f, i))}

      {/* Wrap (in middle) */}
      {renderWrap()}

      {/* Mid and front layer flowers (in front of wrap) */}
      {midFrontFlowers.slice(0, Math.max(0, visibleCount - backLayerFlowers.length)).map((f, i) => renderFlower(f, i + backLayerFlowers.length))}
    </svg>
  );
};

export default BouquetCanvas;
