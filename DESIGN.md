---
name: Anantam
description: A compact company signature and visible, inspectable experimental evidence.
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
  experiment-ground: "#f0f2eb"
  world-floor: "#f6f6f0"
  world-wall: "#d4d8d2"
  world-grid: "#e8eae3"
  world-person: "#183c58"
  world-fire: "#f2bc7b"
  world-fire-ink: "#a34925"
  world-exit: "#c8e1d1"
  world-exit-ink: "#285c45"
  outcome-safe: "#376f61"
  outcome-death: "#b75b3f"
  outcome-stranded: "#b18d34"
  outcome-unavoidable: "#8a9096"
  chart-track: "#e9eef1"
  chart-selected: "#edf2f5"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(80px, 8vw, 96px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "44px"
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
  outcome: "14px"
  control: "999px"
  inspector: "12px"
  stage-control: "7px"
  chart-track: "2px"
  people-strip: "3px"
spacing:
  small: "8px"
  medium: "16px"
  large: "32px"
  company-gutter: "44px"
  phone-gutter: "20px"
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
  experiment-stage:
    backgroundColor: "{colors.experiment-ground}"
    textColor: "{colors.text}"
    rounded: "{rounded.surface}"
  outcome-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.outcome}"
    padding: "24px 28px"
  evaluation-stage-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.field}"
    padding: "12px 10px"
  result-row-selected:
    backgroundColor: "{colors.chart-selected}"
    textColor: "{colors.text}"
    rounded: "{rounded.field}"
    padding: "14px 12px 13px 4px"
  result-inspector:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.text}"
    rounded: "{rounded.inspector}"
    padding: "22px 24px"
  search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.field}"
---

# Anantam design system

## Overview

**Creative North Star: "Intelligence. An open question."**

The supplied navy infinity emblem anchors a light, spacious identity. Local Instrument Serif gives the company signature and editorial headings their character; DM Sans makes controls, explanations and evidence readable. Compact introductions leave room for the experiment itself.

Visible product proof defines the current expression: a large evacuation player, exact published people-outcome pictographs and a connected evaluation explanation. Analytical routes share the same paper, navy and local type while changing their composition for inspecting results, worlds and research. This records the implementation and the preserved brand; no supplied image composition has been approved.

**Key Characteristics:**

- One light paper-and-navy identity with the supplied transparent emblem.
- Compact centered company signature and visible contribution substance.
- Real world geometry, explicitly labelled reference replays and published model outcomes.
- Context-preserving analytical navigation and readable exact evidence.
- Purposeful, finite motion with immediate keyboard and reduced-motion states.

## Colors

Navy ink and actions sit on warm paper. White identifies controls and outcome cards; the muted green-gray experiment ground gives the environment its own material. Frontmatter records active primitives from `site/anantam.css`, `site/experience.css` and `site/result-explorer.css`.

### Primary

- **Navy:** the original brand, primary actions, scores and main evidence marks.
- **Focus blue:** visible keyboard outlines, normally two pixels with a four-pixel offset.
- **Analytical series:** teal, rust and blue distinguish evidence series alongside labels and values.

### Secondary

- **Exit green and deep exit ink:** available exits in the world geometry.
- **Evacuated green:** people who reached an exit in the recorded outcome readout.

### Tertiary

- **Fire apricot and fire rust:** fire cells and their flame symbols.
- **Avoidable-death rust and stranded ochre:** distinct recorded outcomes. Homepage and analytical readouts share the stranded token.

### Neutral

- **Paper / white / subtle surface / experiment ground:** page, controls and cards, secondary inspection, and environment stage.
- **Primary / secondary / muted ink:** identity and evidence, explanations, and provenance.
- **Border / grid / input border:** structure, data division and field boundaries.
- **World floor / wall / grid / person:** traversable cells, obstacles, cell boundaries and active person markers.
- **Chart track / selected:** metric track and inspected row. Unavoidable losses retain their neutral analytical token.

The higher-contrast preference strengthens borders and analytical grid lines to secondary ink.

**The Light Appearance Rule.** Keep the single light palette established by `theme-init.js` and shared `color-scheme: light`.

**The Evidence Color Rule.** Pair outcome colors with visible labels and exact counts. Initial world geometry, illustrative reference behavior and published model outcomes have distinct meanings.

## Typography

**Display Font:** locally hosted Instrument Serif, with Georgia and serif fallbacks.

**Body Font:** locally hosted DM Sans, with system-ui and sans-serif fallbacks. Preserve both OFL licenses.

The serif sets the company signature and editorial hierarchy. The sans carries the interactive experiment and analytical evidence. Scores, steps and counts use tabular numerals; metric units stay visible.

