# DESIGN.md — Blissful Gardenz "The Living Garden"

Design-system contract for the public website. Synthesized from PRD v1.0 §5 (the client-approved
creative concept) and the project taste skills (design-taste-frontend, high-end-visual-design,
gpt-taste, minimalist-ui, imagegen-frontend-web). Where skills conflict with the PRD, the PRD wins
(it is the contract); where the PRD is silent, the taste skills govern.


## GOLDEN HOUR DIRECTION (v3, supersedes all green-palette rules below)

User-directed re-skin referencing casadisolare.com (monumental sun, plum ground, wordmark-scale
didone with italic accents) and unseen.co (Saol Display + Neue Montreal, dusty blush world,
dreamy comfort). The deep-green "Living Garden" palette is retired.

**Palette:** dawn canvas #F1E7DF (blush sand), dusk canvas #2A1E21 (plum espresso), ink #4A3733 /
#F0E4D8, brand anchor #3A2A2D (espresso plum), gold #E3B04B / #EFC66B, gold-text #82601F,
dusty rose #C9A99B, terracotta #C06B44, butter sun radial (--sun). Both hero skies are plum
(dawn: plum warming to amber at the horizon; dusk: deeper plum). Success #6B7F4F, error #B0442C.

**Type:** Bodoni Moda variable (display, weight ~460, tracking -0.03 to -0.045em, italic accents
inside headlines in the same family), Instrument Sans variable (UI/body), Newsreader (long-form).

**Hero:** the monumental sun. An enormous butter radial-gradient sphere resting on the section's
bottom edge over the plum sky, motto at wordmark scale (clamp to 10.5rem) with "on the" in gold
italic, CTAs floating ON the sun in plum. Sun rises against scroll (scrub, no pinning). Header
runs a cream over-dark regime on the hero (body[data-darkhero] + .site-header[data-compressed]).

**Imagery:** warm Mediterranean grade (cream/ochre/terracotta/wheat). chairs.jpg is the warm
courtyard version; green-library holdovers wear .photo-warm (sepia shift) until re-shot. The
leaf-macro (gold drop on dark) stays: it matches natively.

Where anything below this section says deep green, sage, ivory, or Fraunces/Cormorant, this
section wins.

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

## Typography (three voices; upgraded in the redesign pass, supersedes PRD §5.1 defaults)

- **Display:** Cormorant 400-600 + italics. High-contrast luxury serif; replaces Fraunces after
  the client-side read flagged the original as templated (the taste-skill Fraunces ban now
  applies in full). Weight 500 at display sizes; tracking near 0; leading 0.98-1.14.
- **UI sans:** Outfit 300-600 (taste-skill approved family). Nav, buttons, forms, meta. Ledes
  set at 300 for air.
- **Long-form serif:** Newsreader 400/600 + italics. Journal articles, letters, legal prose.
- All via `next/font/google` (CSS variables kept from phase 1 so tokens/components were
  unaffected by the swap). Base body 17-18px. H1 never exceeds 2-3 lines.

## Type scale (7 steps, exact values; two parallel builders must produce identical hierarchy)

| Step | Voice | Size | Leading | Tracking | Weight |
|---|---|---|---|---|---|
| display-xl (hero H1) | Fraunces | clamp(2.75rem, 1.2rem + 5vw, 5.25rem) | 1.02 | -0.02em | 560 |
| display (section H2) | Fraunces | clamp(2rem, 1.1rem + 3vw, 3.25rem) | 1.08 | -0.015em | 540 |
| display-sm (H3, card titles, quotes) | Fraunces | clamp(1.375rem, 1.1rem + 1vw, 1.75rem) | 1.18 | -0.01em | 520 |
| lede (section intro) | Inter Tight | clamp(1.125rem, 1rem + 0.4vw, 1.3125rem) | 1.55 | 0 | 400 |
| body | Inter Tight | clamp(1.0625rem, 1rem + 0.2vw, 1.125rem) | 1.65 | 0 | 400 |
| long-form (Journal/legal prose) | Source Serif 4 | 1.1875rem | 1.75 | 0 | 400, measure 62-68ch |
| meta / eyebrow | Inter Tight | 0.75rem | 1.4 | 0.18em uppercase | 500 |

Weights pinned in next/font: Fraunces 400-600 (opsz auto, SOFT ~80, WONK 0), Inter Tight
400/500/600, Source Serif 4 400/600 + italic. Quotes: Fraunces italic at display-sm.

