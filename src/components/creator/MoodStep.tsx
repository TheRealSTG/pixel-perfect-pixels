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

    <div className="flex flex-col gap-3 max-w-sm mx-auto">
      {moods.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className={`flex items-center gap-4 px-6 py-4 rounded-xl border-2 transition-all text-left ${
            selected === m.id
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/30 bg-card"
          }`}
        >
          <span className="text-2xl">{moodEmojis[m.id]}</span>
          <span className="font-sans font-medium text-foreground">{m.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default MoodStep;
