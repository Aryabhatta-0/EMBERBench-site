---
name: Anantam
description: A quiet research interface for intelligence, measured.
colors:
  primary: "#142e51"
  canvas: "#fafaf7"
  surface: "#ffffff"
  text: "#15283f"
  secondary: "#455467"
  muted: "#596675"
  focus: "#2865b1"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(64px, 7.4vw, 96px)"
    fontWeight: 400
    lineHeight: 0.99
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  field: "8px"
  surface: "16px"
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
---

# Anantam design system

The identity pairs the supplied midnight-blue emblem with a quiet, spacious research interface. Sarvam informed the short introduction and obvious primary action; Gnani informed the immediate path from positioning to measurable evidence. Assets and source styles from those sites are not copied.

## Tokens

`site/anantam.css` owns the visual tokens and route-wide refinements. `site/style.css` retains the existing chart and data-table geometry. Components use semantic variables so appearance changes together across light and dark themes.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | #fafaf7 | #0e1825 |
| Surface | #ffffff | #152231 |
| Primary text | #15283f | #eff3f7 |
| Secondary text | #455467 | #c4ced9 |
| Muted text | #596675 | #abb9c8 |
| Action | #142e51 | #c4d8ef |
| Focus | #2865b1 | #b2d4ff |

Locally hosted Instrument Serif supplies the display voice. DM Sans handles controls, reading, and data. Both include their OFL licenses. Data uses tabular numerals. Headings balance naturally without coloring individual words.

Controls have a 44px minimum height. Primary buttons and segmented tabs use capsules; content surfaces use 16px corners. Thin rules are limited to data rows and places where separation conveys structure. Input boundaries use a stronger semantic border token. Focus outlines are immediate and visible.

## Surfaces and flow

Homepage mode: Persuade. Three sections: the introduction with the supplied emblem, one evidence workspace with Rankings / Trade-offs / Scenarios, and a brief explanation of the research. Detailed charts and provenance use native disclosure elements. Scope and uncertainty remain visible below the workspace.

Leaderboard, comparison, model, and scenario modes: Operate. Methodology mode: Read. Existing filtering, sorting, selection, chart tooltips, query strings, data provenance, and relative routes remain available. Model details are contextual destinations rather than a global navigation item.

## Motion and accessibility

Motion personality: calm corporate. A single 600ms emblem entrance introduces the brand; interactions use explicit-property transitions at 150ms, with a 0.96 press scale. Frequent tab and data changes remain immediate. Reduced motion disables movement. No continuous animation or Lottie runtime is necessary.

Native selects and disclosures retain keyboard behavior. Tabs follow the tablist/tab/tabpanel pattern, roving focus, Arrow keys, Home and End. Escape closes the mobile menu and restores focus. Empty tooltips are hidden from assistive technology. Color is supplemented by labels and values.

Theme initialization precedes stylesheets. A static homepage introduction survives JavaScript being unavailable. CSP allows local scripts and fonts; existing chart geometry requires inline styles. It does not allow inline JavaScript.

## Deliberate constraints

The user's three-section, low-divider direction takes precedence over generic six-to-nine-section recommendations. The chart stylesheet retains its tested spacing geometry rather than forcing every existing value onto a new spacing scale. Applecn and shadcn are installed design skills; their React components are not shipped in this vanilla-JavaScript application.
