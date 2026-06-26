import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWeatherGreeting } from "@/lib/weather";

const LandingPage = () => {
  const [greeting, setGreeting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getWeatherGreeting().then(setGreeting);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-serif font-semibold tracking-tight text-foreground">
          Bloom Studio
        </h1>
        <button
          onClick={() => navigate("/create")}
          className="text-sm font-medium text-primary hover:text-accent transition-colors"
        >
          Create one →
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-8 pb-20">
        {/* Weather greeting — only shows once loaded, no flash */}
        <div className="animate-fade-up text-center mb-8 min-h-[24px]">
          {greeting && (
            <p className="text-sm font-sans text-muted-foreground tracking-wide">
              {greeting}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center text-center">
          {/* Flower emoji hero — no external image needed */}
          <div className="animate-fade-up-delay-1 mb-10">
            <div className="animate-gentle-float text-[120px] leading-none select-none">
              🌸
            </div>
          </div>

          <div className="animate-fade-up-delay-2 max-w-lg">
            <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-foreground leading-tight mb-4">
              Send something{" "}
              <span className="italic text-accent">beautiful.</span>
            </h2>
            <p className="text-lg text-muted-foreground font-sans leading-relaxed mb-8">
              Create a personalised digital bouquet and send it to someone you
              care about — free, forever.
            </p>
          </div>

          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/create")}
              className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-sans font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              Create a bouquet
            </button>
            <button
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3.5 bg-secondary text-secondary-foreground rounded-full font-sans font-medium text-sm hover:opacity-80 transition-opacity"
            >
              How it works
            </button>
          </div>
        </div>

        {/* How it works */}
        <section id="how-it-works" className="mt-32">
          <h3 className="text-2xl font-serif font-semibold text-center mb-12 text-foreground">
            Three steps. Zero cost.
          </h3>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                emoji: "💐",
                step: "1",
                title: "Choose an occasion",
                description: "Birthday, anniversary, just because — pick the moment and set the mood.",
              },
              {
                emoji: "✨",
                step: "2",
                title: "Personalise it",
                description: "Add their name, choose an art style, and we'll compose something unique.",
              },
              {
                emoji: "💌",
                step: "3",
                title: "Send with love",
                description: "Share a beautiful link via WhatsApp, text, or email. No account needed to view.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <p className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-widest mb-2">
                  Step {item.step}
                </p>
                <h4 className="text-lg font-serif font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-32 text-center">
          <p className="text-sm text-muted-foreground font-sans italic">
            Made with care. Free, forever. 🌸
          </p>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
