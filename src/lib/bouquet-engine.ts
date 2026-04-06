import type { Occasion, Mood, ArtStyle } from "@/lib/bouquet-data";
import type { FlowerType } from "@/components/flowers/FlowerSVGs";

export type WrapStyle = "paper" | "kraft" | "tissue" | "burlap" | "vase";
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
  tissue: { color: "#F0E8F0", accent: "#E0D0E0", label: "Tissue Paper", emoji: "🎀" },
  burlap: { color: "#B8A080", accent: "#988060", label: "Burlap Wrap", emoji: "🧵" },
  vase: { color: "#D8E8E8", accent: "#B8D0D0", label: "Glass Vase", emoji: "🏺" },
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

// Which flowers can be tinted toward which colours
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
const moodPalettes: Record<string, { wrap: WrapStyle; bg: string }> = {
  "thinking-of-you": { wrap: "tissue", bg: "#F8F5F0" },
  "proud-of-you": { wrap: "kraft", bg: "#FDFAF0" },
  "missing-you": { wrap: "tissue", bg: "#F8F4F8" },
  "celebrating-you": { wrap: "paper", bg: "#FFF8F0" },
  "just-because": { wrap: "paper", bg: "#F8F6F0" },
  "love-you": { wrap: "tissue", bg: "#FFF5F5" },
};

// ─── Occasion → flower palettes (curated by florists) ───
// Each sub-array is a "palette group" — the engine picks one group per bouquet
// so all flowers harmonise (analogous, complementary, or monochromatic).
interface OccasionPalette {
  focal: FlowerType[];     // 2-3 hero flowers
  secondary: FlowerType[]; // supporting / texture
  greenery: FlowerType[];  // back-layer foliage
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

function pickNatural(rand: () => number, type: FlowerType, favouriteColour?: string): { color: string; accent: string } {
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

  return { color, accent };
}

// ─── Professional arrangement layout ────────────────────
// Uses a spiral + jitter approach for natural-looking density

export function composeBouquet(
  occasion: Occasion,
  mood: Mood,
  _artStyle: ArtStyle,
  recipientName: string,
  favouriteColour?: string
): BouquetComposition {
  const seed = recipientName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + 42;
  const rand = seededRandom(seed);

  const moodInfo = moodPalettes[mood] || moodPalettes["just-because"];
  const wrapStyle = moodInfo.wrap;
  const wrap = wrapStyles[wrapStyle];

  // Pick a curated palette for this occasion
  const palettes = occasionPalettes[occasion] || occasionPalettes["birthday"];
  const palette = palettes[Math.floor(rand() * palettes.length)];

  const flowers: FlowerPlacement[] = [];

  // === BACK LAYER: Greenery (wide arc, varied heights) ===
  const greenCount = 5 + Math.floor(rand() * 3); // 5-7
  for (let i = 0; i < greenCount; i++) {
    const angle = ((i / greenCount) * 260 - 130) * (Math.PI / 180);
    const radius = 38 + rand() * 35;
    const type = palette.greenery[Math.floor(rand() * palette.greenery.length)];
    const natural = pickNatural(rand, type);
    const heightJitter = rand() * 25;
    flowers.push({
      type,
      x: Math.sin(angle) * radius + (rand() - 0.5) * 12,
      y: -25 - heightJitter - rand() * 30 + Math.cos(angle) * radius * 0.15,
      scale: 0.7 + rand() * 1.0,
      rotation: (rand() - 0.5) * 70,
      color: natural.color,
      accentColor: natural.accent,
      delay: i * 0.06,
      layer: "back",
    });
  }

  // === MID LAYER: Secondary flowers (fill, texture) ===
  const secCount = 4 + Math.floor(rand() * 3); // 4-6
  for (let i = 0; i < secCount; i++) {
    const angle = ((i / secCount) * 220 - 110) * (Math.PI / 180);
    const radius = 22 + rand() * 28;
    const type = palette.secondary[i % palette.secondary.length];
    const natural = pickNatural(rand, type, favouriteColour);
    flowers.push({
      type,
      x: Math.sin(angle) * radius + (rand() - 0.5) * 10,
      y: -45 - rand() * 35 + Math.cos(angle) * radius * 0.15,
      scale: 0.65 + rand() * 0.55,
      rotation: (rand() - 0.5) * 45,
      color: natural.color,
      accentColor: natural.accent,
      delay: greenCount * 0.06 + i * 0.08,
      layer: "mid",
    });
  }

  // === FRONT LAYER: Focal flowers (hero, larger, prominent) ===
  const mainCount = 3 + Math.floor(rand() * 2); // 3-4
  // Arrange focals in a pleasing triangle / asymmetric cluster
  const focalPositions = [
    { ax: -0.4, ay: 0.8 },  // left high
    { ax: 0.3, ay: 0.6 },   // right high
    { ax: -0.1, ay: 0.4 },  // center-left
    { ax: 0.5, ay: 0.3 },   // right lower
    { ax: -0.5, ay: 0.5 },  // far left
  ];
  for (let i = 0; i < mainCount; i++) {
    const pos = focalPositions[i % focalPositions.length];
    const type = palette.focal[i % palette.focal.length];
    const natural = pickNatural(rand, type, favouriteColour);
    flowers.push({
      type,
      x: pos.ax * 55 + (rand() - 0.5) * 15,
      y: -55 - pos.ay * 55 - rand() * 15,
      scale: 1.2 + rand() * 0.8,
      rotation: (rand() - 0.5) * 28,
      color: natural.color,
      accentColor: natural.accent,
      delay: (greenCount + secCount) * 0.06 + i * 0.12,
      layer: "front",
    });
  }

  // === Filler: baby's breath sprinkled in mid-layer gaps ===
  const fillerCount = 3 + Math.floor(rand() * 2);
  for (let i = 0; i < fillerCount; i++) {
    const natural = pickNatural(rand, "babys_breath");
    flowers.push({
      type: "babys_breath",
      x: (rand() - 0.5) * 80,
      y: -35 - rand() * 30,
      scale: 0.4 + rand() * 0.5,
      rotation: (rand() - 0.5) * 60,
      color: natural.color,
      accentColor: natural.accent,
      delay: (greenCount + secCount + mainCount) * 0.06 + i * 0.08,
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