- **Company display:** frontmatter display role capped at 96px. Phones use 70px; at 360px and below the signature reduces to 62px.
- **Contribution headline:** frontmatter headline role; 36px on phones. The outcome editorial heading uses 44px / 1.05, reducing to 37px.
- **Route headings:** benchmark `clamp(40px,4vw,56px)`, scenarios and methodology 50px, compare 48px. Phone equivalents are 38px, 38px and 36px. Profiles retain their responsive heading and an 84px score.
- **Experiment title:** 20px caption, 24px world readout and 23px evaluation heading. The readout reduces to 21px on phones.
- **Body:** 16px / 1.6 base; company description 18px, reducing to 15px. Experiment and analytical prose generally uses 12–14px with 65–72ch reading measures.
- **Labels:** shared actions use the frontmatter label role. Secondary controls, scope and provenance use 10–12px. Phone selects and search fields use 16px.

## Layout

Home is capped at 1328px with 44px side padding, reducing to 20px at 700px. Its centered signature places an 86px emblem beside the wordmark with a 22px gap. The introduction uses 72px top and 66px bottom padding. Phones use 52px and 48px padding, a 54px emblem and 13px gap.

The contribution stays in reading order: heading and direct benchmark action, environment player, published outcome cards, then evaluation explanation. All three artifacts remain visible without choosing a concealed pane. Outcome cards use two columns with a 24px gap and become one column on phones. Metric scope and provenance stay beside the relevant artifact.

The desktop player uses a flexible map and 260px readout separated by 50px. At 1000px these become 210px and 26px. At 700px the order is choices, map, playback controls directly adjacent to the map, readout, provenance. SVG maximum heights are 340px desktop and 255px phone; actual world dimensions determine its aspect ratio. Timelines receive a full row on phones.

Scenario pages use horizontal challenge navigation on desktop and a labelled native selector above the map on phones. All ten initial layouts are available; three worlds have two reference replays each. The scenario stage action reveals Rankings in place. Model links preserve the scenario; profile breadcrumbs return to that world and model. Rankings and the cross-scenario matrix remain task views.

Benchmark opens actual visual results through `leaderboard.js`; `leaderboard.html` remains a compatibility entry. Chart and inspector use `minmax(0,1.45fr) minmax(290px,1fr)` with a 38px gap. At 1000px these become `minmax(0,1fr) minmax(260px,.8fr)` and 24px. At 700px the inspector follows its selected row. Search stays exposed; native Filters & sort holds secondary controls. Scores, People, API usage and All metrics keep their units; the exact table shares state and data.

Profiles and comparison place content directly on paper without an enclosing white workspace panel. Profiles lead with people outcomes and the five lowest scenario scores; technical components and per-world evidence remain accessible through native disclosures. Compare places selectors and compact score/95% CI summaries before Outcomes, Scenarios & worlds and Diagnostics. Methodology has a reading column, desktop contents rail and connected loop; the rail disappears on phones.

The global header serves Anantam, Our work, EMBERBenchmark, Methodology and GitHub. Analytical subnavigation adds Results, Compare and Scenarios. The menu changes at 1100px; principal evidence layouts change at 1000px and 700px. Preserve skip links, focus restoration, query strings and hashes.

## Elevation & Depth

Tonal layering, whitespace and thin data rules create depth. Shared buttons, the experiment stage and outcome cards are flat at rest. Selected shared evidence tabs and the comparison tray may use `0 12px 36px #142e510b`. Scenario tabs use underlines. Transparent profile and comparison panels let analytical structure provide hierarchy.

Pictographs regroup through interruptible CSS transforms over 580ms with `cubic-bezier(.2,0,0,1)`. Fine-pointer hover separates outcomes; pointer exit restores the grid unless the explicit button has locked grouping. Keyboard activation and reduced motion update immediately. Both arrangements retain exactly one marker per person.

Reference frames advance every 430ms only after explicit Play. Local GSAP interpolates actual surviving person positions for 220ms with `power2.out`. Pause, restart, scrub, world/policy changes and hidden documents stop playback. Reduced motion retains user-controlled discrete frames and skips interpolation. The signature and first stage entrance use finite 800ms translations with `power3.out`, without delaying content.

Pointer selection of a loop explanation uses a 200ms, five-pixel rise. Result selection updates its inspector immediately and may use a 220ms, six-pixel entrance with opaque text. Keyboard, search, sorting, native select changes and reduced-motion responses are immediate. Shared buttons use 150ms feedback and a 0.96 press scale where motion is allowed.

## Shapes

