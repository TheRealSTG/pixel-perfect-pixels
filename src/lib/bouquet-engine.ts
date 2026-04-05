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

// Natural color ranges per flower — no blue sunflowers!
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

// Wrap style definitions
export const wrapStyles: Record<WrapStyle, { color: string; accent: string; label: string; emoji: string }> = {
  paper: { color: "#E8DDD0", accent: "#D4C8B8", label: "Craft Paper", emoji: "📜" },
  kraft: { color: "#C4A882", accent: "#A88A68", label: "Kraft Paper", emoji: "📦" },
  tissue: { color: "#F0E8F0", accent: "#E0D0E0", label: "Tissue Paper", emoji: "🎀" },
  burlap: { color: "#B8A080", accent: "#988060", label: "Burlap Wrap", emoji: "🧵" },
  vase: { color: "#D8E8E8", accent: "#B8D0D0", label: "Glass Vase", emoji: "🏺" },
};

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

// Only blend toward favourite colour if it's within the flower's natural range
const colourNameToHex: Record<string, string> = {
  red: "#E04050", pink: "#E8A0B4", blue: "#6090D0", purple: "#9070B0",
  yellow: "#F4D040", orange: "#E8A040", green: "#70A870", white: "#F0EDE8",
  lavender: "#9B7FBF", coral: "#E07060", peach: "#F0B898",
};

// Which flowers can be tinted toward which colours (color theory compliance)
const allowedTints: Record<FlowerType, string[]> = {
  rose: ["red", "pink", "white", "coral", "peach", "lavender"],
  peony: ["pink", "white", "peach", "coral"],
  tulip: ["red", "pink", "yellow", "orange", "purple", "white"],
  sunflower: ["yellow", "orange"], // NEVER blue/pink
  lavender: ["purple", "lavender"],
  eucalyptus: ["green"],
  daisy: ["white", "yellow"],
  hyacinth: ["purple", "lavender", "pink", "blue"],
  ranunculus: ["red", "pink", "yellow", "orange", "peach", "coral", "white"],
  cherry_blossom: ["pink", "white"],
  babys_breath: ["white"],
  fern: ["green"],
};

const moodPalettes: Record<string, { wrap: WrapStyle; bg: string }> = {
  "thinking-of-you": { wrap: "tissue", bg: "#F8F5F0" },
  "proud-of-you": { wrap: "kraft", bg: "#FDFAF0" },
  "missing-you": { wrap: "tissue", bg: "#F8F4F8" },
  "celebrating-you": { wrap: "paper", bg: "#FFF8F0" },
  "just-because": { wrap: "paper", bg: "#F8F6F0" },
  "love-you": { wrap: "tissue", bg: "#FFF5F5" },
};

const occasionFlowers: Record<string, FlowerType[]> = {
  birthday: ["rose", "tulip", "sunflower", "daisy", "ranunculus"],
  anniversary: ["rose", "peony", "ranunculus", "cherry_blossom"],
  "just-because": ["sunflower", "daisy", "lavender", "cherry_blossom"],
  "thank-you": ["tulip", "peony", "daisy", "ranunculus"],
  "get-well": ["sunflower", "daisy", "lavender", "cherry_blossom"],
  congratulations: ["rose", "sunflower", "tulip", "hyacinth"],
  diwali: ["rose", "sunflower", "ranunculus", "hyacinth"],
  "mothers-day": ["peony", "rose", "tulip", "cherry_blossom"],
};

// Greenery types for back layer
const greeneryTypes: FlowerType[] = ["eucalyptus", "fern", "babys_breath"];

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

  // Only tint if the favourite colour is allowed for this flower type
  if (favouriteColour) {
    const hex = colourNameToHex[favouriteColour.toLowerCase()];
    if (hex && allowedTints[type]?.includes(favouriteColour.toLowerCase())) {
      color = blendColors(color, hex, 0.25);
      accent = blendColors(accent, hex, 0.15);
    }
  }

  return { color, accent };
}

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
  
  const flowerTypes = occasionFlowers[occasion] || occasionFlowers["birthday"];
  const flowers: FlowerPlacement[] = [];

  // === BACK LAYER: Greenery (eucalyptus, fern, baby's breath) ===
  const greenCount = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < greenCount; i++) {
    const angle = ((i / greenCount) * 240 - 120) * (Math.PI / 180);
    const radius = 40 + rand() * 30;
    const type = greeneryTypes[Math.floor(rand() * greeneryTypes.length)];
    const natural = pickNatural(rand, type);
    flowers.push({
      type,
      x: Math.sin(angle) * radius,
      y: -30 - rand() * 40 + Math.cos(angle) * radius * 0.2,
      scale: 0.7 + rand() * 0.9,
      rotation: (rand() - 0.5) * 60,
      color: natural.color,
      accentColor: natural.accent,
      delay: i * 0.08,
      layer: "back",
    });
  }

  // === MID LAYER: Secondary flowers (smaller, filling gaps) ===
  const secCount = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < secCount; i++) {
    const angle = ((i / secCount) * 200 - 100) * (Math.PI / 180);
    const radius = 25 + rand() * 30;
    const type = flowerTypes[(i + 2) % flowerTypes.length];
    const natural = pickNatural(rand, type, favouriteColour);
    flowers.push({
      type,
      x: Math.sin(angle) * radius,
      y: -50 - rand() * 30 + Math.cos(angle) * radius * 0.2,
      scale: 0.7 + rand() * 0.5,
      rotation: (rand() - 0.5) * 40,
      color: natural.color,
      accentColor: natural.accent,
      delay: greenCount * 0.08 + i * 0.1,
      layer: "mid",
    });
  }

  // === FRONT LAYER: Focal flowers (large, prominent) ===
  const mainCount = 3 + Math.floor(rand() * 2);
  for (let i = 0; i < mainCount; i++) {
    const angle = ((i / mainCount) * 140 - 70) * (Math.PI / 180);
    const radius = 15 + rand() * 20;
    const heightVariance = rand() * 35;
    const type = flowerTypes[i % flowerTypes.length];
    const natural = pickNatural(rand, type, favouriteColour);
    flowers.push({
      type,
      x: Math.sin(angle) * radius,
      y: -75 - heightVariance + Math.cos(angle) * radius * 0.2,
      scale: 1.3 + rand() * 0.7,
      rotation: (rand() - 0.5) * 25,
      color: natural.color,
      accentColor: natural.accent,
      delay: (greenCount + secCount) * 0.08 + i * 0.15,
      layer: "front",
    });
  }

  // Add a few filler baby's breath in front for depth
  const fillerCount = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < fillerCount; i++) {
    const natural = pickNatural(rand, "babys_breath");
    flowers.push({
      type: "babys_breath",
      x: (rand() - 0.5) * 70,
      y: -40 - rand() * 25,
      scale: 0.5 + rand() * 0.4,
      rotation: (rand() - 0.5) * 50,
      color: natural.color,
      accentColor: natural.accent,
      delay: (greenCount + secCount + mainCount) * 0.08 + i * 0.1,
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
