import { useLocation, useNavigate } from "react-router-dom";
import { composeBouquet, type WrapStyle } from "@/lib/bouquet-engine";
import BouquetCanvas from "@/components/flowers/BouquetCanvas";
import type { BouquetConfig } from "@/lib/bouquet-data";

interface LocationState {
  config: BouquetConfig;
  customFlowers?: Parameters<typeof BouquetCanvas>[0]["flowers"];
  wrapStyle?: WrapStyle;
}

const BouquetResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  const config = state?.config;
  const customFlowers = state?.customFlowers;
  const customWrapStyle = state?.wrapStyle;
  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-sans mb-4">No bouquet found.</p>
          <button onClick={() => navigate("/create")}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-sans text-sm hover:opacity-90 transition-opacity">
            Create one
          </button>
        </div>
      </div>
    );
  }

  const composition = customFlowers
    ? { flowers: customFlowers, wrapColor: "#E8DDD0", wrapAccent: "#D4C8B8", backgroundColor: "#F8F5F0", wrapStyle: (customWrapStyle || "paper") as WrapStyle }
    : composeBouquet(config.occasion, config.mood, config.artStyle, config.recipient.name, config.recipient.favouriteColour, config.recipient.city);

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
        <button onClick={() => navigate("/create")}
          className="text-sm font-sans text-muted-foreground hover:text-foreground transition-colors">
          ← New bouquet
        </button>
        <h1 className="text-xl font-serif font-semibold text-foreground">Bouquet</h1>
        <div className="w-12" />
      </nav>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        <div className="text-center mb-8 animate-fade-up">
          <p className="text-sm font-sans text-muted-foreground tracking-wide mb-2">A bouquet for</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground">
            {config.recipient.name}
          </h2>
          {config.recipient.relationship && (
            <p className="text-sm font-sans text-muted-foreground mt-1 italic">
              Your {config.recipient.relationship}
            </p>
          )}
        </div>

        <div className="animate-fade-up-delay-1">
          <BouquetCanvas
            flowers={composition.flowers}
            wrapColor={composition.wrapColor}
            wrapAccent={composition.wrapAccent}
            artStyle={config.artStyle}
            animated={true}
            wrapStyle={composition.wrapStyle}
          />
        </div>

        <div className="mt-10 text-center animate-fade-up-delay-2">
          <p className="text-sm text-muted-foreground font-sans italic mb-6">
            Made with love, free forever 🌸
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate("/create")}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-sans font-medium text-sm hover:opacity-90 transition-opacity shadow-md">
              Create another
            </button>
            <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-sans font-medium text-sm hover:opacity-80 transition-opacity">
              Share 💌
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BouquetResult;
