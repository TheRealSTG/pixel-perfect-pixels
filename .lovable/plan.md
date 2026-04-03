## Bouquet Creation Engine

### Phase 1: SVG Flower Library
Create reusable SVG flower components covering the core types:
- **Rose** (pink/red), **Peony** (white/blush), **Tulip** (varied), **Sunflower**, **Lavender**, **Eucalyptus** (greenery filler)
- Each flower is a React component with props for `color`, `scale`, `rotation`
- Style variants: flat illustration, botanical print, pixel art (watercolour deferred)

### Phase 2: Bouquet Composition Engine
- Map occasion + mood → flower palette (e.g. anniversary + love = roses + peonies in blush/red)
- Arrangement algorithm: radial layout with stems converging, greenery fills gaps
- Wrapping paper SVG element at the bottom to tie it together

### Phase 3: Guided Mode
- Wire up the "Create bouquet" button → renders a composed bouquet on a new `/bouquet` result page
- Auto-selects flowers based on user's occasion/mood/style choices
- Animate flowers appearing one by one

### Phase 4: Pro Florist Studio (basic)
- Canvas area with a flower picker sidebar
- Drag flowers onto the canvas, reposition and scale them
- "Done" button finalises the arrangement

### Files to create
- `src/components/flowers/` — SVG flower components
- `src/lib/bouquet-engine.ts` — composition logic
- `src/pages/BouquetResult.tsx` — guided mode result page
- `src/pages/FloristStudio.tsx` — pro mode canvas

I'll start with Phases 1-3 (guided flow end-to-end), then build the Pro Studio.