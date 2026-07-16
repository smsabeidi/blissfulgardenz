# DESIGN.md — Blissful Gardenz "The Living Garden"

Design-system contract for the public website. Synthesized from PRD v1.0 §5 (the client-approved
creative concept) and the project taste skills (design-taste-frontend, high-end-visual-design,
gpt-taste, minimalist-ui, imagegen-frontend-web). Where skills conflict with the PRD, the PRD wins
(it is the contract); where the PRD is silent, the taste skills govern.

## Design Read

Reading this as: premium wellness/relationship-enrichment marketing site for a multigenerational
audience (couples 24-60+), with an editorial-luxury "garden at first light" language, leaning
toward Tailwind v4 tokens + Fraunces display serif + GSAP/Motion restrained choreography.

Dials: DESIGN_VARIANCE 7 · MOTION_INTENSITY 6 · VISUAL_DENSITY 3.
(Premium consumer per taste-skill table; density lowered for the older audience; motion capped
at "calm over clever" per PRD §5.3.)

## Three pillars (PRD §5)

Sanctuary (exhale on arrival) · Growth (content unfurls) · Horizon (a golden line of hope,
everywhere). Nothing flashes. Everything blooms.

## Color tokens (PRD §5.1 hexes are contractual)

| Token | Hex | Role |
|---|---|---|
| `--garden-deep` | #0F2E22 | Primary. Headers, footer, primary buttons, dusk surfaces |
| `--ivory-mist` | #F7F4EC | Dawn canvas |
| `--horizon-gold` | #C9A227 | Signature accent, decorative sizes only (Horizon Line, focus jewelry) |
| `--gold-ink` | #8C6D1F | Accessible gold for small text/links on light surfaces |
| `--sage-veil` | #9DB4A0 | Secondary surfaces, tags, dividers |
| `--terracotta` | #B85C38 | Warm accent, testimonials, sparing highlights |
| `--midnight-soil` | #0B1512 | Dusk canvas |

Taste-skill note: this sits in the "Forest" family (deep green + bone + gold accent), not the
banned beige+brass default; the exact hexes are named in the client brief (override satisfied).
One accent (gold) locked across the whole page. Terracotta appears only in testimonial/quote
contexts. No pure #000/#fff anywhere.

## Typography (three voices, PRD contractual)

- **Display:** Fraunces (variable, optical size + SOFT/WONK axes). Brand-justified: the PRD names
  it explicitly (taste-skill serif ban overridden by brief). Tight tracking, leading 1.05-1.1,
  italic descenders get leading-[1.1] + pb-1.
- **UI sans:** Inter Tight (taste-skill-approved as a pairing partner; not plain Inter). Nav,
  buttons, forms, meta.
- **Long-form serif:** Source Serif 4. Journal articles, letters, book excerpts.
- All via `next/font/google`, `display: swap`, subsets. Base body 17-18px (multigenerational
  audience, PRD §4). Fluid display scale via clamp(); H1 never exceeds 2-3 lines (wide containers,
  max-w-5xl/6xl).

## Iconography

`@phosphor-icons/react`, thin/light weight only, one family, standardized. (The PRD's ~30 custom
botanical icons are a later design-phase deliverable; Phosphor thin matches the 1.5px-stroke
rounded spec meanwhile.) One or two simple geometric brand glyphs (horizon-sun half-circle) may be
inline SVG: simple marks only, never full illustrations.

## Surfaces & shape system (locked)

- Cards/panels: rounded-3xl (24px) to rounded-[2rem]; premium cards use the double-bezel nested
  shell (outer tinted ring + inner core with concentric radius).
- Interactive pills (buttons, tags): rounded-full.
- Inputs: rounded-xl (12px).
- Shadows: tinted to background hue (green-cast on ivory, never black); ultra-diffuse. Hairline
  gold rules (`--horizon-gold` at low alpha) as dividers.
- Frosted glass: header on scroll + media overlays only. Paper-grain overlay at 2-3% opacity on a
  fixed pointer-events-none layer.

## Motion language (PRD §5.3 + skill skeletons)

- Ease: cubic-bezier(0.22, 1, 0.36, 1). Durations 200-600ms. Staggers 60-90ms. Scroll reveals
  fire once. Parallax displacement capped at 8-12%.
