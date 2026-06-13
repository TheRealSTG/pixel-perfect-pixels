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
    colors: ["#E8A0B4", "#E06080", "#C84060", "#F5E1E8", "#B03050", "#FFEEDD"],
    accents: ["#D4708A", "#C84060", "#A83050", "#E8C4D0", "#8A2040", "#E8C8B0"],
  },
  peony: {
    colors: ["#F5E1E8", "#F0C8D8", "#E8A0B4", "#FFE0E8", "#F8D0D0"],
    accents: ["#E8C4D0", "#D4A0B4", "#D4708A", "#E8B0B8", "#D8A8A8"],
  },
  tulip: {
    colors: ["#E06080", "#C84060", "#F4C430", "#E8A040", "#B040A0"],
    accents: ["#C84060", "#A03040", "#D4A020", "#C88830", "#903080"],
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
    colors: ["#F0A0A0", "#F0C878", "#F5E1E8", "#E8D090", "#FFB088"],
    accents: ["#D07070", "#D8A858", "#E8C4D0", "#C8B070", "#E09068"],
  },
  cherry_blossom: {
    colors: ["#FFB7C5", "#FFD0D8", "#FFC8D0", "#FFE0E8"],
    accents: ["#E8899A", "#E8A0B0", "#D88090", "#E8B8C0"],
  },
  babys_breath: {
    colors: ["#FFFFFF", "#FFF8F4", "#F8F4F0"],
    accents: ["#E8E0D8", "#F0E8E0", "#E0D8D0"],
  },
  fern: {
    colors: ["#5A8A5A", "#6BA06B", "#4A7A4A", "#78A870"],
    accents: ["#3A6A3A", "#4A7A4A", "#2A5A2A", "#588858"],
  },
};

// ─── Wrap styles ─────────────────────────────────────────
export const wrapStyles: Record<WrapStyle, { color: string; accent: string; label: string; emoji: string }> = {
  paper:    { color: "#E8DDD0", accent: "#D4C8B8", label: "Craft Paper", emoji: "📜" },
  kraft:    { color: "#C4A882", accent: "#A88A68", label: "Kraft Paper", emoji: "📦" },
  tissue:   { color: "#F0E8F0", accent: "#D4A0C0", label: "Tissue Paper", emoji: "🎀" },
  burlap:   { color: "#B8A080", accent: "#988060", label: "Burlap Wrap",  emoji: "🧵" },
  vase:     { color: "#D8E8E8", accent: "#B8D0D0", label: "Glass Vase",   emoji: "🏺" },
  handtied: { color: "#EFE6D8", accent: "#B89878", label: "Hand-Tied",    emoji: "🎗️" },
  cone:     { color: "#F4ECE0", accent: "#C8A878", label: "Cone Bouquet", emoji: "🌷" },
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
  rose:          ["red", "pink", "white", "coral", "peach", "lavender"],
  peony:         ["pink", "white", "peach", "coral"],
  tulip:         ["red", "pink", "yellow", "orange", "purple", "white"],
  sunflower:     ["yellow", "orange"],
  lavender:      ["purple", "lavender"],
  eucalyptus:    ["green"],
  daisy:         ["white", "yellow"],
  hyacinth:      ["purple", "lavender", "pink", "blue"],
  ranunculus:    ["red", "pink", "yellow", "orange", "peach", "coral", "white"],
  cherry_blossom:["pink", "white"],
  babys_breath:  ["white"],
  fern:          ["green"],
};

