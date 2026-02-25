# Chewber Brand Identity

## Name & Concept

**Chewber** = "Chew" + "tuber" (root vegetable). A playful portmanteau that's friendly, memorable, and food-native. The name evokes the earthy, honest act of eating real food — and the humble root vegetable that grows unseen underground, doing the hard work.

## Personality

- **Voice:** Your clever friend at the farmers market who reads every label but never lectures.
- **Tone:** Warm, playful, trustworthy. Never clinical, never preachy.
- **Feeling:** Like getting a hand-written note, not a corporate report.

## Visual Language

**Medium:** Loose watercolor washes + confident ink line work.
Think: botanical illustration meets indie food zine. The aesthetic should feel like someone talented dashed off a sketch at a café — effortless but intentional. Imperfect edges, visible paper texture, ink lines that vary in weight. NOT polished digital illustration. NOT corporate. NOT clip-art.

**References (mood, not copy):**
- Quentin Blake's ink work (energetic line, minimal color)
- Yuko Shimizu's bold ink + selective watercolor
- Oliver Jeffers' children's book covers (whimsy + sophistication)
- Farmers market chalkboard signs (hand-lettered warmth)

## Symbol: The Tuber

The primary symbol is a **round, friendly root vegetable** (think turnip, radish, or stylized beet) with **two or three small leaf sprouts** emerging from the top. It sits slightly askew — not perfectly centered, because perfection isn't the point.

**Key characteristics:**
- **Shape:** Round/bulbous body, slightly wider at bottom. NOT a carrot (too elongated). Think turnip, beet, or a round radish.
- **Sprouts:** 2-3 small leaves on top, loose and lively, like they're waving.
- **Ink outline:** Confident, slightly uneven single-weight ink line (~2-3px at icon scale). Broken in places — doesn't have to close perfectly.
- **Watercolor fill:** A single primary wash of Sprout green for the body, with a second lighter wash bleeding slightly outside the ink lines. Leaves get a brighter green wash.
- **Expression:** Two small dot eyes and a tiny curved mouth (optional — include for app icon, omit for formal uses). The face is minimal: think `:)` not 😀. Just two ink dots and a small arc.
- **Roots:** One or two tiny wispy ink-line roots dangling from the bottom (optional, omit at small sizes).

The tuber should look like it could be a character in a picture book but also work as a clean logo mark.

---

## Color Palette

Three primary brand colors, chosen for watercolor harmony and dark/light agnosticism:

| Role | Name | Hex | Watercolor Character |
|------|------|-----|----------------------|
| **Primary** | Sprout | `#3D8B5F` | A natural, slightly muted green. Like viridian mixed with a touch of sap green. Fresh but not neon. |
| **Secondary** | Terracotta | `#C8714A` | Warm burnt sienna/orange. The color of clay pots and root vegetable skin. Rich in washes. |
| **Anchor** | Ink | `#2A2A32` | Deep blue-black. The ink itself. For outlines, text, dark backgrounds. A warm black, not pure #000. |

### Extended UI Palette (derived)

| Role | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| Background | `#FDFBF7` (warm cream) | `#1A1A1F` (warm charcoal) | Page background |
| Surface | `#FFFFFF` | `#242429` | Cards, panels |
| Border | `#E8E4DD` | `#333338` | Dividers |
| Text primary | `#2A2A32` (Ink) | `#F0EDE7` (warm white) | Body text |
| Text secondary | `#7A766D` | `#9A968F` | Captions, metadata |
| Score excellent | `#3D8B5F` (Sprout) | `#4CA870` (lighter Sprout) | 75-100 |
| Score good | `#D4A24C` (warm amber) | `#E0B45A` | 50-74 |
| Score poor | `#C8714A` (Terracotta) | `#D4845E` | 25-49 |
| Score bad | `#C44D3E` (brick red) | `#D46050` | 0-24 |