- **GSAP + ScrollTrigger** for: Horizon Line SVG draw, Story Path, hero timeline, pinned work.
  `start: "top top"` for pins; gsap.context + revert cleanup in every useEffect.
- **motion/react** for: whileInView reveals (once: true), stagger children, button physics.
  Never in the same component tree as GSAP.
- Every animation motivated in one sentence (hierarchy/storytelling/feedback/state). Max one
  marquee per page. No custom cursors (taste-skill a11y ban overrides PRD §5.3 cursor line).
- **prefers-reduced-motion: designed fade-only equivalents everywhere; parallax/drift/tilt
  disable entirely.** Non-negotiable.
- No window scroll listeners; no useState for continuous values; transform/opacity only.

## Theme: Dawn / Dusk (not generic dark mode)

CSS variables + `[data-theme="dusk"]` + `prefers-color-scheme` default; manual sun/moon toggle
animates like light falling in a garden. Dusk = midnight-soil canvas, moonlit sage, warmer gold.
One theme across the whole page; sections never invert individually.

**Palette precedence (four drivers, one rule):** manual toggle beats system preference beats
time-of-day. Time-of-day never switches the theme; it tints the hero artwork only. Seasonal
tokens change accent artwork/hue quarterly and are orthogonal to Dawn/Dusk (summer is active
now; rotation is a CMS-phase feature).

## Signature experiences shipping this phase

Horizon Line (scroll progress + section draws + nav underline) · Dawn Hero (time-aware light,
client-gated post-hydration, localStorage first-visit sunrise) · Dawn/Dusk toggle · Trilogy Shelf
(CSS 3D + GSAP tilt/drag, static fallback) · Story Path · Blossom Wall (labeled illustrative) ·
Bloom micro-interactions (petal bloom on primary hover, gold underline focus, drawn checkmarks) ·
Considered emptiness (designed empty/filter-zero states) · Seasonal token architecture (summer
active).

## Imagery

No client photography yet (PRD §21). Image generation skipped this phase (10 free credits on the
connected account; not spent autonomously). Stand-ins: layered botanical SVG/gradient compositions
in deep-green duotone, dawn-gradient skies, grain overlay; the real portrait (Dr Adeyinka.jpg)
duotone-graded on Home/About. Designed poster frames for video slots; typographic book covers.
No picsum/stock, no div-based fake screenshots, no fake photo credits.

## Motion inventory decisions (PRD §5.3 table, per row)

| PRD motion item | Decision | Weight note |
|---|---|---|
| Page transitions (horizon sunrise wipe) | Simplified: CSS crossfade + Horizon Line rise on route change; full View Transitions API deferred | ~0KB |
| Hero entrance (GSAP timeline) | Include | gsap already in bundle, leaf-loaded |
| Section reveals (unfurl, staggered) | Include via motion/react whileInView | motion ~35KB gz, shared |
| Horizon Line draw (SVG stroke + scroll) | Include (GSAP ScrollTrigger) | — |
| Trilogy Shelf | Include as CSS 3D + GSAP tilt/drag; R3F deferred post-approval | saves ~150KB+ |
| Stat counters | Include (in-view count-up, tabular figures) | tiny |
| Magnetic cards/CTAs ≤6px | Include, pointer-only devices, reduced-motion off | tiny |
| Custom cursor | CUT (taste-skill a11y/perf ban overrides PRD; raise at M1) | — |
| Media lightbox shared-element | Simplified to dialog transition; shared-element deferred | — |
| Lenis smooth scroll | Deferred (a11y/INP risk; native scroll + CSS smooth anchors) | saves ~10KB |
| Lottie seed-to-sprout preloader | CUT this phase (no asset; first-visit sunrise covers the moment) | saves ~60KB+ |
| Skeleton shimmer | Include where async states exist (minimal this phase) | tiny |

## Brand mark

No client wordmark delivered (PRD §20.2: light refinement in scope, logo design out of scope).
Interim: Fraunces typographic lockup ("Blissful Gardenz" + horizon-sun half-circle glyph),
explicitly labeled interim in handoff notes. Real mark is a client input (PRD §21.2).

## Mobile as first-class (approval happens on the client's phone)