// ─── Mood palettes ──────────────────────────────────────
const moodPalettes: Record<string, { wrap: WrapStyle; bg: string; tint?: string; tintAmount: number }> = {
  "thinking-of-you": { wrap: "handtied", bg: "#F4F1EA", tint: "#9B7FBF", tintAmount: 0.10 },
  "proud-of-you":    { wrap: "kraft",    bg: "#FDFAF0", tint: "#F4C430", tintAmount: 0.12 },
  "missing-you":     { wrap: "tissue",   bg: "#F8F4F8", tint: "#7B68AE", tintAmount: 0.14 },
  "celebrating-you": { wrap: "cone",     bg: "#FFF8F0", tint: "#E8A040", tintAmount: 0.10 },
  "just-because":    { wrap: "handtied", bg: "#F8F6F0", tintAmount: 0 },
  "love-you":        { wrap: "tissue",   bg: "#FFF5F5", tint: "#E04050", tintAmount: 0.14 },
};

// ─── Occasion → flower palettes ─────────────────────────
// Each palette has exactly the right variety for a real florist bouquet:
// 2 focal types, 2 secondary types, 2 greenery types
interface OccasionPalette {
  focal: FlowerType[];
  secondary: FlowerType[];
  greenery: FlowerType[];
}

const occasionPalettes: Record<string, OccasionPalette[]> = {
  birthday: [
    { focal: ["rose", "ranunculus"],    secondary: ["daisy", "cherry_blossom"],  greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["sunflower", "tulip"],    secondary: ["daisy", "lavender"],        greenery: ["fern", "babys_breath"] },
    { focal: ["peony", "ranunculus"],   secondary: ["cherry_blossom", "daisy"],  greenery: ["eucalyptus", "fern"] },
  ],
  anniversary: [
    { focal: ["rose", "peony"],         secondary: ["ranunculus", "cherry_blossom"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["peony", "ranunculus"],   secondary: ["rose", "lavender"],             greenery: ["fern", "babys_breath"] },
  ],
  "just-because": [
    { focal: ["sunflower", "daisy"],    secondary: ["lavender", "cherry_blossom"], greenery: ["eucalyptus", "fern"] },
    { focal: ["tulip", "ranunculus"],   secondary: ["daisy", "babys_breath"],      greenery: ["eucalyptus", "fern"] },
  ],
  "thank-you": [
    { focal: ["tulip", "peony"],        secondary: ["daisy", "ranunculus"],       greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["rose", "cherry_blossom"],secondary: ["lavender", "daisy"],         greenery: ["fern", "babys_breath"] },
  ],
  "get-well": [
    { focal: ["sunflower", "daisy"],    secondary: ["lavender", "cherry_blossom"], greenery: ["eucalyptus", "fern"] },
    { focal: ["daisy", "tulip"],        secondary: ["lavender", "ranunculus"],     greenery: ["babys_breath", "eucalyptus"] },
  ],
  congratulations: [
    { focal: ["rose", "sunflower"],     secondary: ["tulip", "hyacinth"],   greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["peony", "ranunculus"],   secondary: ["tulip", "daisy"],      greenery: ["fern", "babys_breath"] },
  ],
  diwali: [
    { focal: ["rose", "sunflower"],     secondary: ["ranunculus", "hyacinth"], greenery: ["eucalyptus", "fern"] },
  ],
  "mothers-day": [
    { focal: ["peony", "rose"],         secondary: ["tulip", "cherry_blossom"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["rose", "ranunculus"],    secondary: ["peony", "lavender"],       greenery: ["fern", "babys_breath"] },
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
      color = blendColors(color, hex, 0.22);
      accent = blendColors(accent, hex, 0.14);
    }
  }
  if (moodTint && moodTint.amount > 0 && type !== "eucalyptus" && type !== "fern") {
    color = blendColors(color, moodTint.color, moodTint.amount);
    accent = blendColors(accent, moodTint.color, moodTint.amount * 0.6);
  }
  return { color, accent };
}

// ─── Silhouette ─────────────────────────────────────────
// Teardrop silhouette: narrow top, widest at crown, narrower at wrap mouth
function silhouetteHalfWidth(y: number): number {
  const t = Math.max(0, Math.min(1, (-10 - y) / 68));
  if (t <= 0.45) {
    const k = t / 0.45;
    return 32 + (42 - 32) * k;
  }
  const k = (t - 0.45) / 0.55;
  return 42 - (42 - 22) * k;
}

function silhouetteClamp(x: number, y: number, scale: number): { x: number; y: number } {
  const yClamped = Math.max(-78, Math.min(-10, y));
  const bloomRadius = 5 * scale;
  const halfW = Math.max(4, silhouetteHalfWidth(yClamped) - bloomRadius);
  const xClamped = Math.max(-halfW, Math.min(halfW, x));
  return { x: xClamped, y: yClamped };
}

// ─── Collision avoidance ─────────────────────────────────
function nudgeAway(
  x: number, y: number, scale: number,
  placed: { x: number; y: number; scale: number }[],
  minDist: number, rand: () => number
): { x: number; y: number } {
  let nx = x, ny = y;
  for (let pass = 0; pass < 3; pass++) {
    for (const p of placed) {
      const dx = nx - p.x, dy = ny - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = minDist * ((scale + p.scale) / 2);
      if (dist < threshold && dist > 0.01) {
        const angle = Math.atan2(dy, dx);
        const push = (threshold - dist) * 0.6;
        nx += Math.cos(angle) * push;
        ny += Math.sin(angle) * push;
      } else if (dist <= 0.01) {
        const angle = rand() * Math.PI * 2;
        nx += Math.cos(angle) * minDist * 0.4;
        ny += Math.sin(angle) * minDist * 0.4;
      }
    }
  }
  return { x: nx, y: ny };
}

// ─── Main composition function ───────────────────────────
export function composeBouquet(
  occasion: Occasion,
  mood: Mood,
  artStyle: ArtStyle,
  recipientName: string,
  favouriteColour?: string,
  city?: string,
  options?: { variant?: number; flowerDensity?: number; greeneryDensity?: number }
): BouquetComposition {
  const hashStr = (s: string) => s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const variant = options?.variant ?? 0;
  const flowerDensity = Math.max(0.5, Math.min(1.5, options?.flowerDensity ?? 1));
  const greeneryDensity = Math.max(0.5, Math.min(1.5, options?.greeneryDensity ?? 1));

  const seed =
    hashStr(recipientName) * 31 +
    hashStr(occasion) * 17 +
    hashStr(mood) * 7 +
    hashStr(city || "") * 3 +
    variant * 9973 +
    Math.round(flowerDensity * 100) * 131 +
    Math.round(greeneryDensity * 100) * 191 +
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

  const settle = (x: number, y: number, scale: number, minDist: number) => {
    let p = nudgeAway(x, y, scale, placed, minDist, rand);
    p = silhouetteClamp(p.x, p.y, scale);
    p = nudgeAway(p.x, p.y, scale, placed, minDist * 0.8, rand);
    return silhouetteClamp(p.x, p.y, scale);
  };

  // ═══════════════════════════════════════════════════════
  // BACK LAYER: Greenery — 4-6 pieces fanning behind
  // Real florists use greenery to frame, not fill
  // ═══════════════════════════════════════════════════════
  const greenCount = Math.round((4 + Math.floor(rand() * 2)) * greeneryDensity);
  for (let i = 0; i < greenCount; i++) {
    const t = i / Math.max(1, greenCount - 1);
    const edgeFactor = Math.abs(t - 0.5) * 2;
    const type = palette.greenery[i % palette.greenery.length];
    const natural = pickNatural(rand, type);
    const yPos = -28 - edgeFactor * 26 - rand() * 6;
    const halfW = silhouetteHalfWidth(yPos);
    const spreadX = (t * 2 - 1) * halfW * 0.82 + (rand() - 0.5) * 6;
    const scale = (1.3 + rand() * 0.35) * (1 - 0.15 * edgeFactor);
    const rotation = (t - 0.5) * 50 + (rand() - 0.5) * 12;
    const pos = silhouetteClamp(spreadX, yPos, scale);
    flowers.push({
      type, x: pos.x, y: pos.y, scale, rotation,
      color: natural.color, accentColor: natural.accent,
      delay: i * 0.04, layer: "back",
    });
  }

  // ═══════════════════════════════════════════════════════
  // FRONT LAYER: Focal flowers — exactly 3, triangular dome
  // The 3-flower triangle is the foundation of every florist bouquet
  // ═══════════════════════════════════════════════════════
  const variantJitter = ((variant % 7) - 3) * 0.8;
  // Three intentional positions: apex + two supporting anchors
  const focalPositions = [
    { x: variantJitter * 0.5,            y: -52 + (rand() - 0.5) * 4 },  // crown apex
    { x: -20 - variantJitter * 0.4,      y: -36 + (rand() - 0.5) * 4 },  // lower left
    { x: 20 + variantJitter * 0.4,       y: -38 + (rand() - 0.5) * 4 },  // lower right
  ];

  // Optional 4th focal if density is high
  const focalCount = flowerDensity >= 1.2 ? 4 : 3;
  if (focalCount === 4) {
    focalPositions.push({ x: (rand() - 0.5) * 12, y: -44 + (rand() - 0.5) * 4 });
  }

  for (let i = 0; i < focalCount; i++) {
    const base = focalPositions[i];
    // Alternate between the two focal flower types for natural variety
    const type = palette.focal[i % palette.focal.length];
    const natural = pickNatural(rand, type, favouriteColour, moodTint);
    const baseScale = 1.75 + rand() * 0.3;
    const edgeFactor = Math.min(1, Math.abs(base.x) / silhouetteHalfWidth(base.y));
    const scale = baseScale * (1 - 0.2 * edgeFactor);
    const pos = settle(base.x, base.y, scale, 20);
    placed.push({ x: pos.x, y: pos.y, scale });
    const outwardTilt = Math.sign(pos.x) * Math.min(6, Math.abs(pos.x) * 0.2);
    flowers.push({
      type, x: pos.x, y: pos.y, scale,
      rotation: outwardTilt + (rand() - 0.5) * 6,
      color: natural.color, accentColor: natural.accent,
      delay: (greenCount + i) * 0.05, layer: "front",
    });
  }

  // ═══════════════════════════════════════════════════════
  // MID LAYER: Secondary flowers — 4-6, filling between focal
  // Place in the natural gaps between the 3 focal positions
  // ═══════════════════════════════════════════════════════
  const secCount = Math.round((4 + Math.floor(rand() * 2)) * flowerDensity);

  // Natural gap positions between the focal triangle
  const gapPositions = [
    { x: -10 + rand() * 6,  y: -48 + rand() * 5 },  // upper left gap
    { x: 10 + rand() * 6,   y: -46 + rand() * 5 },  // upper right gap
    { x: -28 + rand() * 6,  y: -26 + rand() * 5 },  // far left
    { x: 28 + rand() * 6,   y: -28 + rand() * 5 },  // far right
    { x: -6 + rand() * 8,   y: -30 + rand() * 5 },  // center fill
    { x: 8 + rand() * 6,    y: -32 + rand() * 5 },  // center-right fill
  ];

  for (let i = 0; i < Math.min(secCount, gapPositions.length); i++) {
    const base = gapPositions[i];
    // Ensure variety: alternate between secondary types, avoid repeating focal types
    const type = palette.secondary[i % palette.secondary.length];
    const natural = pickNatural(rand, type, favouriteColour, moodTint);
    const baseScale = 1.15 + rand() * 0.3;
    const halfWHere = silhouetteHalfWidth(base.y);
    const edgeFactor = Math.min(1, Math.abs(base.x) / halfWHere);
    const scale = baseScale * (1 - 0.25 * edgeFactor);
    const pos = settle(base.x, base.y, scale, 14);
    placed.push({ x: pos.x, y: pos.y, scale });
    const outwardTilt = Math.sign(pos.x) * Math.min(8, Math.abs(pos.x) * 0.3);
    flowers.push({
      type, x: pos.x, y: pos.y, scale,
      rotation: outwardTilt + (rand() - 0.5) * 10,
      color: natural.color, accentColor: natural.accent,
      delay: (greenCount + focalCount + i) * 0.05, layer: "mid",
    });
  }

  // ═══════════════════════════════════════════════════════
  // FILLER: Baby's breath — 3-4 delicate wisps in gaps
  // Used sparingly as a light accent, not a dominant element
  // ═══════════════════════════════════════════════════════
  const fillerCount = Math.round((3 + Math.floor(rand() * 2)) * greeneryDensity);
  for (let i = 0; i < fillerCount; i++) {
    const natural = pickNatural(rand, "babys_breath", undefined, moodTint);
    const rawY = -20 - rand() * 40;
    const halfWHere = silhouetteHalfWidth(rawY);
    const rawX = (rand() - 0.5) * 2 * halfWHere * 0.85;
    const scale = 0.5 + rand() * 0.35;
    const pos = settle(rawX, rawY, scale, 7);
    flowers.push({
      type: "babys_breath",
      x: pos.x, y: pos.y, scale,
      rotation: (rand() - 0.5) * 25,
      color: natural.color, accentColor: natural.accent,
      delay: (greenCount + focalCount + secCount + i) * 0.04,
      layer: "mid",
    });
  }

  return {
    flowers: flowers.map((f) => ({
      ...f,
      ...applyStylePalette(f.color, f.accentColor, f.type, artStyle),
    })),
    wrapColor: wrap.color,
    wrapAccent: wrap.accent,
    backgroundColor: moodInfo.bg,
    wrapStyle,
  };
}

// ─── Per-style palette transforms ───────────────────────
function rgbToHsl(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0, hh = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hh = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) hh = ((b - r) / d + 2);
    else hh = ((r - g) / d + 4);
    hh *= 60;
  }
  return [hh, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hh = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function applyStylePalette(
  color: string, accent: string, _type: FlowerType, style: ArtStyle
): { color: string; accentColor: string } {
  const [h, s, l] = rgbToHsl(color);
  const [ah, as_, al] = rgbToHsl(accent);
  switch (style) {
    case "flat": {
      // Clean, vibrant — slight saturation boost, keep the gradients intact
      const c = hslToHex(h, Math.min(1, s * 1.2), Math.max(0.4, Math.min(0.65, l)));
      const a = hslToHex(ah, Math.min(1, as_ * 1.15), Math.max(0.28, Math.min(0.52, al)));
      return { color: c, accentColor: a };
    }
    case "botanical": {
      // Vintage print: desaturated, warm shift, darker accents
      const c = hslToHex(h + 8, s * 0.45, Math.max(0.38, l * 0.90));
      const a = hslToHex(ah + 5, as_ * 0.5, Math.max(0.20, al * 0.68));
      return { color: c, accentColor: a };
    }
    case "pixel": {
      const ph = Math.round(h / 30) * 30;
      const c = hslToHex(ph, Math.round(Math.min(1, s * 1.2) * 4) / 4, Math.round(l * 4) / 4);
      const a = hslToHex(ph, Math.round(Math.min(1, as_ * 1.2) * 4) / 4, Math.round(Math.max(0.2, al - 0.1) * 4) / 4);
      return { color: c, accentColor: a };
    }
    case "watercolour": {
  // Pale washes but still recognizable — don't go too light
  const c = hslToHex(h + 3, Math.min(0.55, s * 0.72), Math.min(0.82, l + 0.14));
  const a = hslToHex(ah + 3, Math.min(0.48, as_ * 0.65), Math.min(0.72, al + 0.10));
  return { color: c, accentColor: a };
}
    default:
      return { color, accentColor: accent };
  }
}
