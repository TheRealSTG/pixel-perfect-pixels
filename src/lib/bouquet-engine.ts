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
  delay: number; // for animation staggering
}

interface BouquetComposition {
  flowers: FlowerPlacement[];
  wrapColor: string;
  wrapAccent: string;
  backgroundColor: string;
}

// Color palettes by mood
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

// Flower selections by occasion
const occasionFlowers: Record<string, FlowerType[]> = {
  birthday: ["rose", "tulip", "sunflower", "lavender", "eucalyptus"],
  anniversary: ["rose", "peony", "rose", "lavender", "eucalyptus"],
  "just-because": ["sunflower", "tulip", "lavender", "eucalyptus", "peony"],
  "thank-you": ["tulip", "peony", "lavender", "eucalyptus", "rose"],
  "get-well": ["sunflower", "tulip", "lavender", "eucalyptus", "peony"],
  congratulations: ["rose", "sunflower", "tulip", "peony", "eucalyptus"],
  diwali: ["rose", "sunflower", "tulip", "peony", "lavender"],
  "mothers-day": ["peony", "rose", "tulip", "lavender", "eucalyptus"],
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
  recipientName: string
): BouquetComposition {
  // Seed from recipient name for consistency
  const seed = recipientName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + 42;
  const rand = seededRandom(seed);

  const palette = moodPalettes[mood] || moodPalettes["just-because"];
  const flowerTypes = occasionFlowers[occasion] || occasionFlowers["birthday"];

  const flowers: FlowerPlacement[] = [];

  // Main focal flowers (3-4 large ones in center-top)
  const mainCount = 3 + Math.floor(rand() * 2);
  for (let i = 0; i < mainCount; i++) {
    const angle = ((i / mainCount) * 120 - 60) * (Math.PI / 180);
    const radius = 20 + rand() * 15;
    flowers.push({
      type: flowerTypes[i % flowerTypes.length],
      x: Math.sin(angle) * radius,
      y: -80 + Math.cos(angle) * radius * 0.5 - i * 8,
      scale: 1.6 + rand() * 0.4,
      rotation: (rand() - 0.5) * 20,
      color: palette.primary[i % palette.primary.length],
      accentColor: palette.accent[i % palette.accent.length],
      delay: i * 0.15,
    });
  }

  // Secondary flowers (4-6 medium, filling out)
  const secCount = 4 + Math.floor(rand() * 3);
  for (let i = 0; i < secCount; i++) {
    const angle = ((i / secCount) * 180 - 90) * (Math.PI / 180);
    const radius = 35 + rand() * 20;
    flowers.push({
      type: flowerTypes[(i + 2) % flowerTypes.length],
      x: Math.sin(angle) * radius,
      y: -60 + Math.cos(angle) * radius * 0.3 - i * 5,
      scale: 1.0 + rand() * 0.4,
      rotation: (rand() - 0.5) * 30,
      color: palette.primary[(i + 1) % palette.primary.length],
      accentColor: palette.accent[(i + 1) % palette.accent.length],
      delay: mainCount * 0.15 + i * 0.1,
    });
  }

  // Greenery/filler (eucalyptus + lavender in back)
  const fillerCount = 3 + Math.floor(rand() * 2);
  for (let i = 0; i < fillerCount; i++) {
    const angle = ((i / fillerCount) * 200 - 100) * (Math.PI / 180);
    const radius = 40 + rand() * 25;
    flowers.push({
      type: i % 2 === 0 ? "eucalyptus" : "lavender",
      x: Math.sin(angle) * radius,
      y: -50 + rand() * 20,
      scale: 1.1 + rand() * 0.5,
      rotation: (rand() - 0.5) * 40,
      color: i % 2 === 0 ? "#7BAF7B" : "#9B7FBF",
      accentColor: i % 2 === 0 ? "#5A8A5A" : "#7B5FA0",
      delay: (mainCount + secCount) * 0.12 + i * 0.1,
    });
  }

  // Sort by y (back to front) so overlapping looks natural
  flowers.sort((a, b) => a.y - b.y);

  return {
    flowers,
    wrapColor: palette.wrap,
    wrapAccent: palette.wrapAccent,
    backgroundColor: palette.bg,
  };
}