### Color usage rules
- **Sprout** is the hero. Use for the tuber body, primary actions, positive scores, and key UI accents.
- **Terracotta** is the warm counterpoint. Use for secondary actions, warnings, and warmth accents. It's the "earth" to Sprout's "leaf."
- **Ink** is the structure. All outlines, all text, dark mode backgrounds. It grounds the playful watercolor.
- Never use pure black (`#000`) or pure white (`#FFF`). Always warm-shift: cream whites, blue-black darks.

---

## Typography

| Use | Font | Weight | Notes |
|-----|------|--------|-------|
| Logo / wordmark | Hand-lettered style OR Inter | 800-900 | If using a system font, letter-spacing: -0.02em for warmth |
| Headlines | Inter | 700 | Clean contrast to the organic brand mark |
| Body | System sans-serif stack | 400/500 | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |
| Data / scores | SF Mono, Menlo, monospace | 600 | Scores and nutritional data |

The typography is intentionally clean/modern to counterbalance the hand-drawn brand mark. The contrast between organic illustration and crisp type is part of the identity.

---

## Assets Required

| # | Asset | Dimensions | Format | Versions | Purpose |
|---|-------|-----------|--------|----------|---------|
| 1 | App Icon | 1024×1024 (source) | PNG | Dark bg + Light bg | → resize to 512, 192, 180 |
| 2 | Favicon | 32×32 / scalable | SVG + ICO | Dark bg + Light bg | Browser tab |
| 3 | OG Social Card | 1200×630 | PNG | Dark + Light | Link previews (Twitter, iMessage, Slack) |
| 4 | Logo Wordmark | scalable | SVG | Dark bg + Light bg | In-app header |
| 5 | Hero Illustration | 1200×800 | PNG | Dark + Light | Landing page / onboarding |

---

## Image Generation Prompts

### General Style Preamble (prepend to every prompt)

> **Style preamble — include in all prompts:**
>
> Medium: traditional watercolor and black ink on cold-pressed watercolor paper.
> Technique: loose wet-on-wet watercolor washes with visible pigment granulation and soft bloom edges. Confident single-weight ink outlines drawn with a dip pen — the line varies slightly in thickness, has the occasional dry-brush skip, and doesn't always perfectly close. The ink was drawn FIRST, then color washed in, so some wash bleeds slightly past the ink boundary.
> Paper: visible cold-pressed watercolor paper texture (subtle tooth/grain) throughout, including in "empty" areas.
> Color mixing: colors should look like they were mixed on a palette, not picked from a computer. Slight unevenness in wash density is desirable. Let the white of the paper breathe through thin wash areas.
> What to AVOID: digital illustration look, vector art, gradients, airbrush, perfect symmetry, thick black outlines (outlines should be fine/medium ink, not cartoon-bold), clip-art style, 3D rendering, photorealism, glossy/shiny surfaces.

---

### Asset 1 — App Icon (1024×1024)

#### 1A: Dark Background

> [Insert style preamble above]
>
> **Subject:** A single round root vegetable (turnip/radish shape — bulbous body wider at the bottom, tapering slightly at top) centered on the canvas. Two small leaf sprouts emerge from the top, angled slightly left and right like antennae, loose and lively. The vegetable has a friendly minimal face: two small ink-dot eyes placed in the upper third of the body, and a tiny curved smile line below them. One or two thin wispy roots dangle from the bottom.
>
> **Composition:** The tuber is centered with ~15% padding on all sides. It fills most of the frame but doesn't touch edges. The sprout leaves extend slightly above the main body. The tuber sits on nothing — it floats.
>
> **Color:** The tuber body is washed in a rich muted green (`#3D8B5F` — like viridian/sap green mix). The wash is uneven: slightly more concentrated on the left side (shadow), lighter/more watery on the right where the paper shows through. The leaf sprouts are a slightly brighter, more yellow-green wash. The face dots and outline are in dark ink (`#2A2A32`). A very subtle warm wash of terracotta/burnt sienna (`#C8714A`) tints the bottom of the tuber body where it rounds, suggesting earthiness.
>
> **Background:** Solid deep warm charcoal (`#1A1A1F`). No paper texture visible in background — the dark bg is flat/clean to provide contrast. The paper texture should only be subtly visible within the watercolor washes on the tuber itself.
>
> **Ink details:** The outline is a continuous but slightly irregular ink line that traces the tuber's silhouette. It breaks/skips in 1-2 small places (especially near the bottom/roots). Line weight is medium — visible but not heavy/cartoony. The face is just 2 small filled ink circles for eyes (placed slightly above center of the body, spaced apart about 30% of body width) and a tiny upward arc for mouth.
>
> **Mood:** Friendly, approachable, slightly cheeky. The kind of character you'd see on a tote bag from a hip farmers market. It should make you smile.
>
> **Technical:** Square 1024×1024px canvas. The icon must read clearly when scaled down to 64px — keep details minimal and contrast high.
>
> **Negative prompt / avoid:** No soil, no ground line, no plate, no other vegetables, no text, no banner, no border, no gradient backgrounds, no realistic vegetable rendering, no photograph style.

