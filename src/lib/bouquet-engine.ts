import type { Occasion, Mood, ArtStyle } from "@/lib/bouquet-data";
import type { FlowerType } from "@/components/flowers/FlowerSVGs";

interface FlowerPlacement {
  type: FlowerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  accentColor: string;
  delay: number;
}

interface BouquetComposition {
  flowers: FlowerPlacement[];
  wrapColor: string;
  wrapAccent: string;
  backgroundColor: string;
}

// Helper: blend a hex color toward a target
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

// Map favourite colour name → hex for blending
const colourNameToHex: Record<string, string> = {
  red: "#E04050",
  pink: "#E8A0B4",
  blue: "#6090D0",
  purple: "#9070B0",
  yellow: "#F4D040",
  orange: "#E8A040",
  green: "#70A870",
  white: "#F0EDE8",
  lavender: "#9B7FBF",
  coral: "#E07060",
  peach: "#F0B898",
};

const moodPalettes: Record<string, { primary: string[]; accent: string[]; wrap: string; wrapAccent: string; bg: string }> = {
  "thinking-of-you": {
    primary: ["#B8D4C8", "#A0C4B0", "#E8C4D0"],
    accent: ["#8AB09A", "#7BA090", "#D4A0B4"],
    wrap: "#E8DDD0", wrapAccent: "#D4C8B8", bg: "#F8F5F0",
  },
  "proud-of-you": {
    primary: ["#F4C430", "#E8A040", "#F0D870"],
    accent: ["#D4A020", "#C88830", "#D8C050"],
    wrap: "#F0E8D0", wrapAccent: "#E0D4B8", bg: "#FDFAF0",
  },
  "missing-you": {
    primary: ["#C8A0D0", "#E0B0C8", "#B090C0"],
    accent: ["#A880B0", "#C890A8", "#9070A0"],
    wrap: "#E8DDE8", wrapAccent: "#D4C8D8", bg: "#F8F4F8",
  },
  "celebrating-you": {
    primary: ["#E06080", "#F4C430", "#E8A0B4"],
    accent: ["#C84060", "#D4A020", "#D4708A"],
    wrap: "#F8E8D0", wrapAccent: "#E8D4B8", bg: "#FFF8F0",
  },
  "just-because": {
    primary: ["#F4C430", "#7BAF7B", "#E8A0B4"],
    accent: ["#D4A020", "#5A8A5A", "#D4708A"],
    wrap: "#E8E0D0", wrapAccent: "#D4D0C0", bg: "#F8F6F0",
  },
  "love-you": {
    primary: ["#E06080", "#E8A0B4", "#F5E1E8"],
    accent: ["#C84060", "#D4708A", "#E8C4D0"],
    wrap: "#F5E8E8", wrapAccent: "#E8D4D4", bg: "#FFF5F5",
  },
};

const occasionFlowers: Record<string, FlowerType[]> = {
  birthday: ["rose", "tulip", "sunflower", "daisy", "ranunculus", "eucalyptus"],
  anniversary: ["rose", "peony", "ranunculus", "cherry_blossom", "eucalyptus"],
  "just-because": ["sunflower", "daisy", "lavender", "eucalyptus", "cherry_blossom"],
  "thank-you": ["tulip", "peony", "daisy", "eucalyptus", "ranunculus"],
  "get-well": ["sunflower", "daisy", "lavender", "eucalyptus", "cherry_blossom"],
  congratulations: ["rose", "sunflower", "tulip", "hyacinth", "eucalyptus"],
  diwali: ["rose", "sunflower", "ranunculus", "hyacinth", "lavender"],
  "mothers-day": ["peony", "rose", "tulip", "cherry_blossom", "eucalyptus"],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
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

  const palette = { ...(moodPalettes[mood] || moodPalettes["just-because"]) };
  
  // Apply favourite colour influence
  const colourHex = favouriteColour ? colourNameToHex[favouriteColour.toLowerCase()] : undefined;
  if (colourHex) {
    // Blend primary and accent colors toward the preferred colour
    palette.primary = palette.primary.map((c) => blendColors(c, colourHex, 0.35));
    palette.accent = palette.accent.map((c) => blendColors(c, colourHex, 0.25));
    palette.wrap = blendColors(palette.wrap, colourHex, 0.1);
    palette.wrapAccent = blendColors(palette.wrapAccent, colourHex, 0.08);
  }

  const flowerTypes = occasionFlowers[occasion] || occasionFlowers["birthday"];
  const flowers: FlowerPlacement[] = [];

  // Main focal flowers (3-4 large, varied heights)
  const mainCount = 3 + Math.floor(rand() * 2);
  for (let i = 0; i < mainCount; i++) {
    const angle = ((i / mainCount) * 120 - 60) * (Math.PI / 180);
    const radius = 18 + rand() * 18;
    const heightVariance = rand() * 25;
    flowers.push({
      type: flowerTypes[i % flowerTypes.length],
      x: Math.sin(angle) * radius,
      y: -75 - heightVariance + Math.cos(angle) * radius * 0.3,
      scale: 1.4 + rand() * 0.6,
      rotation: (rand() - 0.5) * 25,
      color: palette.primary[i % palette.primary.length],
      accentColor: palette.accent[i % palette.accent.length],
      delay: i * 0.15,
    });
  }

  // Secondary flowers (4-6 medium, varied)
  const secCount = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < secCount; i++) {
    const angle = ((i / secCount) * 180 - 90) * (Math.PI / 180);
    const radius = 30 + rand() * 25;
    const heightVariance = rand() * 20;
    flowers.push({
      type: flowerTypes[(i + 2) % flowerTypes.length],
      x: Math.sin(angle) * radius,
      y: -55 - heightVariance + Math.cos(angle) * radius * 0.25,
      scale: 0.8 + rand() * 0.5,
      rotation: (rand() - 0.5) * 35,
      color: palette.primary[(i + 1) % palette.primary.length],
      accentColor: palette.accent[(i + 1) % palette.accent.length],
      delay: mainCount * 0.15 + i * 0.1,
    });
  }

  // Greenery/filler — varied scale
  const fillerCount = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < fillerCount; i++) {
    const angle = ((i / fillerCount) * 220 - 110) * (Math.PI / 180);
    const radius = 35 + rand() * 30;
    const isEuc = i % 3 !== 2;
    flowers.push({
      type: isEuc ? "eucalyptus" : "lavender",
      x: Math.sin(angle) * radius,
      y: -45 + rand() * 25,
      scale: 0.8 + rand() * 0.8,
      rotation: (rand() - 0.5) * 50,
      color: isEuc ? "#7BAF7B" : "#9B7FBF",
      accentColor: isEuc ? "#5A8A5A" : "#7B5FA0",
      delay: (mainCount + secCount) * 0.12 + i * 0.1,
    });
  }

  // Sort by y (back to front)
  flowers.sort((a, b) => a.y - b.y);

  return {
    flowers,
    wrapColor: palette.wrap,
    wrapAccent: palette.wrapAccent,
    backgroundColor: palette.bg,
  };
}
