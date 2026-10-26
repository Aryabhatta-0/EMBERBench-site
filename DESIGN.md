---
name: Anantam
description: A quiet company introduction with a clear path to research evidence.
colors:
  primary: "#142e51"
  canvas: "#fafaf7"
  surface: "#ffffff"
  text: "#15283f"
  secondary: "#455467"
  muted: "#596675"
  focus: "#2865b1"
  ember-ground: "#142e51"
  ember-ink: "#fafcff"
  ember-muted: "#c1d0e1"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(64px, 7.4vw, 96px)"
    fontWeight: 400
    lineHeight: 0.99
    letterSpacing: "-0.025em"
  company-display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(56px, 6.9vw, 96px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  field: "8px"
  surface: "16px"
  company: "20px"
  control: "999px"
spacing:
  small: "8px"
  medium: "16px"
  large: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px 21px"
    height: "44px"
  company-contribution:
    backgroundColor: "{colors.ember-ground}"
    textColor: "{colors.ember-ink}"
    rounded: "{rounded.company}"
    padding: "54px"
---

# Anantam design system

## Overview

**Creative North Star: "Intelligence. An open question."**

The supplied navy infinity emblem anchors a quiet, spacious identity. Local serif display type gives the introduction its voice; practical sans type keeps reading, controls and evidence clear. Sarvam informs product display and card interaction; Gnani informs the company-to-contribution hierarchy. Their assets and source styles are not copied.

The company introduction gives Anantam room to speak before presenting its first contribution. Analytical surfaces retain the same identity with task-specific density, visible scope and progressive disclosure. The benchmark is evidence of the company's work, rather than the entirety of its identity.

**Key Characteristics:**
- Supplied navy infinity emblem
- Local serif display and practical sans
- Spacious company introduction and focused analytical workspaces
- Tonal surfaces with restrained borders
- Native disclosures and visible evidence scope

## Colors

The palette pairs navy with a soft paper canvas and clear semantic text roles. Frontmatter owns the default primitives. `site/anantam.css` owns shared light/dark semantic variables; `site/company.css` adds the contribution-card roles.

### Primary
- **Navy:** brand identity and primary actions; actions adapt to the shared dark theme.
- **Contribution ground:** `--ember-ground` remains navy in both themes, with `--ember-ink` for headings and scores and `--ember-muted` for supporting copy. These fixed card roles preserve contrast independently of the surrounding theme.
- **Emblem ground:** in dark mode, a pale circular mat (`--emblem-ground`, `#e7edf5`) keeps the original navy artwork visible without filtering its colors.

### Neutral
- **Paper canvas / white surface:** page ground and analytical workspaces.
- **Primary / secondary / muted text:** reading hierarchy without coloring individual heading words.
- **Focus:** an immediate visible outline for keyboard interaction.

Shared dark equivalents are canvas (`#0e1825`), surface (`#152231`), primary text (`#eff3f7`), secondary text (`#c4ced9`), muted text (`#abb9c8`), action (`#c4d8ef`) and focus (`#b2d4ff`). The loading ground aliases the canvas in light mode and the existing hero glow (`#203c60`) in dark mode, keeping the original navy artwork legible.

**The Semantic Role Rule.** Use the shared semantic roles across themes; use the fixed contribution roles inside the navy company card.

## Typography

**Display Font:** locally hosted Instrument Serif, with Georgia and serif fallbacks.
**Body Font:** locally hosted DM Sans, with system-ui and sans-serif fallbacks. Both fonts retain their OFL licenses.

Instrument Serif carries the introduction and editorial section headings. DM Sans handles reading, controls and data. Benchmark and company display roles are distinct in the normative frontmatter; the company heading uses a slightly more open line height. Data uses tabular numerals. Headings balance naturally without coloring individual words.

Company introductory copy is 17px with a 1.65 line height; compact analytical descriptions are generally 12–14px. Longer analytical introductions stay around 65ch. The company heading becomes `clamp(52px, 10.7vw, 72px)` below 700px, and its introduction becomes 15px.

## Layout

The company homepage at `index.html` has three sections: company introduction, the single published contribution EMBERBenchmark, and a short future outlook. It uses a quiet composition with one navy evidence card. The company container is at most 1408px with fluid side spacing (`clamp(24px, 5vw, 72px)`). Introduction, contribution and outlook use two columns on larger screens and one below 700px. This is the company surface's composition, not a prescribed layout for every route.

The analytical overview now lives at `benchmark.html`. It retains Rankings / Trade-offs / Scenarios and detailed analysis through native disclosures. The other five analytical pages keep their task structures:

- Leaderboard: an editorial introduction and one explorer canvas. Scores, People, API usage and All metrics change the visible measurements; the selected lens is shareable in the URL. Mobile keeps names and scores together, and selection creates a comparison tray.
- Compare: directly juxtaposed policy scores and a three-view evidence workspace. Extra model selectors are disclosed on demand.
- Model: a score-led specimen page with Overview / Scenarios / Diagnostics / Sources tabs. Existing hash anchors reveal the correct view and disclosure.
- Scenarios: a challenge navigator beside actual scenario and population/world evidence, followed by Rankings and Across all scenarios views. Mobile offers focused ranking and More columns.
- Methodology: a continuous reading column with a navigable table of contents and disclosed technical reference tables.

Analytical containers retain the existing chart and table geometry in `site/style.css`, with shared refinements in `site/anantam.css`. Navigation collapses below 1100px; the primary content breakpoint is 700px. Thin rules belong to data rows and places where separation conveys structure.

## Elevation & Depth

Tonal layering provides the primary depth. Shared buttons and panels have no shadow at rest; selected segmented tabs use a small functional shadow. The company contribution's contrast establishes its prominence. Its evidence pane gains reversible pointer depth only for a fine pointer that supports hover, with reduced motion off: at most three degrees of horizontal rotation and a six-pixel lift, returning to rest on pointer leave. Depth does not carry information unavailable to keyboard or touch users.

Company motion is a finite enhancement using the local GSAP 3.15 distribution. A brief introduction/art entrance uses a 550ms default and `power3.out`; the original still content is visible without GSAP. The company's canvas flight stops after 4.5 seconds. The benchmark overview preserves its existing continuous forward-space flight and 600ms emblem entrance; its behavior is not extended to the company page.

The shared canvas primitive preserves the supplied PNG as the visible base and adds transparent, alpha-masked perspective trails with one vanishing point. It caps animation at 30 frames per second and suspends offscreen or in a hidden tab. Reduced motion and unavailable canvas retain the still artwork. Frequent tab and data changes remain immediate. Explicit-property interaction transitions use 150ms with a 0.96 press scale. No Lottie runtime is needed.

## Shapes

Controls and segmented tabs use capsules. Analytical content surfaces use the shared surface radius; the company contribution uses the company radius and returns to the shared surface radius below 700px. Inputs use the field radius and a stronger semantic border. Controls have a 44px minimum target height; the company's introductory action is 48px tall.

## Components

### Company contribution

One navy card presents EMBERBenchmark, the company's sole current published contribution. Its copy, benchmark link, source link, scope and useful fallback are static HTML. An optional generated-data preview shows the first three decision models under the benchmark's existing ordering, with model deep links and labelled scores. Preview failure leaves a clear path to the benchmark. Do not turn this evidence preview into a catalogue of speculative products.

### Buttons and fields

Capsule primary actions use the semantic action and on-action roles; the navy contribution reverses the action into its light ink and navy ground. Hover responds only where supported. Focus uses a visible two-pixel outline with a four-pixel offset; contribution focus uses its light ink. Fields remain visibly labelled, and native selects preserve keyboard behavior.

### Navigation and evidence controls

Company navigation introduces the company and routes into the benchmark; analytical navigation serves research tasks. Existing filtering, sorting, selection, chart tooltips, query strings, model IDs, hash links and relative routes remain available. Model detail remains a contextual destination. Tabs follow tablist/tab/tabpanel semantics with roving focus, Arrow keys, Home and End. Escape closes the mobile menu and restores focus. Empty tooltips are hidden from assistive technology, and labels and values supplement color.

### Analytical loader

The shared loader belongs to the six analytical pages: benchmark, leaderboard, compare, model, scenarios and methodology. The company homepage has no loader and does not wait for data before displaying its introduction or contribution.

While actual analytical data is pending, show one centered supplied infinity emblem, the Anantam wordmark and a concise route status. Preserve the original PNG colors and transparent outline. The loader has no skeleton, card framing, decorative divider, large route headline, percentage or minimum display time. It reuses the canvas flight only while pending. A slow load exposes Reload page after eight seconds; ready or failed content replaces it immediately and clears the busy state. Teardown cancels animation, removes motion listeners, disconnects observers and clears the timer.

**The Honest Loading Rule.** Show branded loading only while analytical data is pending; never hold content for a brand sequence.

## Do's and Don'ts

### Do:
- **Do** preserve the supplied navy infinity emblem and local type system.
- **Do** use semantic color roles and keep scope and uncertainty visible.
- **Do** preserve useful company content without JavaScript or benchmark data.
- **Do** respect reduced motion with static artwork and immediate state changes.
- **Do** retain benchmark model IDs, deep links and generated-data provenance.

### Don't:
- **Don't** invent metrics, customers, trust logos or future product launches.
- **Don't** edit generated results or scoring definitions by hand.
- **Don't** show a pending-data loader on the company homepage.
- **Don't** turn the finite company introduction into continuous decorative motion.
- **Don't** force analytical chart geometry into the company's three-section composition.
