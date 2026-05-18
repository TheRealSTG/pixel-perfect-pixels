import type { Occasion, Mood, ArtStyle } from "@/lib/bouquet-data";
import type { FlowerType } from "@/components/flowers/FlowerSVGs";

export type WrapStyle = "paper" | "kraft" | "tissue" | "burlap" | "vase" | "handtied" | "cone";
export type BouquetLayer = "back" | "mid" | "front";

export interface FlowerPlacement {
  type: FlowerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  accentColor: string;
  delay: number;
  layer: BouquetLayer;
}

export interface BouquetComposition {
  flowers: FlowerPlacement[];
  wrapColor: string;
  wrapAccent: string;
  backgroundColor: string;
  wrapStyle: WrapStyle;
}

// ─── Natural color ranges ────────────────────────────────
const naturalColorRanges: Record<FlowerType, { colors: string[]; accents: string[] }> = {
  rose: {
    colors: ["#E8A0B4", "#E06080", "#C84060", "#F5E1E8", "#E8D0D0", "#B03050", "#FFEEDD"],
    accents: ["#D4708A", "#C84060", "#A83050", "#E8C4D0", "#D4A0A0", "#8A2040", "#E8C8B0"],
  },
  peony: {
    colors: ["#F5E1E8", "#F0C8D8", "#E8A0B4", "#FFE0E8", "#F8D0D0", "#FFEEF5"],
    accents: ["#E8C4D0", "#D4A0B4", "#D4708A", "#E8B0B8", "#D8A8A8", "#E8C8D4"],
  },
  tulip: {
    colors: ["#E06080", "#C84060", "#F4C430", "#E8A040", "#E0E0E0", "#F0A0A0", "#B040A0"],
    accents: ["#C84060", "#A03040", "#D4A020", "#C88830", "#C8C8C8", "#D07070", "#903080"],
  },
  sunflower: {
    colors: ["#F4C430", "#F0D060", "#E8B830", "#F4D870"],
    accents: ["#E0A800", "#D4A020", "#C89020", "#D8C040"],
  },
  lavender: {
    colors: ["#9B7FBF", "#B090D0", "#8A70B0", "#A888C8"],
    accents: ["#7B5FA0", "#9070A0", "#6A5090", "#8868A8"],
  },
  eucalyptus: {
    colors: ["#7BAF7B", "#8BC08C", "#6A9E6A", "#90B890", "#A8C8A0"],
    accents: ["#5A8A5A", "#6BA06B", "#4A7A4A", "#78A870", "#88B880"],
  },
  daisy: {
    colors: ["#FFFFFF", "#FFF8F0", "#FFFDE8", "#F8F8F8"],
    accents: ["#F4D03F", "#E8C020", "#F0D860", "#E0B830"],
  },
  hyacinth: {
    colors: ["#7B68AE", "#9B88CE", "#6B58A0", "#A098D0", "#E8A0B4"],
    accents: ["#5B4890", "#7B68AE", "#4B3880", "#8078B0", "#D4708A"],
  },
  ranunculus: {
    colors: ["#F0A0A0", "#F0C878", "#F5E1E8", "#E8D090", "#FFB088", "#F0B0B0"],
    accents: ["#D07070", "#D8A858", "#E8C4D0", "#C8B070", "#E09068", "#D89090"],
  },
  cherry_blossom: {
    colors: ["#FFB7C5", "#FFD0D8", "#FFC8D0", "#FFE0E8"],
    accents: ["#E8899A", "#E8A0B0", "#D88090", "#E8B8C0"],
  },
  babys_breath: {
    colors: ["#FFFFFF", "#FFF8F4", "#F8F4F0", "#FFFEF8"],
    accents: ["#E8E0D8", "#F0E8E0", "#E0D8D0", "#E8E4E0"],
  },
  fern: {
    colors: ["#5A8A5A", "#6BA06B", "#4A7A4A", "#78A870"],
    accents: ["#3A6A3A", "#4A7A4A", "#2A5A2A", "#588858"],
  },
};

