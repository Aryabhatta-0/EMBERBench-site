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

The centered identity stacks the original 76px emblem over Anantam at clamp(112px,10vw,144px). It sits directly on a full-width flat mist-blue field, without gradient, fabricated illustration, decorative grid or extra slogan. Fine suspended particles frame the identity; see the motion specification below. One sentence identifies the company and one primary action opens benchmark.html directly. Content is capped within the hero; the colored field spans the viewport.

Desktop hero padding is 44px above and 52px below. The first contribution follows with 54px top padding, within a centered 1328px measure and 44px gutters. On phones the emblem is 64px, title clamp(82px,17vw,112px), gutters 20px, hero padding 35px/40px and contribution top spacing 34px. The action stays visible in the first screen. The hero uses height: calc(100svh - measured header height), with a compact identity arrangement in short landscape windows. The layout remains two main sections, respecting the user's preference for fewer layouts and less copy.

The contribution contains its title and direct action, existing published outcome comparisons and the connected evaluation explanation. There is no map, reference agent selector, playback timeline, player readout or replay download. Scenario routes preserve source definitions, population/world counts, descriptions, model evidence, rankings and the matrix. Selecting a scenario keeps model context and URL state. Profiles return to the selected scenario/model.

## Motion and interactions

Fine particles assemble into the actual supplied emblem, using sampled alpha/ink targets. The emblem is 156px desktop and112px phone. The particle emblem assembles once over three seconds and stays complete; resize and returning from offscreen do not replay it. Side ribbons draw and travel once alongside it, then hold. The title and action stay still. One Canvas renders up to1,800 desktop or1,000 phone particles at30fps and capped1.5 pixel density. Reduced motion shows the completed mark; hidden/offscreen suspends work; resize recalculates targets and navigation cleans up. The original emblem remains the Canvas/sampling/no-JavaScript fallback. No pointer tracking or motion-control button; the companion side ribbons remain clipped within the hero.

The existing outcome pictographs encode exact published people counts, with visible numeric labels. Hover regroups the same people through interruptible CSS transforms over 580ms; the explicit Separate outcomes button serves touch and keyboard. Keyboard and reduced motion are immediate. These are labeled statistical charts, not evacuation simulation maps or invented marketing counts.

The evaluation loop uses immediate selection and a small pointer-only explanation entrance. Native controls, visible keyboard outlines, 44px targets, failure recovery and shared site navigation remain. The new palette applies to all routes, including the analytical loader's surroundings.

## Data and scope

Anantam is an experimental AI company; EMBERBench is its sole published contribution. Do not invent launches, testimonials, customer metrics or future products. Published results, ranks, scoring definitions and model identities are unchanged. Scores are composite results, not survival percentages. Keep one-trial, public-development and descriptive-comparison qualifications visible.

The removed reference player, geometry data, replay records, animation exports and generator are no longer shipped. Scientific simulation remains part of the underlying benchmark and its methodology; removing its website visualization does not change that research process.

## Hallmark exceptions

White controls and white labels on navy remain for legibility. Existing optical spacing is kept in the analytical routes. The hero fills the visible viewport below the actual header; contributions start after the first screen. Labeled person pictographs remain as actual statistical evidence. These four exceptions are recorded in experience.css and inherited by this locked system. They do not waive accessibility or functional defects.

## Four-chart benchmark overview

The leaderboard uses a compact 2x2 grid on desktop: five-entry vertical ranking columns; safety versus execution quality; a selected-model outcome donut; paired scenario scores in five-scenario pages. All four fit 1280x800 and larger tested desktop viewports without horizontal chart scrolling. Phones stack the four charts and combine search/filter access in one row. Native model selection, ranking bars and scatter points update all views. The table and full selected-model evidence follow. Page/model/scenario state survives reload through URL parameters. Scales, labels, exact counts and missing-value states are explicit.

The company main wrapper has width 100%, no side margins and no maximum width. Header and hero share mist blue, eliminating an inset rectangular panel. Hero and particle layer both clip overflow; a vertical mask fades the field before its boundaries. Particles never extend into the contribution section. The displayed contribution name is EMBERBench everywhere.