## Full Dawn → Dusk token map (every token, both values; no invented dusk colors)

| Token | Dawn | Dusk |
|---|---|---|
| `--canvas` | #F7F4EC | #0B1512 |
| `--surface` | #FFFDF6 | #10201A |
| `--surface-raised` | #FBF7EC | #152922 |
| `--ink` | #1E2B24 | #E9E4D6 |
| `--ink-muted` | #56675C | #A7B5A9 |
| `--brand` | #0F2E22 | #16382B |
| `--gold` (decorative only) | #C9A227 | #D8B23A |
| `--gold-text` (small text/links, AA) | #7A5F1B | #E3C25B |
| `--sage` | #9DB4A0 | #7E9483 |
| `--terracotta` | #B85C38 | #D08A66 |
| `--hairline` | rgba(15,46,34,.16) | rgba(233,228,214,.16) |
| `--shadow` | rgba(15,46,34,.10) | rgba(0,0,0,.45) |
| `--btn-bg` / `--btn-ink` | #0F2E22 / #F7F4EC | #D8B23A / #0B1512 |
| `--error` / `--error-dusk-safe` | #A4432D | #E58A6C |
| `--success` | #2E5D3E | #8FBF9A |
| `--focus-ring` | #7A5F1B | #E3C25B |

Pre-paint theme bootstrap: blocking inline script in <head> sets `data-theme` from
localStorage → prefers-color-scheme before first paint. No flash, ever.

## Component anatomy (the eight core components, dimensioned)

1. **BloomButton** (primary): 48px height, px-7, rounded-full, `--btn-bg`/`--btn-ink`, label
   15px Inter Tight 500; trailing 32px circle (bg ivory/15 dawn, soil/15 dusk) holding a thin
   arrow, flush right with 12px inset; hover: 4-petal SVG glyph scales 0→1 at 35% opacity
   behind label + arrow circle translates 2px diagonally; active scale(0.98); focus: 2px
   `--focus-ring` ring, 2px offset. One line, never wraps.
2. **QuietButton**: same metrics, transparent bg, 1px `--hairline` border, `--ink` label;
   hover: gold underline draws under label + surface-raised fill.
3. **PetalCard** (double bezel): outer p-1.5 rounded-[2rem] bg `--surface-raised` ring-1
   `--hairline`; inner rounded-[calc(2rem-6px)] bg `--surface` p-8 with inset top highlight
   (1px ivory/60 dawn, ivory/10 dusk); shadow 0 18px 50px `--shadow`.
4. **Input**: 48px height, rounded-xl, bg `--surface`, 1px `--hairline`; label ABOVE, 13px 500;
   focus: gold-ink bottom border grows edge-to-edge (240ms) + focus ring; error: border +
   message below in `--error`, 13px, with thin warning glyph, aria-describedby; success:
   drawn-check in `--success`. Placeholder never acts as label.
5. **Eyebrow**: meta step in `--gold-text`, preceded by a 24px 1px gold dash. Max 1 per 3 sections.
6. **TierColumn**: Bloom is featured: garden-deep outer bezel + gold hairline + "Recommended"
   small-caps tag, scale(1.02) desktop; mobile: stacked tier cards with "Everything included"
   disclosure, never a squeezed 11-row table.
7. **PullQuote**: Fraunces italic display-sm, oversized drawn gold quotation glyph; NO left
   border, no background track; attribution: name + role in meta step.
8. **FilterChip**: 36px pill, px-4, 1px hairline; active: `--brand` bg + ivory text (dawn),
   gold bg + soil text (dusk); count of active filters announced aria-live.

## Horizon Line — mechanical spec (one motif, four roles, never two animating at once)

- **Progress role**: single fixed 1px line directly under the header (z-40), gold at 0.9
  opacity, width = scroll progress. Always present; suppressed only while the membership
  sticky join bar is visible (one fixed accessory besides header, max).
- **Section-draw role**: each major section owns ONE `.horizon-rule` (1px gold at 0.35) that
  draws scaleX 0→1 (origin left, 600ms, once) on entry. Draws never overlap the hero
  choreography; staggered so only one line animates at a time.
- **Nav role**: active link carries a static 1px gold underline; hover draws it left→right 200ms.
- **Transition role**: on route change the progress line pulses (brief glow) + content
  crossfades 300ms. No full-screen wipe this phase.