#### 1B: Light Background

> [Insert style preamble above]
>
> **Subject:** Identical to dark version — same tuber, same face, same sprouts, same proportions.
>
> **Color:** Same watercolor washes on the tuber. Ink outlines are the same dark ink (`#2A2A32`).
>
> **Background:** Warm cream/off-white (`#FDFBF7`). Here the watercolor paper texture IS visible across the entire background — subtle cold-pressed paper grain, as if this were painted directly on a piece of watercolor paper. Very faint coffee-stain warmth to the paper. A tiny watercolor splatter or two (in diluted Sprout green) near the tuber adds life — keep them subtle and small.
>
> **Technical:** Same 1024×1024px. Same readability at 64px.

---

### Asset 2 — Favicon (512×512 source, will be exported at 32×32 / 16×16)

#### 2A: Dark Background

> [Insert style preamble above]
>
> **Subject:** Extremely simplified version of the tuber icon. Just the round body shape and two leaf sprouts. NO face, NO roots, NO fine details — this must read at 16×16 pixels.
>
> **Shape:** A bold round/bulbous blob of green watercolor with two small leaf marks on top. The ink outline is slightly thicker/bolder than the full icon version to maintain visibility at tiny sizes.
>
> **Color:** Strong Sprout green (`#3D8B5F`) wash filling most of the shape — less watery/subtle than the app icon, more saturated for visibility. Ink outline in `#2A2A32`. Leaves are a brighter green dab.
>
> **Background:** Flat deep charcoal (`#1A1A1F`), no texture.
>
> **Composition:** Centered, fills ~80% of canvas. Maximum simplicity.
>
> **Technical:** 512×512px source. Must remain recognizable at 16×16px. Err on the side of too simple rather than too detailed.

#### 2B: Light Background

> Same as 2A but on warm cream (`#FDFBF7`) background with visible paper texture.

---

### Asset 3 — Open Graph Social Card (1200×630)

#### 3A: Dark Version

> [Insert style preamble above]
>
> **Composition:** Landscape card, 1200×630px. The layout has three zones:
>
> **Left zone (~30% of width):** The tuber character from the app icon, approximately 300px tall, positioned vertically centered and horizontally at ~18% from left edge. Full detail version: face, sprouts, roots, full ink + watercolor treatment. Slightly tilted 5-8° clockwise for playfulness.
>
> **Center-right zone (~50% of width):** The word "Chewber" in large, bold, warm white (`#F0EDE7`) sans-serif type (Inter Black or similar, ~80px equivalent). Below it, "Know your food" in smaller text (~28px) in muted warm gray (`#9A968F`). The text block is vertically centered, left edge starting at ~38% of canvas width.
>
> **Bottom-right accent:** A small watercolor score badge — a loose hand-drawn circle in Sprout green watercolor wash with "87" written inside in ink. Positioned in the bottom-right area (~85% from left, ~75% from top). The circle is imperfect/organic, not geometric. Diameter ~80px. This hints at the product's function without explaining it.
>
> **Background:** Flat deep warm charcoal (`#1A1A1F`). A few (3-5) very subtle watercolor paint splatters scattered across the background in highly diluted Sprout green and Terracotta — barely visible, just enough to break the flatness and suggest the hand-made medium. These should be at ~8-10% opacity equivalent.
>
> **Ink detail:** A loose, scribbly ink underline beneath "Chewber" — not a straight rule, but a hand-drawn line with character, in ink color `#2A2A32` at ~40% opacity so it's subtle on dark bg.
>
> **Text rendering note:** The word "Chewber" must be spelled exactly: C-h-e-w-b-e-r. Seven letters. This is critical — AI image generators frequently misspell text. If the model cannot reliably render text, generate the card WITHOUT any text (tuber + score badge + splatters only) and composite text programmatically afterward.
>
> **Negative prompt / avoid:** No food photography, no plates/bowls, no grocery store imagery, no nutrition label imagery, no border/frame, no gradient.

