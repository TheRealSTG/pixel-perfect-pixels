export const occasions = [
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "anniversary", label: "Anniversary", emoji: "💕" },
  { id: "just-because", label: "Just Because", emoji: "🌻" },
  { id: "thank-you", label: "Thank You", emoji: "🙏" },
  { id: "get-well", label: "Get Well Soon", emoji: "💛" },
  { id: "congratulations", label: "Congratulations", emoji: "🎉" },
  { id: "diwali", label: "Diwali", emoji: "🪔" },
  { id: "mothers-day", label: "Mother's Day", emoji: "👩" },
] as const;

export const moods = [
  { id: "thinking-of-you", label: "Thinking of you", color: "sage" },
  { id: "proud-of-you", label: "Proud of you", color: "golden" },
  { id: "missing-you", label: "Missing you", color: "rose" },
  { id: "celebrating-you", label: "Celebrating you", color: "golden" },
  { id: "just-because", label: "Just because", color: "sage" },
  { id: "love-you", label: "I love you", color: "rose" },
] as const;

export const artStyles = [
  {
    id: "flat",
    label: "Flat Illustration",
    description: "Clean, modern vector art with bold colours",
    emoji: "🎨",
    speed: "Instant",
  },
  {
    id: "botanical",
    label: "Botanical Print",
    description: "Detailed linework with vintage texture overlays",
    emoji: "🌿",
    speed: "Instant",
  },
  {
    id: "pixel",
    label: "Pixel Art",
    description: "Charming retro-style pixel bouquets",
    emoji: "👾",
    speed: "Instant",
  },
  {
    id: "watercolour",
    label: "Watercolour",
    description: "Dreamy, painterly AI-generated artwork",
    emoji: "🖌️",
    speed: "20-60s",
  },
] as const;

export type Occasion = (typeof occasions)[number]["id"];
export type Mood = (typeof moods)[number]["id"];
export type ArtStyle = (typeof artStyles)[number]["id"];

export interface RecipientDetails {
  name: string;
  relationship?: string;
  favouriteColour?: string;
  city?: string;
}

export interface BouquetConfig {
  occasion: Occasion;
  mood: Mood;
  artStyle: ArtStyle;
  recipient: RecipientDetails;
}
