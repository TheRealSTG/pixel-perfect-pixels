import React, { useState, useEffect } from "react";
import { flowerComponents } from "@/components/flowers/FlowerSVGs";
import type { ArtStyle } from "@/lib/bouquet-data";
import type { BouquetLayer, WrapStyle } from "@/lib/bouquet-engine";
import WrapRenderer from "@/components/flowers/WrapRenderer";

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
  stemLength?: number;
  hideStems?: boolean;
  wrapScale?: number;
}

// Wrap mouth sits at this global SVG y-coordinate.
// Stems are clipped here so they vanish into the wrap.
const WRAP_MOUTH_Y = 2;

const BouquetCanvas: React.FC<Props> = ({
  flowers,
  wrapColor,
  wrapAccent,
  artStyle,
  animated = false,
  wrapStyle = "paper",
  stemLength = 1.0,
  hideStems = false,
  wrapScale = 0.9,
}) => {
  const [visibleCount, setVisibleCount] = useState(animated ? 0 : flowers.length);

  useEffect(() => {
    if (!animated) { setVisibleCount(flowers.length); return; }
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    flowers.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount((c) => c + 1), 60 + i * 45));
    });
    return () => timers.forEach(clearTimeout);
  }, [flowers, animated]);

  const styleVariant: "flat" | "botanical" | "pixel" =
    artStyle === "pixel" ? "pixel" : artStyle === "botanical" ? "botanical" : "flat";
  const isWatercolour = artStyle === "watercolour";
  const isBotanical  = artStyle === "botanical";
  const isPixel      = artStyle === "pixel";
  const isFlat       = artStyle === "flat";

  const layerOrder: Record<string, number> = { back: 0, mid: 1, front: 2 };
  const sortedFlowers = [...flowers].sort((a, b) => {
    const la = layerOrder[a.layer || "mid"] ?? 1;
    const lb = layerOrder[b.layer || "mid"] ?? 1;
    if (la !== lb) return la - lb;
    return a.y - b.y;
  });

  const backLayerFlowers  = sortedFlowers.filter((f) => f.layer === "back");
  const midFrontFlowers   = sortedFlowers.filter((f) => f.layer !== "back");

  // global y = local_y * wrapScale + wrapOffset
  // at local_y=10 (wrap top): global y = WRAP_MOUTH_Y
  const wrapOffset = WRAP_MOUTH_Y - 10 * wrapScale;

  // ── Stems ──────────────────────────────────────────────────────────────
  const renderStems = () => {
    if (hideStems || stemLength <= 0) return null;
    return midFrontFlowers.map((f, i) => {
      if (i >= visibleCount) return null;
      const startY  = f.y + 1.2 * f.scale;
      const maxLen  = Math.max(0, WRAP_MOUTH_Y - startY);
      const len     = Math.max(0, maxLen * stemLength);
      if (len < 0.5) return null;
      const endY    = startY + len;
      const fullness = maxLen > 0.01 ? len / maxLen : 0;
      // Deterministic jitter per stem position
      const raw    = Math.sin(f.x * 12.9898 + f.y * 78.233);
      const jitter = raw - Math.floor(raw);
      const endX   = f.x * (1 - (0.88 + jitter * 0.08) * fullness);
      const bow    = (jitter - 0.5) * 4 * fullness;
      const ctrlX  = f.x * (1 - (0.44 + jitter * 0.16) * fullness) + bow;
      const ctrlY  = (startY + endY) / 2 + 2 + jitter * 1.5;
      // Taper: wide at bloom, narrow at wrap mouth
      const baseW  = 0.85 + 0.3 * f.scale;
      const tipW   = baseW * 0.28;
      const hb = baseW / 2, ht = tipW / 2;
      return (
        <path
          key={`stem-${i}-${f.x}-${f.y}`}
          d={`M ${f.x-hb} ${startY} Q ${ctrlX-ht} ${ctrlY} ${endX-ht} ${endY}
              L ${endX+ht} ${endY} Q ${ctrlX+ht} ${ctrlY} ${f.x+hb} ${startY} Z`}
          fill="#6BA06B"
          opacity={0.85}
        />
      );
    });
  };

  // ── Flower renderer ────────────────────────────────────────────────────
  const renderFlower = (f: FlowerPlacement, i: number) => {
    const FlowerComp = flowerComponents[f.type];
    if (i >= visibleCount) return null;
    const hasDepth = f.layer === "front" || f.layer === "mid";
    return (
      <g key={`${f.type}-${i}`} filter={hasDepth ? "url(#bloom-shadow)" : undefined}>
        <FlowerComp
          x={f.x} y={f.y} scale={f.scale} rotation={f.rotation}
          color={f.color} accentColor={f.accentColor} style={styleVariant}
        />
      </g>
    );
  };

  return (
    <svg
      viewBox="-100 -100 200 200"
      className="w-full h-auto max-w-xs sm:max-w-sm mx-auto"
      role="img" aria-label="Your bouquet"
      shapeRendering={isPixel ? "crispEdges" : "auto"}
    >
      <defs>
        {/* Watercolour: organic painted edges */}
        <filter id="wc-bleed" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="4" seed="12" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.8"
            xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.35" />
        </filter>
        <radialGradient id="wc-paper-wash" cx="50%" cy="45%" r="70%">
          <stop offset="0%"   stopColor="#FDF6EE" stopOpacity="0.0" />
          <stop offset="55%"  stopColor="#F5E8D8" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#E8D0B8" stopOpacity="0.0" />
        </radialGradient>

        {/* Botanical: vintage desaturated ink */}
        <filter id="bot-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="saturate" values="0.50" result="desat" />
          <feColorMatrix in="desat"
            values="0.84 0.05 0 0 0.02  0 0.80 0 0 0.04  0 0 0.68 0 0.02  0 0 0 1 0"
            result="muted" />
          <feMorphology in="muted" operator="dilate" radius="0.55" result="dilated" />
          <feColorMatrix in="dilated"
            values="0.14 0 0 0 0.04  0 0.14 0 0 0.05  0 0 0.14 0 0.02  0 0 0 1 0"
            result="ink" />
          <feComposite in="muted" in2="ink" operator="over" />
        </filter>
        <pattern id="bot-hatch" patternUnits="userSpaceOnUse" width="2.4" height="2.4" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="2.4" stroke="#2A2418" strokeWidth="0.3" opacity="0.7" />
        </pattern>
        <radialGradient id="bot-paper" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="#F5EDD8" stopOpacity="0" />
          <stop offset="100%" stopColor="#C8B488" stopOpacity="0.20" />
        </radialGradient>

        {/* Flat: gentle saturation boost, trust the SVG gradients */}
        <filter id="flat-clean" x="-2%" y="-2%" width="104%" height="104%">
          <feColorMatrix type="saturate" values="1.20" />
        </filter>

        {/* Pixel: chunky 8-bit posterize */}
        <filter id="pixel-crunch" x="-5%" y="-5%" width="110%" height="110%">
          <feColorMatrix type="saturate" values="1.35" result="sat" />
          <feComponentTransfer in="sat">
            <feFuncR type="discrete" tableValues="0 0.33 0.66 1" />
            <feFuncG type="discrete" tableValues="0.15 0.45 0.72 1" />
            <feFuncB type="discrete" tableValues="0 0.33 0.66 1" />
          </feComponentTransfer>
        </filter>
        <pattern id="pixel-scan" patternUnits="userSpaceOnUse" width="2" height="2">
          <rect width="2" height="2" fill="transparent" />
          <rect y="1" width="2" height="1" fill="#000" opacity="0.06" />
        </pattern>

        {/* Bloom depth shadow */}
        <filter id="bloom-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#00000014" />
        </filter>

        {/* Clip stems at wrap mouth — nothing escapes below */}
        <clipPath id="stem-clip">
          <rect x="-100" y="-100" width="200" height={100 + WRAP_MOUTH_Y} />
        </clipPath>
      </defs>

      {isWatercolour && (
        <ellipse cx="0" cy="-10" rx="95" ry="88" fill="url(#wc-paper-wash)" />
      )}
      {isBotanical && (
        <rect x="-100" y="-100" width="200" height="200" fill="url(#bot-paper)" />
      )}

      <g
        filter={
          isWatercolour ? "url(#wc-bleed)"
          : isBotanical  ? "url(#bot-ink)"
          : isFlat       ? "url(#flat-clean)"
          : isPixel      ? "url(#pixel-crunch)"
          : undefined
        }
      >
        {/* 1. Back greenery */}
        {backLayerFlowers.map((f, i) => renderFlower(f, i))}

        {isBotanical && (
          <ellipse cx="0" cy="-42" rx="46" ry="36"
            fill="url(#bot-hatch)" opacity={0.28} pointerEvents="none" />
        )}

        {/* 2. Stems — before wrap so wrap covers their ends */}
        <g clipPath="url(#stem-clip)">
          {renderStems()}
        </g>

        {/* 3. Wrap — uses shared WrapRenderer, same as FloristStudio */}
        <g transform={`translate(0 ${wrapOffset}) scale(${wrapScale})`}>
          <WrapRenderer wrapStyle={wrapStyle} wrapColor={wrapColor} wrapAccent={wrapAccent} />
        </g>

        {/* 4. Mid + front flowers on top */}
        {midFrontFlowers.map((f, i) => renderFlower(f, i + backLayerFlowers.length))}
      </g>

      {isPixel && (
        <rect x="-100" y="-100" width="200" height="200"
          fill="url(#pixel-scan)" pointerEvents="none" />
      )}
    </svg>
  );
};

export default BouquetCanvas;
