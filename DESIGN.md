---
name: Anantam
description: A centered company introduction and a clear path into actual benchmark evidence.
colors:
  primary: "#142e51"
  canvas: "#fafaf7"
  surface: "#fff"
  surface-subtle: "#f0f2f3"
  text: "#15283f"
  secondary: "#455467"
  muted: "#596675"
  border: "#dde2e5"
  grid: "#e8ecee"
  focus: "#2865b1"
  input-border: "#83909e"
  accent-soft: "#e9eff6"
  series-1: "#246d76"
  series-2: "#ab5839"
  series-3: "#416994"
  map-floor: "#eff2f4"
  map-wall: "#cbd4de"
  map-person: "#173b62"
  map-exit: "#d3e8de"
  map-exit-ink: "#265746"
  map-route: "#547b9c"
  map-fire: "#b45224"
  map-halo: "#f6d1b6"
  map-grid: "#e4e9ee"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(58px, 6.5vw, 88px)"
    fontWeight: 400
    lineHeight: 1.01
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(38px, 4vw, 54px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  field: "8px"
  surface: "16px"
  showcase: "18px"
  control: "999px"
spacing:
  small: "8px"
  medium: "16px"
  large: "32px"
  company-gutter: "clamp(24px, 5vw, 72px)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px 21px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "10px 21px"
  benchmark-showcase:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.showcase}"
  search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.field}"
---

# Anantam design system

## Overview

**Creative North Star: "Intelligence. An open question."**

The supplied navy infinity emblem anchors a light, spacious identity. A centered company introduction uses local serif display type; practical sans type keeps controls and evidence clear. The homepage introduces Anantam as an experimental AI company, then presents its first contribution through a single expanding benchmark showcase.

This is a code-led record of the current implementation, not a claim of approval against a supplied visual composition. Sarvam informs the expanding rail interaction. Analytical routes share the same identity with task-specific density, visible scope and native disclosure.

**Key Characteristics:**

- Light appearance throughout the site.
- Supplied infinity emblem with its original colors and transparency.
- Centered company introduction and centered introductory action.
- One white showcase with Environment, Results and Methodology panes.
- Direct entry into actual results, with visible evidence scope.

## Colors

Navy actions and ink sit on a warm paper canvas with white workspaces and quiet gray dividers. Frontmatter records normative primitives from `site/anantam.css` and the durable root `--map-*` tokens in `site/company.css`.

### Primary

- **Navy:** the preserved brand mark and primary route actions.
- **Focus blue:** a two-pixel keyboard outline with a four-pixel offset; showcase tabs move the outline inside their bounds.
- **Analytical series:** teal, rust and blue distinguish evidence series; labels and values accompany color.

### Neutral

- **Paper canvas / white surface / subtle surface:** page ground, workspaces and selected or secondary controls.
- **Primary / secondary / muted ink:** reading hierarchy, descriptions and evidence notes.
- **Border / grid / input border:** structural separation, data rows and visible field boundaries.

The scenario uses a cool floor and wall grid, navy people, a green exit, a blue route and rust fire with a pale halo. These colors describe the public initial environment; they do not encode a model's evaluated outcome.

**The Light Appearance Rule.** `theme-init.js` sets `data-theme="light"` and shared CSS declares `color-scheme: light`. Keep one light palette sitewide.

## Typography

**Display Font:** locally hosted Instrument Serif, with Georgia and serif fallbacks.

**Body Font:** locally hosted DM Sans, with system-ui and sans-serif fallbacks. Preserve their OFL licenses.

Instrument Serif carries the centered introduction and editorial headings. DM Sans handles descriptions, navigation, controls and results. Data uses tabular numerals. Headings balance naturally without coloring individual words.

- **Company display:** the frontmatter display role; below 700px use `clamp(52px, 11vw, 70px)`.
- **Contribution heading:** the frontmatter headline role; 38px on phones.
- **Benchmark heading:** `clamp(40px, 4vw, 54px)` with the shared serif family.
- **Body:** 16px / 1.6 globally; the company introduction uses 17px, reducing to 15px on phones. Analytical descriptions generally use 12–14px.
- **Labels:** 13px / 1.5 for shared actions; compact showcase labels and scope notes use 11–12px. Longer analytical descriptions stay around 65–72ch.

## Layout

`index.html` has two sections: a centered company introduction and one EMBERBenchmark showcase. The main container is at most 1344px with `clamp(24px, 5vw, 72px)` side spacing. The introduction has a 660px minimum height, a 106px emblem and a centered 48px-minimum-height action linking to the contribution. Below 700px it uses a 590px minimum height and a 90px emblem. The contribution heading places its direct benchmark action beside the copy on desktop and below it on phones.

The desktop showcase is a three-track grid with a minimum height of 490px. The selected pane receives `1fr`; its two collapsed rails receive `.08fr` each, or `.11fr` at widths up to 900px. The measured 1440px layout gives approximately 1033px to active content and 83px to each inactive rail. Content width stays tied to the final active width while its pane expands. Inactive labels are vertical; the selected label becomes a horizontal caption.

At 700px and below, the showcase becomes a native tab layout: a horizontal tab row and one visible panel. Panels use normal document width and a 405px minimum content height. Respect safe-area insets in the company container.

`benchmark.html` opens the actual result explorer through `leaderboard.js`; `leaderboard.html` is a compatibility entry into the same results. There is no second benchmark introduction or duplicate hero. Both use the same filters, sort state, comparison selection, model links and official generated data. On phones, search stays exposed; entry type, provider, sort and reset move into the native **Filters & sort** disclosure. A compact four-button measurement row and first scored result remain visible without opening that disclosure. The default phone score view keeps model identity and score together; broader metric views allow horizontal table scrolling.

