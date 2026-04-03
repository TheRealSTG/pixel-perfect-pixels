import type { RecipientDetails } from "@/lib/bouquet-data";

interface Props {
  details: RecipientDetails;
  onChange: (details: RecipientDetails) => void;
}

const RecipientStep = ({ details, onChange }: Props) => {
  const update = (field: keyof RecipientDetails, value: string) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <div>
      <h2 className="text-3xl font-serif font-semibold text-foreground text-center mb-2">
        Who's it for?
      </h2>
      <p className="text-sm text-muted-foreground font-sans text-center mb-10">
        A few details help us make something truly personal.
      </p>

      <div className="max-w-sm mx-auto space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-sans font-medium text-foreground mb-1.5">
            Their name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={details.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Priya"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-sm font-sans font-medium text-foreground mb-1.5">
            Your relationship{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={details.relationship || ""}
            onChange={(e) => update("relationship", e.target.value)}
            placeholder="e.g. partner, mum, best friend"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Favourite colour */}
        <div>
          <label className="block text-sm font-sans font-medium text-foreground mb-1.5">
            Their favourite colour{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={details.favouriteColour || ""}
            onChange={(e) => update("favouriteColour", e.target.value)}
            placeholder="e.g. blue, sunflower yellow"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-sans font-medium text-foreground mb-1.5">
            Their city{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={details.city || ""}
            onChange={(e) => update("city", e.target.value)}
            placeholder="e.g. Mumbai, London"
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default RecipientStep;