#### 3B: Light Version

> [Insert style preamble above]
>
> **Composition:** Same layout as dark version.
>
> **Tuber:** Same character, same position, same tilt.
>
> **Text:** "Chewber" in Ink color (`#2A2A32`), subtitle in `#7A766D`. Ink underline at ~25% opacity.
>
> **Score badge:** Same loose circle, Sprout green wash, "87" in ink.
>
> **Background:** Warm cream (`#FDFBF7`) with full watercolor paper texture visible across the entire card. 2-3 very faint watercolor blooms/splatters in diluted Sprout green and Terracotta, as if the artist's palette dripped onto the paper. These are larger and softer than the dark version — they should feel like actual watercolor paper that was used for painting.
>
> **Text rendering note:** Same caveat as dark version — generate without text if spelling can't be guaranteed, composite later.

---

### Asset 4 — Logo Wordmark (scalable, SVG-target)

#### 4A: Dark Background (for dark UI headers)

> [Insert style preamble above]
>
> **Composition:** Horizontal lockup, approximately 5:1 width-to-height ratio. Left side: the tuber icon (simplified — face optional, no roots). Right side: the word "Chewber" in a slightly hand-lettered but legible style.
>
> **Tuber icon:** Positioned at the left, vertically centered. ~90% of the total height. Same watercolor + ink treatment as the app icon but slightly simplified. The tuber body in Sprout green wash, sprout leaves on top, ink outline.
>
> **Wordmark text:** "Chewber" to the right of the icon, vertically centered, with a small gap (~15% of icon width) between icon and text. The letterforms should feel hand-drawn/lettered but remain highly legible: slightly irregular stroke weights, a tiny wobble to the baselines, but recognizably sans-serif structure. Weight equivalent to ~800-900. Each letter is in warm white (`#F0EDE7`). The "C" in Chewber can optionally have a very subtle Sprout green watercolor tint to visually connect it to the icon — but this is a subtle touch, not a full color change.
>
> **Background:** Transparent (for SVG) or flat `#1A1A1F` for PNG proof.
>
> **Technical:** Must remain legible at 120px wide (roughly header-bar size on mobile). Output at high resolution for later SVG tracing.
>
> **Text rendering note:** "Chewber" must be spelled exactly. C-h-e-w-b-e-r. If text rendering is unreliable, generate ONLY the tuber icon portion and set the wordmark text programmatically in the final SVG.

#### 4B: Light Background (for light UI headers)

> Same composition. Tuber is identical.
>
> **Text:** "Chewber" in Ink color (`#2A2A32`).
>
> **Background:** Transparent or `#FDFBF7`.
>
> **Optional:** Very faint paper texture behind the lockup if rendering as PNG.

---

### Asset 5 — Hero Illustration (1200×800)

#### 5A: Dark Version

