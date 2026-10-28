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

Desktop hero padding is 44px above and 52px below. The action stays visible in the first screen. The hero uses height: calc(100svh - measured header height), with a compact identity arrangement in short landscape windows. The layout remains two main sections, respecting the user's preference for fewer layouts and less copy.

The hero gradient extends beneath its first-screen content into a broad asymmetric Bézier shore, 100–180px on desktop and 80px on phones. The gradient is owned by the shared hero stage, so there is no seam between the hero and its tail. A porcelain inverse path reveals the next section. The existing hero's own height and overflow clipping are unchanged.

The contribution is a single text-led introduction, capped at 1440px with 48px desktop gutters and a 780px reading block. Instrument Serif gives EMBERBench a 3.5rem title; DM Sans carries a 1.5rem description and 1.125rem supporting paragraphs. Their line heights are 1.1, 1.6 and 1.65, with 24px and 20px role spacing. At 700px and below the scale becomes 2.75rem / 1.25rem / 1rem with 20px gutters and 20px / 16px spacing. Rem units preserve browser text scaling, headings balance and prose wraps naturally. No right column, stock image, feature list, model scores or charts appear here. The homepage no longer loads the results artifact or an evaluation-loop script.

The hero contains the homepage's sole benchmark CTA. No navigation links, duplicate Explore action or promotional subheading appear in the contribution. There is no map, reference agent selector, playback timeline, player readout or replay download. Scenario routes preserve source definitions, population/world counts, descriptions, model evidence, rankings and the matrix. Selecting a scenario keeps model context and URL state. Profiles return to the selected scenario/model.

## Motion and interactions

Fine particles assemble into the actual supplied emblem, using sampled alpha/ink targets. The emblem is 156px desktop and112px phone. The particle emblem assembles once over three seconds and stays complete; resize and returning from offscreen do not replay it. Pale side contours draw once, then drift continuously with a slow transform. No dark traveling highlight is present. The title and action stay still. One Canvas renders up to1,800 desktop or1,000 phone particles at30fps and capped1.5 pixel density. Reduced motion shows the completed mark; hidden/offscreen suspends work; resize recalculates targets and navigation cleans up. The original emblem remains the Canvas/sampling/no-JavaScript fallback. No pointer tracking or motion-control button; the companion side ribbons remain clipped within the hero.

The homepage introduction is static and readable without JavaScript. Published people-outcome visualizations remain on analytical pages, where they serve the actual results.

The Methodology evaluation loop uses immediate selection and a small pointer-only explanation entrance. Native controls, visible keyboard outlines, 44px targets, failure recovery and shared site navigation remain. The palette applies to all routes, including the analytical loader's surroundings.

## Data and scope

Anantam’s tagline is always **Boundless Possibilities**; EMBERBench is its sole published contribution. Do not invent launches, testimonials, customer metrics or future products. Published results, ranks, scoring definitions and model identities are unchanged. Scores are composite results, not survival percentages. Keep one-trial, public-development and descriptive-comparison qualifications visible.

The removed reference player, geometry data, replay records, animation exports and generator are no longer shipped. Scientific simulation remains part of the underlying benchmark and its methodology; removing its website visualization does not change that research process.

## Hallmark exceptions

White controls and white labels on navy remain for legibility. Existing optical spacing is kept in the analytical routes. The hero fills the visible viewport below the actual header; contributions start after the first screen. Labeled person pictographs remain as actual statistical evidence. These four exceptions are recorded in experience.css and inherited by this locked system. They do not waive accessibility or functional defects.

## Scrolling benchmark results

The leaderboard spans the browser width with 32px desktop and 20px phone gutters. Every bar chart stays vertical, including on phones. Every series sorts highest to lowest by its own numeric value, with unavailable measurements last; lower-is-better metrics retain that explanation. Official rank metadata and scientific tie-breaks are unchanged. The main desktop ranking fits all 19 decision models together. If columns or labels become crowded, the measured layout continues into vertical bands with repeated axes. Per-chart zoom enlarges columns, labels and plot height, adding bands below without hiding models or creating horizontal page scrolling. The safety/quality scatter is replaced by two separately sorted vertical factor plots. People outcomes are vertical 100% stacked columns ordered by evacuation share, with exact counts on hover/focus. Each of ten scenario charts sorts independently by its own score. No model is featured by default. Provider logos, observed brand colours, direct values, zero baselines and model/scenario evidence links are preserved. Source identities remain recorded in assets/providers/SOURCES.json.

Methodology keeps the global site header and its local contents list. It does not show benchmark sub-navigation or an Explore the results action. Links to full hosted protocol guides are retained as reading references.

Scenarios mirrors that reading design: a 190px sticky challenge index, a 58px gap and an open article. Its headings share Methodology's serif treatment. The horizontal challenge rail, dashboard tabs and extra top navigation are removed. Ranking evidence stays visible, model filters are disclosed on demand, and the matrix/catalogue expand inline. At 700px and below a native scenario selector replaces the side index. Deep-linked evidence sections expand automatically.

Every page ends in a shared company footer with the same asymmetric Bézier shore inverted above a light mist-blue/ivory field. Its content is capped at 1440px with 48px gutters, becoming 20px on phones. Anantam's supplied emblem, name, exact tagline and first-contribution statement lead; Research and Resources links occupy two columns. Copyright sits in a separate bottom row. The main site uses a shared renderer that also generates static docs and not-found footers. The footer is the explicitly requested company detail area; it does not add CTAs inside the homepage contribution.

Documentation has a separate local library at docs.html. Reviewed public contracts and local scope guides use the locked navy palette and local fonts, a readable text measure, searchable guide navigation and an on-page contents list. Protocol links open hosted guides. Reviewed Markdown and source revision/license records are retained; JavaScript is an enhancement rather than a prerequisite for reading. Code examples and wide reference tables scroll locally within their document, never the page.

The company main wrapper has width 100%, no side margins and no maximum width. Header and hero share mist blue, eliminating an inset rectangular panel. Hero and particle layer both clip overflow; a vertical mask fades the field before its boundaries. Particles never extend into the contribution section. The displayed contribution name is EMBERBench everywhere.

Production polish (27 October 2026): the hero keeps its source-image fallback hidden during normal startup. Particle sampling and pale contour motion wait for decoded artwork, loaded fonts and settled header layout. No source-image flash occurs on refresh; no-JavaScript and Canvas-failure fallbacks retain the supplied artwork. Results use one unboxed scope paragraph, aligned search and Filters controls, and an inline responsive filter row with active-count feedback and reset. Chart zoom buttons are removed; automatic vertical bands preserve every model without sideways scrolling. These requirements supersede earlier per-chart zoom and floating-filter instructions.

Reading and consent revision (28 October 2026): company pages preserve a 190px index and 56px gap to an open 780px article. Keep the actual index/header nodes mounted; reserve the scrollbar gutter and align the sticky index with its initial position. Phones keep a sticky wrapping index. No company footer appears on Methodology, docs or the company/policy workspace. About is included in the same shared header across all generated routes. These explicit changes override the earlier every-page footer rule.

The first-visit consent notice uses the existing porcelain/navy tokens, DM Sans, a single white surface and equal outline accept/reject controls. It stays non-modal, never steals focus and enters with one 180ms/8px transform when motion is allowed. Keep the notice fully opaque throughout so its text never loses contrast during entry. Its measured phone footprint is reserved above the actual-emblem loading region. The logo loader is visible only while interactive research is pending; no minimum brand duration is imposed, and no-JavaScript/slow/failed loads retain real reading material.