Route actions and shared evidence selectors use capsules. The experiment stage uses 16px corners; outcome cards and the scenario stage use 14px. Inputs and loop stages use 8px, player controls 7px, and inspectors 12px. Score tracks use 2px corners and analytical people strips 3px. World cells and tiny person pictographs have local geometry. Main controls maintain 44px minimum targets; home route actions use 48px.

## Components

### Reference replay player

World choices, a native reference-agent select, map, counts, source action and playback controls form one stage. Bottleneck, unequal exits and threatened exit each offer Shortest path and Avoid current fire: six independently generated hand-coded reference runs, explicitly illustrative rather than published AI-model results. Some rules produce the same outcome; do not promise a difference.

Play/Pause, Restart and a labelled Step range support inspection without autoplay. Switching a world or policy clears the old replay, step, source-record URL and pending metadata before loading. Revision checks prevent stale fetches from replacing the current world. Static initial worlds have no replay controls or source-record download. Failure preserves the initial map and a useful route to evidence.

The local demo index carries the source commit and record digests. Complete RunRecords and replay frames ship with Apache-2.0 source attribution. Downloads belong to the selected successful load. Maps derive obstacles, people, exits and ignition from actual coordinates; accessible labels distinguish an initial layout from a replay step.

### Published outcome pictographs

The two home cards read scores and totals from `site/data/results.js`. Each has exactly 241 person markers across evacuated, avoidable deaths and avoidable stranded outcomes, plus exact numeric legends. Grid and separated arrangements represent the same people. Separate outcomes supports touch and keyboard users and reports its locked state with `aria-pressed`. Inspection and pair comparison open the corresponding published evidence.

Scope identifies published AI-model results, one trial and descriptive comparison. Counts sum across worlds while EMBER balances scenario families and includes execution quality. A composite score is not a survival percentage. Never derive marker counts from the score.

### Connected evaluation explanation

Five visible buttons connect Observe → Decide → Simulate → Verify → Score. The return annotation identifies the repeating Observe–Decide–Simulate cycle; verification and scoring follow the completed record. Choosing a stage replaces its explanation and position counter. Left/Right keys move focus and selection immediately. Home and methodology share the component; on phones verification and scoring continue below the first three visible stages.

### Results and nearby inspector

Rows carry identity, metric value and a proportional bar. Selection reveals provider, scope, score, 95% CI, people outcomes, scenario evidence, a profile action and quick comparison nearby. Arrow Up/Down, Home and End retain focus. Phones place the inspector after its row. The labelled analytical people strip recurs in profiles and comparison.

Visual results default to AI decision models; reference agents and all entries are explicit choices. Scores use a fixed 0–100 axis; other metrics keep their units and direction. Missing evidence is a dash. Preserve query, lens, cohort, provider, sort, display, model, comparison and expanded state across shared links and format changes. Custom sorts do not rewrite published rank semantics.

### Actions, fields and navigation

Primary capsules use navy and white; secondary actions use white, ink and a thin border. Player buttons use compact rounded rectangles. Native inputs and selects keep visible labels, semantic disabled states and focus outlines. Provider chips identify providers in text. Shared navigation and current-page cues stay consistent. Technical detail can use native disclosures without concealing the homepage contribution.

### Pending analytical loader

Analytical routes show the shared loader only while actual data is pending; home has no loader. The supplied still emblem, wordmark and status remain useful when canvas or reduced motion prevents temporary animation. `boot.js`, `loader.css` and `cosmos.js` own the lifecycle. Ready or failed content replaces it immediately and teardown releases its resources.

**The Honest Loading Rule.** Show branded loading only while data is pending; never hold usable content for a brand sequence.

## Do's and Don'ts

### Do:

- Do preserve the supplied transparent navy emblem, local fonts and one light appearance.
- Do keep the company signature centered and the contribution's player, outcomes and evaluation explanation visible.
- Do distinguish authenticated illustrative reference replays from published AI-model results.
- Do retain exact geometry, person counts, labelled metrics, evidence scope and source attribution.
- Do preserve selected world/model context, native phone controls and immediate keyboard states.
- Do use finite, interruptible motion to explain real state changes.
- Do preserve generated results, scoring, confidence intervals, model IDs and shareable analytical state.

### Don't:

- Don't restore the sparse viewport-height hero or conceal the homepage contribution behind expanding rails.
- Don't add a dark theme, emblem mat, navy marketing-statistics card or speculative product catalogue.
- Don't autoplay reference replays or present them as the published AI-model runs.
- Don't leave an old source-record link or replay controls attached to a static or newly loading world.
- Don't substitute decorative person counts, fake evacuation movement or a survival percentage for actual evidence.
- Don't wrap every analytical route in the same oversized white panel.
- Don't edit generated results or scientific definitions by hand, or require motion to understand content.