> [Insert style preamble above]
>
> **Subject:** The Chewber tuber character, larger and more detailed than the icon version, positioned in the left-center of the canvas (~35% from left, vertically centered). It's the same round root vegetable with face and sprouts, but here we see more watercolor detail: the green wash has visible pigment settling, the ink lines show more pen character, and there's a warm terracotta blush on the lower body.
>
> **Surrounding elements:** Scattered around the tuber (but not crowding it) are 4-6 loose watercolor sketches of other foods at ~40% of the tuber's size: a lemon, an apple, a leafy green/kale leaf, a small jar (suggesting packaged food), a berry cluster, a grain stalk. These are rendered in lighter/more diluted washes than the main tuber — they're supporting cast, not co-stars. Each has a quick ink outline. They float at various distances from the tuber, slightly rotated, as if scattered on a table.
>
> **Color:** The tuber is full Sprout green + Terracotta accent. Surrounding foods use a mix of natural watercolors: lemon in diluted warm yellow, apple in a red-green wash, kale in darker green, jar in light gray wash, berries in diluted purple-red. All muted and watercolor-natural.
>
> **Right side:** Open space (right 40% of canvas) for text overlay — this is where headlines/CTAs will go in the app, so keep it clean. A few tiny paint splatters are fine.
>
> **Background:** Flat `#1A1A1F` with a few very subtle watercolor splatters.
>
> **Mood:** Inviting, warm, like opening a beautiful recipe book. The tuber is the guide/host, the scattered foods are its world.
>
> **Technical:** 1200×800px, PNG with no text (text is composited by the app).

#### 5B: Light Version

> Same composition and elements.
>
> **Background:** Warm cream (`#FDFBF7`) with full visible watercolor paper texture. The scattered paint splatters are more visible and organic here — this version should feel most like an actual watercolor painting on paper.
>
> **Colors:** Same palette but surrounding food sketches can be slightly more saturated since they're on light paper.

---

## Prompt Engineering Notes for AI Image Generation

### Model recommendations
- **DALL-E 3 / GPT-Image-1**: Best at following compositional instructions and color specs. Weakest at text rendering — always plan to composite text.
- **Midjourney v6+**: Excellent at watercolor/traditional media aesthetics. Use `--style raw` to avoid over-stylization. Add `--no 3d, glossy, digital art, vector` to negative prompts.
- **Flux Pro / Ideogram**: Better text rendering if you need "Chewber" in the image. Still verify spelling.
- **Stable Diffusion 3+**: Good with ControlNet for composition. Use a sketch reference for the tuber pose.

### Iteration strategy
1. **Start with the App Icon (Asset 1A/1B)** — it's the atomic unit. Get the tuber character right first.
2. Once the tuber character is locked, use it as a reference/seed for all other assets.
3. Generate the **OG card and wordmark without text** — composite text programmatically.
4. The **favicon** can be derived by simplifying/cropping the app icon — may not need a separate generation.
5. The **hero illustration** comes last, using the established tuber as the anchor.

### Key phrases to include in prompts
- "traditional watercolor and ink on cold-pressed paper" (not "watercolor style" which gives digital results)
- "dip pen ink outlines" (implies specific line quality)
- "pigment granulation" (triggers realistic watercolor rendering)
- "wet-on-wet wash" (soft edges)
- "visible paper tooth" (texture)
- "NOT digital illustration" (critical negative)

### Key phrases to AVOID
- "cute" (leads to kawaii/chibi which is wrong register)
- "cartoon" (too bold, too perfect)
- "watercolor style" (gets digital mimicry, not traditional look)
- "logo" or "icon" in isolation (gets corporate/vector results)
- "sticker" (gets die-cut outline look)

---

## File Destinations

All generated assets should be placed in:

```
apps/web/public/
├── favicon.svg          (Asset 2, hand-optimized SVG)
├── favicon.ico          (Asset 2, multi-size ICO)
├── icon-192.png         (Asset 1, resized)
├── icon-512.png         (Asset 1, resized)
├── apple-touch-icon.png (Asset 1, resized to 180×180)
├── og-image.png         (Asset 3A, dark version — default)
├── og-image-light.png   (Asset 3B, light version)
├── logo.svg             (Asset 4A, dark bg version — default)
├── logo-light.svg       (Asset 4B, light bg version)
├── hero.png             (Asset 5A, dark version)
└── hero-light.png       (Asset 5B, light version)
```
