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
    { focal: ["rose", "ranunculus"],    secondary: ["daisy", "tulip"],           greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["sunflower", "ranunculus"],secondary: ["daisy", "cherry_blossom"], greenery: ["fern", "babys_breath"] },
    { focal: ["tulip", "peony"],         secondary: ["hyacinth", "daisy"],       greenery: ["eucalyptus", "fern"] },
  ],
  anniversary: [
    { focal: ["rose", "peony"],       secondary: ["ranunculus", "cherry_blossom"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["peony", "ranunculus"], secondary: ["rose", "lavender"],             greenery: ["fern", "babys_breath"] },
  ],
  "just-because": [
    { focal: ["sunflower", "daisy"],       secondary: ["lavender", "cherry_blossom"], greenery: ["eucalyptus", "fern"] },
    { focal: ["cherry_blossom", "ranunculus"], secondary: ["daisy", "babys_breath"],  greenery: ["eucalyptus", "fern"] },
  ],
  "thank-you": [
    { focal: ["tulip", "peony"],  secondary: ["daisy", "ranunculus"],      greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["rose", "daisy"],   secondary: ["lavender", "cherry_blossom"], greenery: ["fern", "babys_breath"] },
  ],
  "get-well": [
    { focal: ["sunflower", "daisy"],      secondary: ["lavender", "cherry_blossom"],  greenery: ["eucalyptus", "fern"] },
    { focal: ["daisy", "cherry_blossom"], secondary: ["lavender", "ranunculus"],      greenery: ["babys_breath", "eucalyptus"] },
  ],
  congratulations: [
    { focal: ["rose", "sunflower"],   secondary: ["tulip", "hyacinth"],  greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["peony", "ranunculus"], secondary: ["tulip", "daisy"],     greenery: ["fern", "babys_breath"] },
  ],
  diwali: [
    { focal: ["rose", "sunflower"], secondary: ["ranunculus", "hyacinth"], greenery: ["eucalyptus", "fern"] },
  ],
  "mothers-day": [
    { focal: ["peony", "rose"],      secondary: ["tulip", "cherry_blossom"], greenery: ["eucalyptus", "babys_breath"] },
    { focal: ["rose", "ranunculus"], secondary: ["peony", "lavender"],       greenery: ["fern", "babys_breath"] },
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

  if (moodTint && moodTint.amount > 0 && type !== "eucalyptus" && type !== "fern") {
    color = blendColors(color, moodTint.color, moodTint.amount);
    accent = blendColors(accent, moodTint.color, moodTint.amount * 0.6);
  }

  return { color, accent };
}

// ─── Silhouette ─────────────────────────────────────────
function silhouetteHalfWidth(y: number): number {
  const t = Math.max(0, Math.min(1, (-10 - y) / 68));
  if (t <= 0.45) {
    const k = t / 0.45;
    return 38 + (46 - 38) * k;
  }
  const k = (t - 0.45) / 0.55;
  return 46 - (46 - 28) * k;
}

function silhouetteClamp(x: number, y: number, scale: number): { x: number; y: number } {
  const yClamped = Math.max(-78, Math.min(-10, y));
  const bloomRadius = 6 * scale;
  const halfW = Math.max(4, silhouetteHalfWidth(yClamped) - bloomRadius);
  const xClamped = Math.max(-halfW, Math.min(halfW, x));
  return { x: xClamped, y: yClamped };
}

// ─── Collision-aware placement ──────────────────────────
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
        const angle = rand() * Math.PI * 2;
        nx += Math.cos(angle) * minDist * 0.5;
        ny += Math.sin(angle) * minDist * 0.5;
      }
    }
  }
  return { x: nx, y: ny };
}

