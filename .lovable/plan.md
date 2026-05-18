## Goal

Fix three related issues with the generated bouquet: blooms still escape the wrap silhouette, the overall arrangement reads as cluttered/random, and the four art styles still look too similar.

---

## 1. Keep flowers inside the bouquet silhouette

The current `clamp()` in `src/lib/bouquet-engine.ts` is a plain rectangle (`x: ±48`, `y: -78..-10`). The wrap is teardrop-shaped (narrow at top/bottom, wider at center) and blooms have visible radius proportional to `scale`, so even a "clamped" center can render outside.

Fix in `composeBouquet`:

- Replace the rectangular clamp with a **scale-aware elliptical clamp** that matches the bouquet's visible silhouette:
  - Half-width tapers from ~28 at the top (y=-78) to ~46 at the crown (y=-40) and back to ~38 at the wrap mouth (y=-10).
  - Inset by `bloomRadius = 6 * scale` so the painted petals (not just the center point) stay inside.
- Apply the clamp **after every** placement step (`nudgeAway` → clamp), then run one more `nudgeAway`+clamp pass so collision resolution doesn't push blooms back out.
- Shrink the filler bounds (`rawX = (rand()-0.5)*60` → use the same silhouette function) so baby's breath stops escaping at the edges.
- Reduce greenery rotation/scale at the extreme edges so leaves don't fan outside the wrap.

## 2. Refine the arrangement (less messy, more "real")

Still in `composeBouquet`:

- **Triangular focal composition**: replace the 6-position lookup with a fixed 3-flower triangle (top center, lower-left, lower-right) + optional 1–2 secondary focals tucked between, with deterministic offsets per `variant` instead of `rand()*5` jitter. This is how real florists build a dome.
- **Phyllotaxis-style mid ring**: replace the simple `angle = i/secCount * 2π` ring with a golden-angle spiral (`angle += 137.5°`, `radius = k*√i`) so secondary flowers fill gaps naturally instead of stacking.
- **Scale curve**: flowers at the front/center largest, fading smaller toward edges (`scale *= 1 - 0.3 * edgeFactor`). Reduces "big blooms hanging off the side" look.
- **Rotation discipline**: cap random rotation to ±8° for focal/secondary (currently ±12°), and bias every flower to tilt slightly outward from center for a natural radiating fan.
- **Tighten collision thresholds** (`minDist` 13→16 for mid, 18→22 for focal) so blooms breathe.
- **Drop the "fill upper-right / fill front-left" duplicates** — they're what creates the cluttered double-stacking the user sees.

## 3. Make the 4 art styles genuinely distinct

Currently `flat` and `botanical` share the same SVG paths with only stroke-width differences, and `watercolour` is just a displacement filter over `flat`. Rework `src/components/flowers/FlowerSVGs.tsx` and `src/components/flowers/BouquetCanvas.tsx`:

- **Flat** — true vector-poster look:
  - Solid bold fills, no strokes, no gradients.
  - Simplified petal shapes (fewer control points).
  - Flat single-color centers, no highlights.
- **Botanical** — ink-illustration look:
  - Desaturate fills (~40% saturation) and overlay a dark ink outline (stroke ~1.2, color = shaded accent).
  - Add cross-hatching lines on petals via a `<pattern>` overlay used only when `style==="botanical"`.
  - Switch leaf shapes to thinner, more anatomical curves with visible vein lines.
- **Pixel** — already distinct, but bump grid chunkiness:
  - Force `shape-rendering="crispEdges"` (already set) and quantize coordinates to a 2-unit grid for every petal so it reads unmistakably as 8-bit.
- **Watercolour** — painterly wash:
  - Replace the small `feDisplacementMap` with a layered approach: render each petal **twice** (a large blurred wash at 35% opacity + a softer top shape), and apply a stronger `feTurbulence` (`baseFrequency 0.6`, `scale 2.4`).
  - Add a paper-grain `<feTurbulence>+feComposite` overlay across the whole canvas.
  - Drop hard strokes entirely; let edges bleed.

Add a small `<defs>` block per style (hatching pattern, paper grain, pixel grid filter) inside `BouquetCanvas` so the style switch swaps visual language, not just stroke width.

---

## Files to edit

- `src/lib/bouquet-engine.ts` — silhouette clamp, phyllotaxis mid ring, triangular focal, scale curve, tightened collisions.
- `src/components/flowers/FlowerSVGs.tsx` — per-style render branches for flat/botanical/watercolour (pixel already branches); add hatching + double-wash paths.
- `src/components/flowers/BouquetCanvas.tsx` — extend `<defs>` with hatching pattern, paper grain, stronger watercolour filter; toggle them by `artStyle`.

## Out of scope

- No changes to the Pro Florist drag/drop UI, wrap renderer, stem logic, or the parity diff (all recently stabilized).
- No new flower types or wrap styles.
- No backend / data model changes.
