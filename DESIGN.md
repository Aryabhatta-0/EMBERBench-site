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

The centered identity stacks the original 76px emblem over Anantam at clamp(112px,10vw,144px). It sits directly on a full-width flat mist-blue field, without gradient, fabricated illustration, decorative grid or extra slogan. One sentence identifies the company and one primary action opens benchmark.html directly. Content is capped within the hero; the colored field spans the viewport.

Desktop hero padding is 44px above and 52px below. The first contribution follows with 54px top padding, within a centered 1328px measure and 44px gutters. On phones the emblem is 64px, title clamp(82px,17vw,112px), gutters 20px, hero padding 35px/40px and contribution top spacing 34px. The action stays visible in the first screen. The layout remains two main sections, respecting the user's preference for fewer layouts and less copy.

The contribution contains its title and direct action, existing published outcome comparisons and the connected evaluation explanation. There is no map, reference agent selector, playback timeline, player readout or replay download. Scenario routes preserve source definitions, population/world counts, descriptions, model evidence, rankings and the matrix. Selecting a scenario keeps model context and URL state. Profiles return to the selected scenario/model.

## Motion and interactions

The company signature makes one finite 18px entrance over 800ms when motion is allowed. The hero action's arrow moves 4px on fine-pointer hover. Reduced motion skips the entrance and hover transition. Content remains visible without JavaScript.

The existing outcome pictographs encode exact published people counts, with visible numeric labels. Hover regroups the same people through interruptible CSS transforms over 580ms; the explicit Separate outcomes button serves touch and keyboard. Keyboard and reduced motion are immediate. These are labeled statistical charts, not evacuation simulation maps or invented marketing counts.

The evaluation loop uses immediate selection and a small pointer-only explanation entrance. Native controls, visible keyboard outlines, 44px targets, failure recovery and shared site navigation remain. The new palette applies to all routes, including the analytical loader's surroundings.

## Data and scope

Anantam is an experimental AI company; EMBERBenchmark is its sole published contribution. Do not invent launches, testimonials, customer metrics or future products. Published results, ranks, scoring definitions and model identities are unchanged. Scores are composite results, not survival percentages. Keep one-trial, public-development and descriptive-comparison qualifications visible.

The removed reference player, geometry data, replay records, animation exports and generator are no longer shipped. Scientific simulation remains part of the underlying benchmark and its methodology; removing its website visualization does not change that research process.

## Hallmark exceptions

White controls and white labels on navy remain for legibility. Existing optical spacing is kept in the analytical routes. The hero stays compact enough to reveal the contribution rather than fill an arbitrary viewport height. Labeled person pictographs remain as actual statistical evidence. These four exceptions are recorded in experience.css and inherited by this locked system. They do not waive accessibility or functional defects.