- Dusk: all roles use `--gold` dusk value. Reduced motion: rules render pre-drawn at 0.35,
  progress line still tracks scroll (informational), hover underline appears without draw.
- Hero handoff: the hero's horizon (sun-disc on a 1px gold line at 62% height) is the motif's
  origin; module 2's section draw continues it.

## Dawn Hero — composition spec

Layers back→front: L1 sky gradient (time-of-day tint target), L2 sun disc + 1px gold horizon
at 62% viewport height, L3 distant botanical silhouette band (drawn flora SVG, 8% parallax),
L4 foreground grasses/leaves (SVG, 12% parallax, anchored bottom), L5 content. SSR default
frame = late-morning gold. Post-hydration: time tint crossfades L1 ONLY (600ms; dawn 5-10h,
gold 10-16h, amber 16-19h, deep-green dusk 19-5h); layout never shifts. First-visit 1.2s
choreography (horizon draws → sun rises 12px → headline rises with light), localStorage-gated
with try/catch; reduced-motion and repeat visits: gentle fade only. Two CTAs max in hero.

## Header & navigation spec

Desktop (≥1024): left interim lockup; center 5 links: About · Conversations · Books ·
Watch & Listen · Journal (short labels); right: ThemeToggle + gold pill "The Inner Garden" +
quiet "Sign in". About and Conversations open flyout panels (rounded-2xl surface, 1px hairline,
fade + 4px rise 200ms, hover + focus open, Esc closes, caret rotates). Below 1024: hamburger →
full-screen MobileMenu (dusk botanical panel, two-level list with children indented under
About/Conversations, staggered 60ms reveal, focus-trapped, scroll-locked, active page marked
with gold underline). Header ≤72px, compresses to frosted bar after 80px scroll.

## Structural anti-slop rulings (binding on the build)

- Text over texture/imagery ALWAYS gets a scrim or duotone depth floor, contrast-verified in
  both themes.
- Five Pillars = pillars-on-the-Line: one golden strand crossing the section, five stations
  that bloom on scroll arrival, Fraunces numerals, text alternating above/below the line,
  vertical line-walk on mobile. No icon-circle cards.
- Conversations preview = asymmetric band: Premarital + Marital prominent, Rebuilding entry
  deliberately smaller, softer, quieter. Never three equal cards.
- Journal latest = featured-plus-two, not 3-up.
- Couple Seat sits ABOVE the tier table on /membership (the emotional frame for pricing).
- Trilogy Shelf is Home's single pinned/scroll-hijack moment (the only one on the page).
- Max ONE centered section in a row; the mission/founder module is left-asymmetric.
- Botanical means drawn flora: no abstract blobs, no wavy dividers.
- Blossom Wall (illustrative stories) never appears on the Rebuilding page. Its section header
  carries a small-caps sage label: "Member stories · illustrative until launch"; individual
  cards stay clean.

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

## Imagery (redesign pass: photographic, image-led)

Editorial photo library generated on Higgsfield (soul_2, user-directed spend), one consistent
grade: golden-hour/dusk private garden, deep greens + warm gold, medium-format film character,
NO people with identifiable faces (couples only distant/from behind). Library at
public/images/photos/: hero-dawn, hero-dusk, chairs (conversations: two chairs facing, the book-one
cover motif), gate-path (membership threshold), leaf-macro (texture), couple-path (journal/watch),
bouquet (gift). Real assets: Dr. Laiyemo portrait, three real book covers. Treatment rules:
photos always sit under a scrim or deep-green duotone when text overlays (AA verified); Ken Burns
only in the hero; swap-ready for the client's own photography at M-next. The hand-drawn SVG flora
remains for the footer band and small accents only. No picsum/stock, no fake photo credits.

## Hero (redesign pass, supersedes the layered-SVG comp)

Image-led editorial: full-bleed hero-dawn photograph (hero-dusk under [data-theme="dusk"]),
bottom-left type block (eyebrow, display-xl, lede ≤20 words, 2 CTAs gold/quiet), Horizon Line
drawn at the photo's horizon (~58%), canvas-colored scrim rising from the fold. Motion: one-time
Ken Burns settle (scale 1.06→1, 14s), scroll parallax 10%, first-visit blur-rise choreography,
reduced-motion = static with pre-drawn line. Time-of-day tinting is retired; theme carries the
light. Blur-rise (opacity+y+blur) is the house entrance motion site-wide via Reveal.

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
