import { moods, type Mood } from "@/lib/bouquet-data";

interface Props {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
}

const moodEmojis: Record<string, string> = {
  "thinking-of-you": "💭",
  "proud-of-you": "🌟",
  "missing-you": "🥺",
  "celebrating-you": "🥳",
  "just-because": "🌻",
  "love-you": "❤️",
};

const MoodStep = ({ selected, onSelect }: Props) => (
  <div>
    <h2 className="text-3xl font-serif font-semibold text-foreground text-center mb-2">
      What's the mood?
    </h2>
    <p className="text-sm text-muted-foreground font-sans text-center mb-10">
      This sets the emotional tone for the flowers and the card.
    </p>

    <div className="flex flex-col gap-2 max-w-sm mx-auto">
      {moods.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ease-out text-left ${
            selected === m.id
              ? "bg-primary/10 shadow-[0_2px_16px_-4px_hsl(var(--primary)/0.25)] scale-[1.02]"
              : "bg-transparent hover:bg-muted/60 hover:scale-[1.01] active:scale-[0.98]"
          }`}
        >
          <span className={`text-2xl transition-transform duration-300 ${
            selected === m.id ? "scale-110" : "group-hover:scale-110"
          }`}>{moodEmojis[m.id]}</span>
          <span className={`font-sans font-medium transition-colors duration-300 ${
            selected === m.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          }`}>{m.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default MoodStep;