// ─── Compose bouquet ────────────────────────────────────
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
  const flowerDensity = Math.max(0.3, Math.min(2, options?.flowerDensity ?? 1));
  const greeneryDensity = Math.max(0.3, Math.min(2, options?.greeneryDensity ?? 1));
  const qF = Math.round(flowerDensity * 100);
  const qG = Math.round(greeneryDensity * 100);
  const seed =
    hashStr(recipientName) * 31 +
    hashStr(occasion) * 17 +
    hashStr(mood) * 7 +
    hashStr(city || "") * 3 +
    variant * 9973 +
    qF * 131 +
    qG * 191 +
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
    p = nudgeAway(p.x, p.y, scale, placed, minDist * 0.85, rand);
    return silhouetteClamp(p.x, p.y, scale);
  };

  // === BACK LAYER: Greenery ===
  const greenCount = Math.max(3, Math.round((9 + Math.floor(rand() * 3)) * greeneryDensity));
  for (let i = 0; i < greenCount; i++) {
    const t = i / Math.max(1, greenCount - 1);
    const edgeFactor = Math.abs(t - 0.5) * 2;
    const type = palette.greenery[i % palette.greenery.length];
    const natural = pickNatural(rand, type);
    const yPos = -26 - edgeFactor * 30 - rand() * 4;
    const halfW = silhouetteHalfWidth(yPos);
    const spreadX = (t * 2 - 1) * halfW * 0.78 + (rand() - 0.5) * 4;
    // ─── FIX 2: Larger greenery scale ───
    const scale = (1.65 + rand() * 0.45) * (1 - 0.18 * edgeFactor);
    const rotation = (t - 0.5) * 55 + (rand() - 0.5) * 10;
    const pos = silhouetteClamp(spreadX, yPos, scale);
    flowers.push({
      type, x: pos.x, y: pos.y, scale, rotation,
      color: natural.color, accentColor: natural.accent,
      delay: i * 0.03, layer: "back",
    });
  }

  // === MID LAYER: Secondary flowers — golden-angle spiral ===
  const secCount = Math.max(2, Math.round((7 + Math.floor(rand() * 3)) * flowerDensity));
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const spiralAngle0 = rand() * Math.PI * 2;
  for (let i = 0; i < secCount; i++) {
    const angle = spiralAngle0 + i * GOLDEN;
    const radius = 8 + Math.sqrt(i + 1) * 7.5;
    const rawX = Math.cos(angle) * radius;
    const rawY = -38 + Math.sin(angle) * radius * 0.5;
    // ─── FIX 2: Larger secondary scale ───
    const baseScale = 1.55 + rand() * 0.4;
    const halfWHere = silhouetteHalfWidth(rawY);
    const edgeFactor = Math.min(1, Math.abs(rawX) / halfWHere);
    const scale = baseScale * (1 - 0.3 * edgeFactor);
    const type = palette.secondary[i % palette.secondary.length];
    const natural = pickNatural(rand, type, favouriteColour, moodTint);
    const pos = settle(rawX, rawY, scale, 16);
    placed.push({ x: pos.x, y: pos.y, scale });
    const outwardTilt = Math.sign(pos.x) * Math.min(8, Math.abs(pos.x) * 0.25);
    flowers.push({
      type, x: pos.x, y: pos.y, scale,
      rotation: outwardTilt + (rand() - 0.5) * 8,
      color: natural.color, accentColor: natural.accent,
      delay: greenCount * 0.03 + i * 0.05, layer: "mid",
    });
  }

  // === FRONT LAYER: Focal flowers — triangular dome ===
  const focalCount = Math.max(3, Math.min(5, Math.round((3 + (rand() < 0.5 ? 0 : 1)) * flowerDensity)));
  const variantJitter = ((variant % 7) - 3) * 0.6;
  const focalPositions = [
    { x: 0 + variantJitter,            y: -56 },
    { x: -22 - variantJitter * 0.5,    y: -38 },
    { x: 22 + variantJitter * 0.5,     y: -40 },
    { x: -6 + variantJitter * 0.4,     y: -46 },
    { x: 8 - variantJitter * 0.4,      y: -50 },
  ];
  for (let i = 0; i < focalCount; i++) {
    const base = focalPositions[i];
    const type = palette.focal[i % palette.focal.length];
    const natural = pickNatural(rand, type, favouriteColour, moodTint);
    // ─── FIX 2: Larger focal scale ───
    const baseScale = 2.3 + rand() * 0.45;
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

  // === Filler: baby's breath ===
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

function quantize(v: number, steps: number) {
  return Math.round(v * steps) / steps;
}

function applyStylePalette(
  color: string,
  accent: string,
  _type: FlowerType,
  style: ArtStyle
): { color: string; accentColor: string } {
  const [h, s, l] = rgbToHsl(color);
  const [ah, as_, al] = rgbToHsl(accent);
  switch (style) {
    case "flat": {
      const c = hslToHex(h, Math.min(1, s * 1.35 + 0.1), Math.max(0.42, Math.min(0.62, l)));
      const a = hslToHex(ah, Math.min(1, as_ * 1.25 + 0.1), Math.max(0.3, Math.min(0.5, al)));
      return { color: c, accentColor: a };
    }
    case "botanical": {
      const c = hslToHex(h + 8, s * 0.45, Math.max(0.4, l * 0.92));
      const a = hslToHex(ah + 5, as_ * 0.5, Math.max(0.22, al * 0.7));
      return { color: c, accentColor: a };
    }
    case "pixel": {
      const ph = Math.round(h / 30) * 30;
      const c = hslToHex(ph, quantize(Math.min(1, s * 1.2), 4), quantize(l, 4));
      const a = hslToHex(ph, quantize(Math.min(1, as_ * 1.2), 4), quantize(Math.max(0.2, al - 0.1), 4));
      return { color: c, accentColor: a };
    }
    case "watercolour": {
      const c = hslToHex(h, Math.min(0.55, s * 0.7), Math.min(0.88, l + 0.18));
      const a = hslToHex(ah, Math.min(0.5, as_ * 0.65), Math.min(0.78, al + 0.12));
      return { color: c, accentColor: a };
    }
    default:
      return { color, accentColor: accent };
  }
}