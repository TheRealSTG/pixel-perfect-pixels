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
  stemLength?: number;
  hideStems?: boolean;
  wrapScale?: number;
}

const BouquetCanvas: React.FC<Props> = ({
  flowers,
  wrapColor,
  wrapAccent,
  artStyle,
  animated = false,
  wrapStyle = "paper",
  stemLength = 0,
  hideStems = false,
  wrapScale = 0.85,
}) => {
  const [visibleCount, setVisibleCount] = useState(flowers.length);

useEffect(() => {
  if (!animated) {
    setVisibleCount(flowers.length);
    return;
  }
  setVisibleCount(0);
  const timers: ReturnType<typeof setTimeout>[] = [];
  flowers.forEach((_, i) => {
    timers.push(setTimeout(() => setVisibleCount((c) => c + 1), 80 + i * 45));
  });
  return () => timers.forEach(clearTimeout);
}, [flowers, animated]);

  const styleVariant: "flat" | "botanical" | "pixel" =
    artStyle === "pixel" ? "pixel"
    : artStyle === "botanical" ? "botanical"
    : "flat";
  const isWatercolour = artStyle === "watercolour";
  const isBotanical = artStyle === "botanical";
  const isPixel = artStyle === "pixel";
  const isFlat = artStyle === "flat";

  const layerOrder: Record<string, number> = { back: 0, mid: 1, front: 2 };
  const sortedFlowers = [...flowers].sort((a, b) => {
    const la = layerOrder[a.layer || "mid"] ?? 1;
    const lb = layerOrder[b.layer || "mid"] ?? 1;
    if (la !== lb) return la - lb;
    return a.y - b.y;
  });

  const backLayerFlowers = sortedFlowers.filter((f) => f.layer === "back");
  const midFrontFlowers = sortedFlowers.filter((f) => f.layer !== "back");

  const renderWrap = () => {
    switch (wrapStyle) {
      case "handtied":
        return (
          <>
            <g opacity={0.75}>
              {[-6, -2, 2, 6].map((dx, i) => (
                <line key={`htstem-${i}`} x1={dx} y1={22} x2={dx * 0.4} y2={58}
                  stroke="#5A8A5A" strokeWidth={1.2} strokeLinecap="round" />
              ))}
            </g>
            <path d="M -16 18 Q 0 14, 16 18 L 18 28 Q 0 24, -18 28 Z" fill={wrapAccent} opacity={0.85} />
            <path d="M -16 18 Q 0 22, 16 18" stroke={wrapColor} strokeWidth={0.6} fill="none" opacity={0.6} />
            <path d="M -10 22 Q -22 14, -14 26 Q -8 24, -10 22" fill={wrapAccent} opacity={0.8} />
            <path d="M 10 22 Q 22 14, 14 26 Q 8 24, 10 22" fill={wrapAccent} opacity={0.8} />
            <ellipse cx="0" cy="23" rx="2.5" ry="2" fill={wrapAccent} opacity={0.95} />
            <path d="M -2 25 Q -6 38, -10 50" stroke={wrapAccent} strokeWidth={1.4} fill="none" opacity={0.7} strokeLinecap="round" />
            <path d="M 2 25 Q 5 36, 8 48" stroke={wrapAccent} strokeWidth={1.4} fill="none" opacity={0.7} strokeLinecap="round" />
          </>
        );
      case "cone":
        return (
          <>
            <path d="M -42 10 L 0 70 L 42 10 Q 30 14, 0 16 Q -30 14, -42 10 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.95} />
            <path d="M -28 12 L 0 60 L 28 12 Q 14 16, 0 17 Q -14 16, -28 12 Z" fill={wrapAccent} opacity={0.18} />
            <path d="M -34 11 L -2 65" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.3} />
            <path d="M 34 11 L 2 65" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.3} />
            <path d="M -42 10 Q -30 4, -16 8 Q 0 2, 16 8 Q 30 4, 42 10"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.6} opacity={0.9} />
            <ellipse cx="0" cy="56" rx="8" ry="2.5" fill={wrapAccent} opacity={0.85} />
            <path d="M -3 57 Q -5 64, -7 70" stroke={wrapAccent} strokeWidth={1.2} fill="none" opacity={0.6} />
            <path d="M 3 57 Q 5 64, 7 70" stroke={wrapAccent} strokeWidth={1.2} fill="none" opacity={0.6} />
          </>
        );
      case "kraft":
        return (
          <>
            <path d="M -42 10 Q -46 28, -38 48 L -24 68 L 24 68 L 38 48 Q 46 28, 42 10 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.2} opacity={0.95} />
            <path d="M -38 16 Q 0 14, 38 16" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.12} />
            <path d="M -40 26 Q 0 24, 40 26" stroke={wrapAccent} strokeWidth={0.4} fill="none" opacity={0.1} />
            <path d="M -36 38 Q 0 36, 36 38" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.08} />
            <path d="M -42 10 Q -34 4, -24 8 Q -14 2, -4 8 Q 6 2, 16 8 Q 26 4, 36 8 Q 42 5, 42 10"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.6} opacity={0.9} />
            <path d="M -30 18 Q 0 14, 30 18" stroke="#8B7355" strokeWidth={1.5} fill="none" opacity={0.6} strokeLinecap="round" />
            <circle cx="0" cy="16" r="2.5" fill="#7A6A50" opacity={0.6} />
            <path d="M -1 18 Q -5 26, -8 32" stroke="#8B7355" strokeWidth={0.8} fill="none" opacity={0.35} />
            <path d="M 1 18 Q 4 24, 6 30" stroke="#8B7355" strokeWidth={0.8} fill="none" opacity={0.35} />
          </>
        );
      case "tissue":
        return (
          <>
            <path d="M -44 8 Q -40 -2, -32 2 Q -28 8, -22 0 Q -16 -4, -10 4" fill={wrapColor} opacity={0.3} />
            <path d="M -14 6 Q -8 -2, -2 2 Q 4 -4, 10 2 Q 14 -2, 20 4" fill={wrapColor} opacity={0.25} />
            <path d="M 16 6 Q 22 -2, 28 2 Q 32 -4, 38 2 Q 42 -1, 44 8" fill={wrapColor} opacity={0.3} />
            <path d="M -40 10 Q -44 28, -30 50 L -18 66 L 18 66 L 30 50 Q 44 28, 40 10 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.4} opacity={0.75} />
            <rect x="-32" y="14" width="64" height="6" rx="2.5" fill={wrapAccent} opacity={0.65} />
            <path d="M -8 17 Q -18 8, -7 6 Q -2 14, -8 17" fill={wrapAccent} opacity={0.75} />
            <path d="M 8 17 Q 18 8, 7 6 Q 2 14, 8 17" fill={wrapAccent} opacity={0.75} />
            <ellipse cx="0" cy="17" rx="3" ry="2.5" fill={wrapAccent} opacity={0.85} />
          </>
        );
      case "burlap":
        return (
          <>
            <path d="M -38 10 Q -42 28, -32 48 L -20 66 L 20 66 L 32 48 Q 42 28, 38 10 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={2} opacity={0.92} />
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="-36" y1={12 + i * 5.5} x2="36" y2={12 + i * 5.5}
                stroke={wrapAccent} strokeWidth={0.4} opacity={0.15} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`v-${i}`} x1={-30 + i * 8} y1="12" x2={-28 + i * 8} y2="62"
                stroke={wrapAccent} strokeWidth={0.3} opacity={0.1} />
            ))}
            <path d="M -38 10 Q -30 6, -22 8 Q -12 4, -2 8 Q 8 4, 18 8 Q 28 6, 38 10"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.85} />
            <path d="M -28 16 Q 0 12, 28 16" stroke="#7A6A50" strokeWidth={1.5} fill="none" opacity={0.5} />
            <circle cx="0" cy="14" r="2.5" fill="#7A6A50" opacity={0.45} />
          </>
        );
      case "vase":
        return (
          <>
            <ellipse cx="0" cy="8" rx="22" ry="5" fill={wrapColor} stroke={wrapAccent} strokeWidth={0.8} opacity={0.65} />
            <path d="M -22 8 Q -26 25, -24 40 Q -22 52, -14 60 Q -6 66, 0 68 Q 6 66, 14 60 Q 22 52, 24 40 Q 26 25, 22 8"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.4} />
            <path d="M -23 22 Q -8 20, 0 21 Q 8 20, 23 22 L 24 40 Q 22 52, 14 60 Q 6 66, 0 68 Q -6 66, -14 60 Q -22 52, -24 40 Z"
              fill="#B8D8E8" opacity={0.12} />
            <path d="M -17 12 Q -19 25, -17 42 Q -15 50, -12 55"
              stroke="white" strokeWidth={2.5} opacity={0.18} fill="none" strokeLinecap="round" />
            <ellipse cx="0" cy="8" rx="18" ry="3.5" fill="none" stroke={wrapAccent} strokeWidth={0.4} opacity={0.25} />
            <ellipse cx="0" cy="68" rx="10" ry="3" fill={wrapAccent} opacity={0.2} />
          </>
        );
      default: // paper
        return (
          <>
            <path d="M -40 10 Q -46 28, -34 50 L -22 68 L 22 68 L 34 50 Q 46 28, 40 10 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.92} />
            <path d="M -18 12 Q -20 28, -16 48" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.18} />
            <path d="M 18 12 Q 20 28, 16 48" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.18} />
            <path d="M 0 10 Q -1 28, 0 52" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.12} />
            <path d="M -40 10 Q -34 4, -26 8 Q -18 2, -10 7 Q -2 2, 6 7 Q 14 2, 22 7 Q 30 4, 38 8 Q 40 5, 40 10"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.6} opacity={0.88} />
            <rect x="-34" y="16" width="68" height="5.5" rx="2.5" fill={wrapAccent} opacity={0.6} />
            <path d="M -8 18 Q -16 10, -7 8 Q -2 16, -8 18" fill={wrapAccent} opacity={0.65} />
            <path d="M 8 18 Q 16 10, 7 8 Q 2 16, 8 18" fill={wrapAccent} opacity={0.65} />
            <circle cx="0" cy="18" r="2.5" fill={wrapAccent} opacity={0.75} />
            <path d="M -1 20 Q -4 28, -7 34" stroke={wrapAccent} strokeWidth={1.2} fill="none" opacity={0.35} />
            <path d="M 1 20 Q 4 26, 6 32" stroke={wrapAccent} strokeWidth={1.2} fill="none" opacity={0.35} />
          </>
        );
    }
  };

 const renderFlower = (f: FlowerPlacement, i: number) => {
  const FlowerComp = flowerComponents[f.type];
  const hasDepth = f.layer === "front" || f.layer === "mid";
  return (
    <g
      key={`${f.type}-${i}`}
      filter={hasDepth ? "url(#bloom-shadow)" : undefined}
      style={{
        transformOrigin: `${f.x}px ${f.y}px`,
        animation: animated ? `bloom-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both` : undefined,
        animationDelay: animated ? `${80 + i * 45}ms` : undefined,
      }}
    >
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
      role="img"
      aria-label="Your bouquet"
      shapeRendering={isPixel ? "crispEdges" : "auto"}
    >
      <defs>
        <filter id="wc-bleed" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" result="disp" />
          <feGaussianBlur in="disp" stdDeviation="0.6" />
        </filter>

        <filter id="bot-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="saturate" values="0.55" result="desat" />
          <feColorMatrix in="desat"
            values="0.85 0.05 0 0 0.02  0 0.82 0 0 0.04  0 0 0.7 0 0.02  0 0 0 1 0"
            result="muted" />
          <feMorphology in="muted" operator="dilate" radius="0.7" result="dilated" />
          <feColorMatrix in="dilated"
            values="0.18 0 0 0 0.04  0 0.18 0 0 0.06  0 0 0.18 0 0.03  0 0 0 1 0"
            result="ink" />
          <feComposite in="muted" in2="ink" operator="over" />
        </filter>
        <pattern id="bot-hatch" patternUnits="userSpaceOnUse" width="2.4" height="2.4" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="2.4" stroke="#2A2418" strokeWidth="0.3" opacity="0.7" />
        </pattern>
        <radialGradient id="bot-paper" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#F5EDD8" stopOpacity="0" />
          <stop offset="100%" stopColor="#C8B488" stopOpacity="0.18" />
        </radialGradient>

        <filter id="flat-poster" x="-5%" y="-5%" width="110%" height="110%">
          <feColorMatrix type="saturate" values="1.4" result="sat" />
          <feComponentTransfer in="sat">
            <feFuncR type="discrete" tableValues="0.15 0.5 0.78 0.95" />
            <feFuncG type="discrete" tableValues="0.25 0.58 0.82 0.95" />
            <feFuncB type="discrete" tableValues="0.15 0.5 0.78 0.95" />
          </feComponentTransfer>
        </filter>

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

        <filter id="bloom-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#00000018" />
        </filter>
      </defs>

      {isBotanical && (
        <rect x="-100" y="-100" width="200" height="200" fill="url(#bot-paper)" />
      )}

      <g
        filter={
          isWatercolour ? "url(#wc-bleed)"
          : isBotanical ? "url(#bot-ink)"
          : isFlat ? "url(#flat-poster)"
          : isPixel ? "url(#pixel-crunch)"
          : undefined
        }
      >
        {backLayerFlowers.map((f, i) => renderFlower(f, i))}

        {isBotanical && (
          <ellipse cx="0" cy="-40" rx="50" ry="40"
            fill="url(#bot-hatch)" opacity={0.35} pointerEvents="none" />
        )}

        <g transform={`translate(0 ${10 - 10 * wrapScale}) scale(${wrapScale})`}>
          {renderWrap()}
        </g>

        {midFrontFlowers.map((f, i) => renderFlower(f, i + backLayerFlowers.length))}
      </g>

      {/* Stems rendered outside filter — bright green unaffected by style filters */}
      {!hideStems && stemLength > 0 &&
        midFrontFlowers.map((f, i) => {
          const startY = f.y + 1 * f.scale;
          const UNIFIED_END_Y = 7;
          const wrapEndY = UNIFIED_END_Y * wrapScale;
          const maxLen = Math.max(0, wrapEndY - startY);
          const len = Math.max(0, maxLen * stemLength);
          if (len < 0.5) return null;
          const endY = startY + len;
          const controlX = f.x * 0.15;
          const controlY = (startY + endY) / 2 + 3;
          return (
            <path
              key={`stem-${f.type}-${f.x}-${f.y}-${i}`}
              d={`M ${f.x} ${startY} Q ${controlX} ${controlY} ${f.x * 0.25} ${endY}`}
              stroke="#6BA06B"
              strokeWidth={1 + 0.4 * f.scale}
              fill="none"
              opacity={0.8}
              strokeLinecap="round"
            />
          );
        })}

      {isPixel && (
        <rect x="-100" y="-100" width="200" height="200"
          fill="url(#pixel-scan)" pointerEvents="none" />
      )}
    </svg>
  );
};

export default BouquetCanvas;
