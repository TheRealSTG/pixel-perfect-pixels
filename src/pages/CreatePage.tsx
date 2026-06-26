import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OccasionStep from "@/components/creator/OccasionStep";
import MoodStep from "@/components/creator/MoodStep";
import RecipientStep from "@/components/creator/RecipientStep";
import StyleStep from "@/components/creator/StyleStep";
import ModeStep from "@/components/creator/ModeStep";
import ReviewStep from "@/components/creator/ReviewStep";
import type { BouquetConfig, Occasion, Mood, ArtStyle, CreationMode, RecipientDetails } from "@/lib/bouquet-data";

const steps = ["Occasion", "Mood", "Recipient", "Style", "Mode", "Review"];

const CreatePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [artStyle, setArtStyle] = useState<ArtStyle | null>(null);
  const [mode, setMode] = useState<CreationMode | null>(null);
  const [recipient, setRecipient] = useState<RecipientDetails>({ name: "" });

  const canGoNext = () => {
    switch (currentStep) {
      case 0: return occasion !== null;
      case 1: return mood !== null;
      case 2: return recipient.name.trim().length > 0;
      case 3: return artStyle !== null;
      case 4: return mode !== null;
      default: return true;
    }
  };

  const config: BouquetConfig | null =
    occasion && mood && artStyle && mode && recipient.name
      ? { occasion, mood, artStyle, recipient, mode }
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
        <button
          onClick={() => (currentStep === 0 ? navigate("/") : setCurrentStep((s) => s - 1))}
          className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {currentStep === 0 ? "Home" : "Back"}
        </button>
        <h1 className="text-xl font-serif font-semibold text-foreground">Bloom Studio</h1>
        <div className="w-12" />
      </nav>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-colors duration-300 ${
                i <= currentStep ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <p className="text-xs font-sans text-muted-foreground mt-2 text-center">
          Step {currentStep + 1} of {steps.length} · {steps[currentStep]}
        </p>
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto px-6 pb-32">
        <div className="animate-fade-up" key={currentStep}>
          {currentStep === 0 && (
            <OccasionStep selected={occasion} onSelect={setOccasion} />
          )}
          {currentStep === 1 && (
            <MoodStep selected={mood} onSelect={setMood} />
          )}
          {currentStep === 2 && (
            <RecipientStep details={recipient} onChange={setRecipient} />
          )}
          {currentStep === 3 && (
            <StyleStep selected={artStyle} onSelect={setArtStyle} />
          )}
          {currentStep === 4 && (
            <ModeStep selected={mode} onSelect={setMode} />
          )}
          {currentStep === 5 && config && (
            <ReviewStep config={config} />
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 inset-x-0 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-end">
          {currentStep < steps.length - 1 ? (
            <button
              disabled={!canGoNext()}
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-sans font-medium text-sm disabled:opacity-40 hover:opacity-90 transition-opacity shadow-md"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => {
                if (config?.mode === "pro") {
                  navigate("/studio", { state: { config } });
                } else if (config) {
                  navigate("/bouquet", { state: { config } });
                }
              }}
              className="px-8 py-3 bg-accent text-accent-foreground rounded-full font-sans font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              {config?.mode === "pro" ? "Open studio 🎨" : "Create bouquet ✨"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