Full-screen botanical mobile menu (staggered reveal, frosted dusk panel) is a first-class build
item. Every signature moment has a touch equivalent: Trilogy Shelf tilt→touch-drag rotate;
magnetic pull→disabled on touch; bloom hover→active-state bloom on tap; Blossom Wall
drift→static grid with tap-to-expand. Hit targets ≥44px. Test at 375px width.

## Component vocabulary (one system, one name each)

`HorizonLine` (fixed scroll-progress hairline + per-section draw variant) · `BloomButton`
(primary pill, petal-bloom hover, button-in-button arrow) · `QuietButton` (secondary ghost pill)
· `Eyebrow` (rationed: max 1 per 3 sections) · `SectionHeading` (Fraunces display + optional
lede, stacked, max-w-[65ch] lede) · `PetalCard` (double-bezel premium card) · `PillarBand`
(Five Pillars: NOT an icon-circle grid; a single asymmetric band, five entries with thin
Phosphor glyphs, hairline gold separators, staggered baseline offsets) · `TrilogyShelf`
(CSS 3D, keyboard: arrows rotate, enter opens format panel) · `FormatPanel` (retailer links +
disabled sample player) · `BlossomWall` (masonry drift mosaic, tap/click expands inline; not a
uniform card grid) · `StoryPath` (About scroll journey, GSAP pin) · `GardenPreview` (real
component mini-preview of member dashboard on /membership) · `TierTable` (comparison,
sticky column on mobile) · `CoupleSeatCallout` · `FaqList` (borderless accordion, + / -)
· `NewsletterBloom` (single-field capture, inline success bloom; at most ONE per page) ·
`ContactForm` · `SiteHeader` (frosted on scroll, ≤72px) · `MobileMenu` (full-screen botanical
dusk panel, staggered reveal, Esc/overlay close, focus-trapped) · `SiteFooter` (sitemap columns,
motto lockup) · `ThemeToggle` (sun/moon, header right) · `EmptyState` ("unplanted seed"
illustration slot + invitation + action) · `LegalShell` (Source Serif long-form).

## Accessibility specifics (beyond budgets)

Skip-to-content link (visible on focus, gold on garden-deep). Focus-visible: 2px gold-ink ring
+ 2px offset everywhere. Trilogy Shelf keyboard path: left/right rotate, Enter/Space opens
format panel, Tab order into panel links. MobileMenu: focus trap, aria-expanded, Esc closes,
returns focus to trigger. ThemeToggle: aria-pressed + label "Switch to dusk/dawn mode".
Accordions: button + aria-expanded + region. Forms: visible labels above fields (never
placeholder-as-label), error text below field with aria-describedby, success announced via
aria-live="polite". All interactive targets ≥44px. Tablet (768-1024): two-column layouts where
desktop has 3+, nav stays single-line; landscape phones treated as tablet.

## Copy rules

Warm, wise, dignified, hopeful; the voice of a trusted elder (PRD §3.1). "Harmony conversations",
never "counseling/therapy". Zero em-dashes or en-dashes anywhere (taste-skill hard ban; use
periods, commas, colons). No filler verbs (elevate/seamless/unleash/next-gen). Headlines ≤ 8
words; sub-paragraphs ≤ 25 words; hero subtext ≤ 20 words. Eyebrows: max 1 per 3 sections.
One CTA label per intent page-wide. Real names with permission-safe first-name+initial style for
illustrative testimonials, clearly labeled illustrative.

## Layout discipline

max-w-7xl containers; section rhythm py-24 → py-40; ≥4 distinct layout families per page; zigzag
cap 2; no 3-equal-cards rows; bento grids gapless with exact cell counts; heroes fit the viewport
(≤2-line H1, CTAs visible); nav single line ≤ 72px, compresses to frosted bar on scroll;
min-h-[100dvh] never h-screen; explicit single-column collapse below 768px.

## Accessibility & performance budgets (contractual, PRD §13)

WCAG 2.2 AA (gold-ink not horizon-gold for small text on light); visible focus (gold jewelry ring
+ high-contrast inner); keyboard paths incl. Trilogy Shelf alternative; captions/transcript
placeholders on media; LCP ≤ 2.0s (hero is CSS/SVG, fonts preloaded via next/font); marketing JS
≤ ~200KB gz (GSAP imported only in leaf clients; no Three.js this phase); CLS ≤ 0.05 (fixed
aspect boxes, font swap with size-adjust fallbacks).
