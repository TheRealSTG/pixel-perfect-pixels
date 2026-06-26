import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-7xl mb-6 animate-gentle-float select-none">🥀</div>
        <h1 className="text-5xl font-serif font-semibold text-foreground mb-3">404</h1>
        <p className="text-lg font-serif italic text-muted-foreground mb-2">
          This bouquet got lost in the post.
        </p>
        <p className="text-sm font-sans text-muted-foreground mb-8">
          The page you're looking for doesn't exist — but we can make something beautiful instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-sans text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Go home
          </button>
          <button
            onClick={() => navigate("/create")}
            className="px-6 py-2.5 bg-card border border-border text-foreground rounded-full font-sans text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            Create a bouquet
          </button>
        </div>
      </div>
      <p className="absolute bottom-6 text-xs text-muted-foreground font-sans">
        Bloom Studio · Free forever 🌸
      </p>
    </div>
  );
};

export default NotFound;