// ─── Wrap styles ─────────────────────────────────────────
export const wrapStyles: Record<WrapStyle, { color: string; accent: string; label: string; emoji: string }> = {
  paper: { color: "#E8DDD0", accent: "#D4C8B8", label: "Craft Paper", emoji: "📜" },
  kraft: { color: "#C4A882", accent: "#A88A68", label: "Kraft Paper", emoji: "📦" },
  tissue: { color: "#F0E8F0", accent: "#D4A0C0", label: "Tissue Paper", emoji: "🎀" },
  burlap: { color: "#B8A080", accent: "#988060", label: "Burlap Wrap", emoji: "🧵" },
  vase: { color: "#D8E8E8", accent: "#B8D0D0", label: "Glass Vase", emoji: "🏺" },
  handtied: { color: "#EFE6D8", accent: "#B89878", label: "Hand-Tied", emoji: "🎗️" },
  cone: { color: "#F4ECE0", accent: "#C8A878", label: "Cone Bouquet", emoji: "🌷" },
};

// ─── Color utilities ────────────────────────────────────
function blendColors(base: string, target: string, amount: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
  };
  const b = parse(base);
  const t = parse(target);
  const mix = b.map((c, i) => Math.round(c + (t[i] - c) * amount));
  return `#${mix.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

const colourNameToHex: Record<string, string> = {
  red: "#E04050", pink: "#E8A0B4", blue: "#6090D0", purple: "#9070B0",
  yellow: "#F4D040", orange: "#E8A040", green: "#70A870", white: "#F0EDE8",
  lavender: "#9B7FBF", coral: "#E07060", peach: "#F0B898",
};

const allowedTints: Record<FlowerType, string[]> = {
  rose: ["red", "pink", "white", "coral", "peach", "lavender"],
  peony: ["pink", "white", "peach", "coral"],
  tulip: ["red", "pink", "yellow", "orange", "purple", "white"],
  sunflower: ["yellow", "orange"],
  lavender: ["purple", "lavender"],
  eucalyptus: ["green"],
  daisy: ["white", "yellow"],
  hyacinth: ["purple", "lavender", "pink", "blue"],
  ranunculus: ["red", "pink", "yellow", "orange", "peach", "coral", "white"],
  cherry_blossom: ["pink", "white"],
  babys_breath: ["white"],
  fern: ["green"],
};

// ─── Mood palettes ──────────────────────────────────────
// Mood influences wrap style, background, color tint, and saturation.
const moodPalettes: Record<string, { wrap: WrapStyle; bg: string; tint?: string; tintAmount: number }> = {
  "thinking-of-you": { wrap: "handtied", bg: "#F4F1EA", tint: "#9B7FBF", tintAmount: 0.12 },
  "proud-of-you":    { wrap: "kraft",    bg: "#FDFAF0", tint: "#F4C430", tintAmount: 0.15 },
  "missing-you":     { wrap: "tissue",   bg: "#F8F4F8", tint: "#7B68AE", tintAmount: 0.18 },
  "celebrating-you": { wrap: "cone",     bg: "#FFF8F0", tint: "#E8A040", tintAmount: 0.12 },
  "just-because":    { wrap: "handtied", bg: "#F8F6F0", tintAmount: 0 },
  "love-you":        { wrap: "tissue",   bg: "#FFF5F5", tint: "#E04050", tintAmount: 0.18 },
};

// ─── Occasion → flower palettes (curated) ───
interface OccasionPalette {
  focal: FlowerType[];
  secondary: FlowerType[];
  greenery: FlowerType[];
}

const occasionPalettes: Record<string, OccasionPalette[]> = {
  birthday: [
    { focal: ["rose", "ranunculus"], secondary: ["daisy", "tulip"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["sunflower", "ranunculus"], secondary: ["daisy", "cherry_blossom"], greenery: ["fern", "babys_breath"] },
    { focal: ["tulip", "peony"], secondary: ["hyacinth", "daisy"], greenery: ["eucalyptus", "fern"] },
  ],
  anniversary: [
    { focal: ["rose", "peony"], secondary: ["ranunculus", "cherry_blossom"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["peony", "ranunculus"], secondary: ["rose", "lavender"], greenery: ["fern", "babys_breath"] },
  ],
  "just-because": [
    { focal: ["sunflower", "daisy"], secondary: ["lavender", "cherry_blossom"], greenery: ["eucalyptus", "fern"] },
    { focal: ["cherry_blossom", "ranunculus"], secondary: ["daisy", "babys_breath"], greenery: ["eucalyptus", "fern"] },
  ],
  "thank-you": [
    { focal: ["tulip", "peony"], secondary: ["daisy", "ranunculus"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["rose", "daisy"], secondary: ["lavender", "cherry_blossom"], greenery: ["fern", "babys_breath"] },
  ],
  "get-well": [
    { focal: ["sunflower", "daisy"], secondary: ["lavender", "cherry_blossom"], greenery: ["eucalyptus", "fern"] },
    { focal: ["daisy", "cherry_blossom"], secondary: ["lavender", "ranunculus"], greenery: ["babys_breath", "eucalyptus"] },
  ],
  congratulations: [
    { focal: ["rose", "sunflower"], secondary: ["tulip", "hyacinth"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["peony", "ranunculus"], secondary: ["tulip", "daisy"], greenery: ["fern", "babys_breath"] },
  ],
  diwali: [
    { focal: ["rose", "sunflower"], secondary: ["ranunculus", "hyacinth"], greenery: ["eucalyptus", "fern"] },
  ],
  "mothers-day": [
    { focal: ["peony", "rose"], secondary: ["tulip", "cherry_blossom"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["rose", "ranunculus"], secondary: ["peony", "lavender"], greenery: ["fern", "babys_breath"] },
  ],
};

// ─── Seeded RNG ─────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function pickNatural(
  rand: () => number,
  type: FlowerType,
  favouriteColour?: string,
  moodTint?: { color: string; amount: number }
): { color: string; accent: string } {
  const range = naturalColorRanges[type];
  const idx = Math.floor(rand() * range.colors.length);
  let color = range.colors[idx];
  let accent = range.accents[idx % range.accents.length];

  if (favouriteColour) {
    const hex = colourNameToHex[favouriteColour.toLowerCase()];
    if (hex && allowedTints[type]?.includes(favouriteColour.toLowerCase())) {
      color = blendColors(color, hex, 0.25);
      accent = blendColors(accent, hex, 0.15);
    }
  }

  // Mood tint applies subtly to non-greenery so the whole bouquet shares a vibe.
  if (moodTint && moodTint.amount > 0 && type !== "eucalyptus" && type !== "fern") {
    color = blendColors(color, moodTint.color, moodTint.amount);
    accent = blendColors(accent, moodTint.color, moodTint.amount * 0.6);
  }

  return { color, accent };
}

// ─── Silhouette ─────────────────────────────────────────
// The bouquet silhouette is a teardrop: narrow at the very top (y≈-78),
// widest at the crown (y≈-40), and narrowing again toward the wrap mouth
// (y≈-10). Returns the half-width allowed at a given y.
function silhouetteHalfWidth(y: number): number {
  // y range [-78 .. -10]. Normalize to t∈[0..1] where 0=top, 1=mouth.
  const t = Math.max(0, Math.min(1, (-10 - y) / 68)); // 0 at mouth, 1 at top
  // Bell-ish profile: widest near t=0.45 (crown), narrower at extremes.
  // half-width(t) ≈ 46 * sin(π * (0.15 + 0.75*t))  — empirically tuned:
  //   t=0.00 (mouth): ~38
  //   t=0.45 (crown): ~46
  //   t=1.00 (top):   ~28
  if (t <= 0.45) {
    // mouth → crown
    const k = t / 0.45;
    return 38 + (46 - 38) * k;
  }
  const k = (t - 0.45) / 0.55;
  return 46 - (46 - 28) * k;
}

// Scale-aware clamp into the silhouette. `bloomRadius` is how far the painted
// petals extend from center; we inset by it so the visible bloom stays inside.
function silhouetteClamp(x: number, y: number, scale: number): { x: number; y: number } {
  const yClamped = Math.max(-78, Math.min(-10, y));
  const bloomRadius = 6 * scale;
  const halfW = Math.max(4, silhouetteHalfWidth(yClamped) - bloomRadius);
  const xClamped = Math.max(-halfW, Math.min(halfW, x));
  return { x: xClamped, y: yClamped };
}

// ─── Collision-aware placement ──────────────────────────
// Returns adjusted position ensuring flowers don't fully overlap.
// minDist is scaled by the average of both flowers' scales.
function nudgeAway(
  x: number, y: number, scale: number,
  placed: { x: number; y: number; scale: number }[],
  minDist: number, rand: () => number
): { x: number; y: number } {
  let nx = x, ny = y;
  for (let pass = 0; pass < 3; pass++) {
    for (const p of placed) {
      const dx = nx - p.x;
      const dy = ny - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = minDist * ((scale + p.scale) / 2);
      if (dist < threshold && dist > 0.01) {
        const angle = Math.atan2(dy, dx);
        const push = (threshold - dist) * 0.7;
        nx += Math.cos(angle) * push;
        ny += Math.sin(angle) * push;
      } else if (dist <= 0.01) {
        // Flowers at exact same spot — push in random direction
        const angle = rand() * Math.PI * 2;
        nx += Math.cos(angle) * minDist * 0.5;
        ny += Math.sin(angle) * minDist * 0.5;
      }
    }
  }
  return { x: nx, y: ny };
}

// ─── Compose bouquet ────────────────────────────────────
// The canvas viewBox centers on 0,0. Wrap top is at y≈10.
// Flowers sit above the wrap (negative y) with stems going down into the wrap.
// A flower at y=-10 has its bloom at y=-10 and stem reaching into the wrap.

export function composeBouquet(
  occasion: Occasion,
  mood: Mood,
  _artStyle: ArtStyle,
  recipientName: string,
  favouriteColour?: string,
  city?: string,
  options?: { variant?: number; flowerDensity?: number; greeneryDensity?: number }
): BouquetComposition {
  const hashStr = (s: string) => s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const variant = options?.variant ?? 0;
  const flowerDensity = Math.max(0.3, Math.min(2, options?.flowerDensity ?? 1));
  const greeneryDensity = Math.max(0.3, Math.min(2, options?.greeneryDensity ?? 1));
  const seed =
    hashStr(recipientName) * 31 +
    hashStr(occasion) * 17 +
    hashStr(mood) * 7 +
    hashStr(city || "") * 3 +
    variant * 9973 +
    42;
  const rand = seededRandom(seed);

  const moodInfo = moodPalettes[mood] || moodPalettes["just-because"];
  const wrapStyle = moodInfo.wrap;
  const wrap = wrapStyles[wrapStyle];
  const moodTint = moodInfo.tint ? { color: moodInfo.tint, amount: moodInfo.tintAmount } : undefined;

  const palettes = occasionPalettes[occasion] || occasionPalettes["birthday"];
  const palette = palettes[Math.floor(rand() * palettes.length)];

  const flowers: FlowerPlacement[] = [];
  const placed: { x: number; y: number; scale: number }[] = [];

  // Settle helper: run collision avoidance, clamp into silhouette, repeat once
  // so the clamp doesn't push a bloom back into a neighbour.
  const settle = (x: number, y: number, scale: number, minDist: number) => {
    let p = nudgeAway(x, y, scale, placed, minDist, rand);
    p = silhouetteClamp(p.x, p.y, scale);
    p = nudgeAway(p.x, p.y, scale, placed, minDist * 0.85, rand);
    return silhouetteClamp(p.x, p.y, scale);
  };

  // === BACK LAYER: Greenery — fans wide behind, framing the bouquet ===
  const greenCount = Math.max(3, Math.round((9 + Math.floor(rand() * 3)) * greeneryDensity));
  for (let i = 0; i < greenCount; i++) {
    const t = i / Math.max(1, greenCount - 1); // 0→1, left→right
    const edgeFactor = Math.abs(t - 0.5) * 2;  // 0 center, 1 edge
    const type = palette.greenery[i % palette.greenery.length];
    const natural = pickNatural(rand, type);
    // Greenery hugs the silhouette: position halfway between center and edge
    // (instead of always at the rim) and shrinks toward the edge so leaves
    // stop poking outside the wrap.
    const yPos = -26 - edgeFactor * 30 - rand() * 4;
    const halfW = silhouetteHalfWidth(yPos);
    const spreadX = (t * 2 - 1) * halfW * 0.78 + (rand() - 0.5) * 4;
    const scale = (1.25 + rand() * 0.35) * (1 - 0.18 * edgeFactor);
    const rotation = (t - 0.5) * 55 + (rand() - 0.5) * 10;
    const pos = silhouetteClamp(spreadX, yPos, scale);
    flowers.push({
      type, x: pos.x, y: pos.y, scale, rotation,
      color: natural.color, accentColor: natural.accent,
      delay: i * 0.03, layer: "back",
    });
  }

  // === MID LAYER: Secondary flowers — golden-angle spiral around crown ===
  const secCount = Math.max(2, Math.round((7 + Math.floor(rand() * 3)) * flowerDensity));
  const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // ≈137.5°
  const spiralAngle0 = rand() * Math.PI * 2;
  for (let i = 0; i < secCount; i++) {
    const angle = spiralAngle0 + i * GOLDEN;
    const radius = 8 + Math.sqrt(i + 1) * 7.5; // tight in center, opens outward
    const rawX = Math.cos(angle) * radius;
    const rawY = -38 + Math.sin(angle) * radius * 0.5;
    const baseScale = 1.1 + rand() * 0.35;
    // Edge-falloff: smaller scale near the silhouette edge so big blooms
    // never hang off the side.
    const halfWHere = silhouetteHalfWidth(rawY);
    const edgeFactor = Math.min(1, Math.abs(rawX) / halfWHere);
    const scale = baseScale * (1 - 0.3 * edgeFactor);
    const type = palette.secondary[i % palette.secondary.length];
    const natural = pickNatural(rand, type, favouriteColour, moodTint);
    const pos = settle(rawX, rawY, scale, 16);
    placed.push({ x: pos.x, y: pos.y, scale });
    // Bias rotation outward from center for a natural radiating fan; cap jitter.
    const outwardTilt = Math.sign(pos.x) * Math.min(8, Math.abs(pos.x) * 0.25);
    flowers.push({
      type, x: pos.x, y: pos.y, scale,
      rotation: outwardTilt + (rand() - 0.5) * 8,
      color: natural.color, accentColor: natural.accent,
      delay: greenCount * 0.03 + i * 0.05, layer: "mid",
    });
  }

  // === FRONT LAYER: Focal flowers — strict triangular dome ===
  // 3 anchors form the dome; optional 4th tucks into the crown.
  const focalCount = Math.max(3, Math.min(5, Math.round((3 + (rand() < 0.5 ? 0 : 1)) * flowerDensity)));
  const variantJitter = ((variant % 7) - 3) * 0.6; // deterministic per-variant offset
  const focalPositions = [
    { x: 0 + variantJitter, y: -56 },           // crown apex
    { x: -22 - variantJitter * 0.5, y: -38 },   // lower-left
    { x: 22 + variantJitter * 0.5, y: -40 },    // lower-right
    { x: -6 + variantJitter * 0.4, y: -46 },    // upper-left tuck
    { x: 8 - variantJitter * 0.4, y: -50 },     // upper-right tuck
  ];
  for (let i = 0; i < focalCount; i++) {
    const base = focalPositions[i];
    const type = palette.focal[i % palette.focal.length];
    const natural = pickNatural(rand, type, favouriteColour, moodTint);
    const baseScale = 1.7 + rand() * 0.35;
    // Center-largest, edges-smaller scale curve.
    const edgeFactor = Math.min(1, Math.abs(base.x) / silhouetteHalfWidth(base.y));
    const scale = baseScale * (1 - 0.22 * edgeFactor);
    const pos = settle(base.x, base.y, scale, 22);
    placed.push({ x: pos.x, y: pos.y, scale });
    const outwardTilt = Math.sign(pos.x) * Math.min(6, Math.abs(pos.x) * 0.18);
    flowers.push({
      type, x: pos.x, y: pos.y, scale,
      rotation: outwardTilt + (rand() - 0.5) * 5,
      color: natural.color, accentColor: natural.accent,
      delay: (greenCount + secCount) * 0.03 + i * 0.08, layer: "front",
    });
  }

  // === Filler: baby's breath in gaps — silhouette-aware ===
  const fillerCount = Math.max(2, Math.round((8 + Math.floor(rand() * 3)) * greeneryDensity));
  for (let i = 0; i < fillerCount; i++) {
    const natural = pickNatural(rand, "babys_breath", undefined, moodTint);
    const rawY = -18 - rand() * 50;
    const halfWHere = silhouetteHalfWidth(rawY);
    const rawX = (rand() - 0.5) * 2 * halfWHere * 0.9;
    const scale = 0.55 + rand() * 0.4;
    const pos = settle(rawX, rawY, scale, 8);
    flowers.push({
      type: "babys_breath",
      x: pos.x, y: pos.y, scale,
      rotation: (rand() - 0.5) * 30,
      color: natural.color, accentColor: natural.accent,
      delay: (greenCount + secCount + focalCount) * 0.03 + i * 0.04,
      layer: "mid",
    });
  }

  return {
    flowers,
    wrapColor: wrap.color,
    wrapAccent: wrap.accent,
    backgroundColor: moodInfo.bg,
    wrapStyle,
  };
}