Other evidence routes retain their working structures: compare juxtaposes policies with three evidence views; model uses Overview / Scenarios / Diagnostics / Sources; scenarios pairs challenge navigation with actual world/population evidence and Rankings / Across all scenarios; methodology uses a reading column with a table of contents and disclosed reference tables. Existing query strings, model IDs and hash links remain meaningful.

The global header is generated once by `common.js` on every route: Anantam, Our work, EMBERBenchmark, Methodology and GitHub. Analytical routes add Results / Compare / Scenarios below it. Navigation collapses at 1100px; content layout changes principally at 700px. Mobile menu Escape restores focus to Menu.

## Elevation & Depth

Tonal layering, whitespace and thin structural rules provide depth. Shared buttons and panels have no shadow at rest. Selected evidence tabs and the comparison tray use the restrained shared shadow `0 12px 36px #142e510b`. The showcase is white with a thin border; emphasis comes from expansion and its actual contents.

Fine hover pointers select showcase panes on entry. Local GSAP interpolates numeric fractional weights for 650ms with `power3.out`; interrupted changes kill the previous expansion. There is no pointer-following tilt. Content enters after a 200ms delay, with opacity at 140ms and a 400ms rise using `cubic-bezier(.2,0,0,1)`. Keyboard, reduced-motion, phone and touch track changes are immediate; keyboard activation also suppresses scene motion.

Scene motion is finite: the environment traces its corridor highlight over 1.3 seconds, introduces the eight person markers with a short stagger and pulses the fire halo once out and back. Results and methodology use short staged entrances. The environment first plays when the showcase enters view; selecting another pane replaces the current scene. This is an animated initial-state illustration, not an evaluated replay. Reduced motion preserves static artwork and immediate state changes. Ordinary button response uses 150ms transitions and a 0.96 press scale where motion is allowed.

## Shapes

Actions and evidence view selectors use capsules. Analytical surfaces use 16px corners; the showcase uses 18px. Inputs use 8px corners with a stronger semantic border. Phone showcase tabs use 8px corners, and the compact measurement row uses 12px corners. Controls maintain at least 44px targets; the introductory action is at least 48px tall. Small rounded grid cells describe the map rather than establishing a general card motif.

## Components

### Expanding benchmark showcase

Environment, Results and Methodology are semantic tabs with roving focus, Arrow keys, Home and End. Inactive content is inert and hidden from assistive technology. Hover changes only occur for fine pointers above 700px and do not override a visible keyboard focus inside the showcase. Without GSAP, the CSS-selected state still displays content. Without scripting, the initial environment and its link remain useful.

Environment renders the public `v1-pub-03-corridor-bottleneck` initial layout: a 15×7 grid, eight people, a fire on the left, a one-cell corridor and one exit on the right. The corridor highlight does not claim recorded agent behavior. Its link opens that exact scenario.

Results loads the first four decision models under the benchmark's existing ordering, with model deep links and the explicit label **EMBER score, 0–100**. Scope states public development results, one trial per model and descriptive ranks. Its fallback and **View all results** action lead directly to `benchmark.html`. Methodology links to the inspectable evaluation and scoring explanation. Keep the contribution focused on this published work.

### Buttons and fields

Primary capsules use navy with white text; secondary actions use white with primary ink and a thin border. Hover uses a restrained surface mix only on supported pointers. Use visible focus rings, visible labels and native selects. Disabled actions use their established semantics. Search, filtering, sorting and reset remain immediate.

### Navigation and evidence controls

Keep the shared header, current-page cues, skip link and mobile Menu behavior consistent. The analytical subnavigation serves research tasks beneath that header. Labels and values supplement provider and chart colors. Empty tooltips are hidden from assistive technology. Selecting 2–4 models creates the comparison tray; fixed published rank remains distinct from a custom sort.

### Analytical loader

Benchmark, its leaderboard compatibility route, compare, model, scenarios and methodology show the shared loader only while actual analytical data is pending. The company introduction has no pending-data loader.

The loader centers the supplied infinity emblem, Anantam wordmark and a short status on the paper ground. The still PNG keeps its original colors and transparent outline. `boot.js`, `loader.css` and `cosmos.js` own the temporary alpha-masked canvas flight and lifecycle. Canvas is capped at 30 frames per second and suspended offscreen or in a hidden tab. Reduced motion or unavailable canvas keeps the still artwork. Reload page appears after eight seconds; ready or failed content replaces the loader immediately and teardown releases animation, listeners, observer and timer.

**The Honest Loading Rule.** Show branded loading only while data is pending; never hold usable content for a brand sequence.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied logo, local fonts and one light appearance.
- **Do** keep the company introduction and its action centered.
- **Do** show the actual scenario, labelled metric and visible evidence scope.
- **Do** open actual results directly from every benchmark action.
- **Do** preserve generated-data provenance, model IDs, scoring and deep links.
- **Do** use immediate keyboard and reduced-motion states and native phone disclosures.

### Don't:

- **Don't** reintroduce a dark theme, a navy marketing statistics card or an emblem mat.
- **Don't** add a future-outlook section, speculative product catalogue or invented trust metrics.
- **Don't** substitute an old benchmark hero for the results destination.
- **Don't** call the initial-state map an evaluated replay or animate people as fabricated evacuation results.
- **Don't** add pointer tilt, continuous homepage flight or motion required to understand content.
- **Don't** edit generated results or scoring definitions by hand.
