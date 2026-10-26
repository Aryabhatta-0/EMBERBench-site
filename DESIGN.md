---
name: Anantam
description: The supplied navy identity on porcelain and mist blue, with direct access to published research.
colors:
  primary: "#142e51"
  canvas: "#f8f9fc"
  hero: "#e9eff7"
  surface: "#fff"
  surface-subtle: "#edf1f7"
  text: "#172c46"
  secondary: "#445671"
  muted: "#53647a"
  border: "#d7dfeb"
  grid: "#e3e9f1"
  focus: "#2865b1"
  input-border: "#83909e"
  accent-soft: "#e9eff6"
  series-1: "#246d76"
  series-2: "#ab5839"
  series-3: "#416994"
  outcome-safe: "#376f61"
  outcome-death: "#b75b3f"
  outcome-stranded: "#b18d34"
  outcome-unavoidable: "#8a9096"
  chart-track: "#e9eef1"
  chart-selected: "#edf2f5"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(112px, 10vw, 144px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  field: "8px"
  outcome: "14px"
  control: "999px"
spacing:
  small: "8px"
  medium: "16px"
  large: "32px"
  company-gutter: "44px"
  phone-gutter: "20px"
---

# Anantam design system

The supplied navy infinity emblem, local Instrument Serif and local DM Sans are the brand anchors. The latest explicit user correction removes all evacuation-grid, initial-map and reference-replay interfaces. Do not restore them from earlier design notes or screenshots.

## Color direction

UI/UX Pro Max's Research Lab / University Department palette was the relevant match: institutional navy, light cool neutrals and serif headings. Adapt that family to the existing logo's #142e51 rather than substitute a new blue. Porcelain #f8f9fc is the global canvas, mist blue #e9eff7 carries the hero, white distinguishes controls and outcomes, and slate text provides a quieter hierarchy. Published outcome and analytical-series colors retain their semantic meaning and visible labels. Light appearance is mandatory regardless of system or stored preference.

All active marketing colors and fonts use root tokens in anantam.css and experience.css. Existing measured table spacing and white-on-navy controls are preserved. They are documented Hallmark exceptions, not an invitation to restyle every analytical control.

## Hero and composition

The centered identity stacks the supplied emblem, rendered in fine particles at 156px desktop and 112px phone, over Anantam at clamp(112px,10vw,144px). It sits on a full-width light gradient: mist blue, porcelain and a soft ivory edge. The exact tagline is **Boundless Possibilities**. One primary action opens benchmark.html directly. The gradient stays still; pale side contours drift continuously without a darker traveling overlay. Content is capped within the hero; the colored field spans the viewport.

Desktop hero padding is 44px above and 52px below. The first contribution follows with 54px top padding, within a centered 1328px measure and 44px gutters. On phones the emblem is 64px, title clamp(82px,17vw,112px), gutters 20px, hero padding 35px/40px and contribution top spacing 34px. The action stays visible in the first screen. The hero uses height: calc(100svh - measured header height), with a compact identity arrangement in short landscape windows. The layout remains two main sections, respecting the user's preference for fewer layouts and less copy.

The hero gradient extends beneath its first-screen content into a broad asymmetric Bézier shore, 100–180px on desktop and 80px on phones. The gradient is owned by the shared hero stage, so there is no seam between the hero and its tail. A porcelain inverse path reveals the next section. The existing hero's own height and overflow clipping are unchanged.

The contribution is an open editorial grid, capped at 1440px with 48px gutters and an 88px column gap. A 56–84px EMBERBench title and short description lead on the left; two model evidence rows align on the right. The white card frames and dot grids are removed. Exact people counts are encoded as striped bands, with direct labels and a serif EMBER score. The left-hand evaluation explanation uses a vertical step selector with a single adjacent description. At 850px and below the composition stacks in reading order: introduction, evidence, explanation. Phone gutters are 20px. Short factual captions retain scale, trial count and descriptive limitations.

The hero contains the homepage's sole benchmark CTA. No navigation links, duplicate Explore action or promotional subheading appear in the contribution; its outcome-grouping controls remain functional. Company footer links are removed. There is no map, reference agent selector, playback timeline, player readout or replay download. Scenario routes preserve source definitions, population/world counts, descriptions, model evidence, rankings and the matrix. Selecting a scenario keeps model context and URL state. Profiles return to the selected scenario/model.

## Motion and interactions

Fine particles assemble into the actual supplied emblem, using sampled alpha/ink targets. The emblem is 156px desktop and112px phone. The particle emblem assembles once over three seconds and stays complete; resize and returning from offscreen do not replay it. Pale side contours draw once, then drift continuously with a slow transform. No dark traveling highlight is present. The title and action stay still. One Canvas renders up to1,800 desktop or1,000 phone particles at30fps and capped1.5 pixel density. Reduced motion shows the completed mark; hidden/offscreen suspends work; resize recalculates targets and navigation cleans up. The original emblem remains the Canvas/sampling/no-JavaScript fallback. No pointer tracking or motion-control button; the companion side ribbons remain clipped within the hero.

The striped outcome bands encode exact published people counts, with visible numeric labels. Hover regroups the same people through interruptible CSS transforms over 580ms; the toggle is labeled Separate outcomes / Show together. Keyboard and reduced motion are immediate. ResizeObservers recalculate stripe pitches without a resize transition, and disconnect on final page exit. These are labeled statistical charts, not evacuation simulation maps or invented marketing counts.

The evaluation loop uses immediate selection and a small pointer-only explanation entrance. Native controls, visible keyboard outlines, 44px targets, failure recovery and shared site navigation remain. The new palette applies to all routes, including the analytical loader's surroundings.

## Data and scope

Anantam’s tagline is always **Boundless Possibilities**; EMBERBench is its sole published contribution. Do not invent launches, testimonials, customer metrics or future products. Published results, ranks, scoring definitions and model identities are unchanged. Scores are composite results, not survival percentages. Keep one-trial, public-development and descriptive-comparison qualifications visible.

The removed reference player, geometry data, replay records, animation exports and generator are no longer shipped. Scientific simulation remains part of the underlying benchmark and its methodology; removing its website visualization does not change that research process.

## Hallmark exceptions

White controls and white labels on navy remain for legibility. Existing optical spacing is kept in the analytical routes. The hero fills the visible viewport below the actual header; contributions start after the first screen. Labeled person pictographs remain as actual statistical evidence. These four exceptions are recorded in experience.css and inherited by this locked system. They do not waive accessibility or functional defects.

## Scrolling benchmark results

The leaderboard spans the browser width with 32px desktop and 20px phone gutters. It has no enclosing card, panel backgrounds or rounded chart frames. A full-width ranking chart shows ten models at a time with a 280px plotting height; larger safety/quality and people-outcome charts follow side by side. All ten scenarios appear as a selected-model horizontal bar chart with a fixed 0–100 scale and links to evidence. No comparison tables, selectors or table toggle appear on results. The separate comparison route retains deliberate multi-model analysis. The only initial controls are a compact model search and a closed Filters disclosure. Entry type, provider, ranking metric and reset sit inside that disclosure. Metric tabs, chart-jump links and a duplicate model selector are removed; bars and points select models directly. Phones stack the plots and use labeled ranking rows instead of cramped columns. Model, filter and ranking-page state survive reload. Scientific scales, counts, missing-value states and snapshot limitations are unchanged.

Methodology keeps the global site header and its local contents list. It does not show benchmark sub-navigation or an Explore the results action. Links to full hosted protocol guides are retained as reading references.

Documentation has a separate local library at docs.html. Complete static articles use the locked navy palette and local fonts, a readable text measure, a searchable guide navigation and an on-page contents list. All benchmark protocol links open hosted guides. Original Markdown and the source revision/license are retained; JavaScript is an enhancement rather than a prerequisite for reading. Code examples and wide reference tables scroll locally within their document, never the page.

The company main wrapper has width 100%, no side margins and no maximum width. Header and hero share mist blue, eliminating an inset rectangular panel. Hero and particle layer both clip overflow; a vertical mask fades the field before its boundaries. Particles never extend into the contribution section. The displayed contribution name is EMBERBench everywhere.
