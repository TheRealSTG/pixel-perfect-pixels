import React from "react";
import type { WrapStyle } from "@/lib/bouquet-engine";

interface Props {
  wrapStyle: WrapStyle;
  wrapColor: string;
  wrapAccent: string;
}

/**
 * Single source of truth for all wrap SVG shapes.
 * Used by FloristStudio (interactive canvas) and can be imported
 * anywhere else that needs wrap rendering.
 *
 * Coordinate system: viewBox centred at 0,0.
 * Wrap top (mouth) at local y=10, bottom at ~y=68.
 * Caller is responsible for the transform that maps local y=10
 * to the desired global mouth position.
 */
const WrapRenderer: React.FC<Props> = ({ wrapStyle, wrapColor, wrapAccent }) => {
  switch (wrapStyle) {

    case "handtied":
      return (
        <>
          {/* Paper collar body */}
          <path d="M -16 10 Q -18 24, -15 38 Q -10 46, 0 48 Q 10 46, 15 38 Q 18 24, 16 10 Z"
            fill={wrapColor} opacity={0.58} />
          {/* Ribbon band */}
          <path d="M -18 14 Q 0 10, 18 14 L 19 24 Q 0 20, -19 24 Z"
            fill={wrapAccent} opacity={0.90} />
          <path d="M -18 14 Q 0 18, 18 14"
            stroke={wrapColor} strokeWidth={0.5} fill="none" opacity={0.45} />
          {/* Bow */}
          <path d="M -8 19 Q -20 11, -12 23 Q -7 21, -8 19" fill={wrapAccent} opacity={0.82} />
          <path d="M 8 19 Q 20 11, 12 23 Q 7 21, 8 19"  fill={wrapAccent} opacity={0.82} />
          <ellipse cx="0" cy="20" rx="2.2" ry="1.8" fill={wrapAccent} opacity={0.95} />
        </>
      );

    case "cone":
      return (
        <>
          <path d="M -42 10 L 0 70 L 42 10 Q 30 14, 0 16 Q -30 14, -42 10 Z"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.95} />
          <path d="M -28 12 L 0 58 L 28 12 Q 14 16, 0 17 Q -14 16, -28 12 Z"
            fill={wrapAccent} opacity={0.18} />
          <path d="M -34 11 L -2 65" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.28} />
          <path d="M 34 11 L 2 65"  stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.28} />
          <path d="M -42 10 Q -30 4, -16 8 Q 0 2, 16 8 Q 30 4, 42 10"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={0.6} opacity={0.9} />
          <ellipse cx="0" cy="54" rx="7" ry="2.2" fill={wrapAccent} opacity={0.80} />
        </>
      );

    case "kraft":
      return (
        <>
          <path d="M -40 10 Q -44 28, -36 50 L -22 68 L 22 68 L 36 50 Q 44 28, 40 10 Z"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={1.2} opacity={0.95} />
          <path d="M -40 10 Q -32 4, -22 8 Q -12 2, -2 7 Q 6 2, 16 7 Q 26 4, 34 8 Q 40 5, 40 10"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={0.6} opacity={0.9} />
          <path d="M -36 20 Q 0 18, 36 20" stroke={wrapAccent} strokeWidth={0.4} fill="none" opacity={0.12} />
          <path d="M -38 32 Q 0 30, 38 32" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.10} />
          <path d="M -28 16 Q 0 12, 28 16"
            stroke="#8B7355" strokeWidth={1.5} fill="none" opacity={0.6} strokeLinecap="round" />
          <circle cx="0" cy="14" r="2.4" fill="#7A6A50" opacity={0.6} />
        </>
      );

    case "tissue":
      return (
        <>
          <path d="M -44 8 Q -40 -2, -32 2 Q -28 8, -22 0 Q -16 -4, -10 4" fill={wrapColor} opacity={0.3} />
          <path d="M -14 6 Q -8 -2, -2 2 Q 4 -4, 10 2 Q 14 -2, 20 4"  fill={wrapColor} opacity={0.25} />
          <path d="M 16 6 Q 22 -2, 28 2 Q 32 -4, 38 2 Q 42 -1, 44 8"  fill={wrapColor} opacity={0.3} />
          <path d="M -40 10 Q -44 28, -30 50 L -18 66 L 18 66 L 30 50 Q 44 28, 40 10 Z"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={0.4} opacity={0.80} />
          <rect x="-32" y="14" width="64" height="6" rx="2.5" fill={wrapAccent} opacity={0.65} />
          <path d="M -8 17 Q -18 8, -7 6 Q -2 14, -8 17" fill={wrapAccent} opacity={0.75} />
          <path d="M 8 17 Q 18 8, 7 6 Q 2 14, 8 17"   fill={wrapAccent} opacity={0.75} />
          <ellipse cx="0" cy="17" rx="3" ry="2.5" fill={wrapAccent} opacity={0.88} />
        </>
      );

    case "burlap":
      return (
        <>
          <path d="M -38 10 Q -42 28, -32 48 L -20 66 L 20 66 L 32 48 Q 42 28, 38 10 Z"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={2} opacity={0.92} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h-${i}`} x1="-36" y1={12 + i * 5.5} x2="36" y2={12 + i * 5.5}
              stroke={wrapAccent} strokeWidth={0.4} opacity={0.15} />
          ))}
          <path d="M -38 10 Q -30 6, -22 8 Q -12 4, -2 8 Q 8 4, 18 8 Q 28 6, 38 10"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.85} />
          <path d="M -26 16 Q 0 12, 26 16"
            stroke="#7A6A50" strokeWidth={1.5} fill="none" opacity={0.5} />
        </>
      );

    case "vase":
      return (
        <>
          <ellipse cx="0" cy="8" rx="22" ry="5"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={0.8} opacity={0.65} />
          <path d="M -22 8 Q -26 25, -24 40 Q -22 52, -14 60 Q -6 66, 0 68 Q 6 66, 14 60 Q 22 52, 24 40 Q 26 25, 22 8"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.50} />
          <path d="M -23 22 Q -8 20, 0 21 Q 8 20, 23 22 L 24 40 Q 22 52, 14 60 Q 6 66, 0 68 Q -6 66, -14 60 Q -22 52, -24 40 Z"
            fill="#B8D8E8" opacity={0.20} />
          <path d="M -16 12 Q -18 26, -16 44"
            stroke="white" strokeWidth={2.5} opacity={0.22} fill="none" strokeLinecap="round" />
          <ellipse cx="0" cy="68" rx="10" ry="3" fill={wrapAccent} opacity={0.18} />
        </>
      );

    default: // paper
      return (
        <>
          <path d="M -40 10 Q -46 28, -34 50 L -22 68 L 22 68 L 34 50 Q 46 28, 40 10 Z"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.92} />
          <path d="M -16 12 Q -18 30, -14 50" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.18} />
          <path d="M 16 12 Q 18 30, 14 50"   stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.18} />
          <path d="M -40 10 Q -34 3, -26 7 Q -18 1, -9 6 Q 0 1, 9 6 Q 18 1, 26 7 Q 34 3, 40 10"
            fill={wrapColor} stroke={wrapAccent} strokeWidth={0.6} opacity={0.88} />
          <rect x="-34" y="16" width="68" height="5.5" rx="2.5" fill={wrapAccent} opacity={0.60} />
          <path d="M -8 18 Q -16 10, -7 8 Q -2 16, -8 18" fill={wrapAccent} opacity={0.65} />
          <path d="M 8 18 Q 16 10, 7 8 Q 2 16, 8 18"    fill={wrapAccent} opacity={0.65} />
          <circle cx="0" cy="18" r="2.5" fill={wrapAccent} opacity={0.75} />
        </>
      );
  }
};

export default WrapRenderer;
