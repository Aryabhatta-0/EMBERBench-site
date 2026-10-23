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

The analytical routes use distinct task structures inside the shared identity:

- Leaderboard: an editorial introduction and one explorer canvas. Scores, People, API usage, and All metrics change the measurements displayed; the selected lens is shareable in the URL. Mobile defaults keep names and scores together. Selection creates a floating comparison tray.
- Compare: directly juxtaposed policy scores and a three-view evidence workspace. Extra model selectors are disclosed on demand. Outcome tables remain available without dominating the initial view.
- Model profile: a score-led specimen page, concise outcome band, and Overview / Scenarios / Diagnostics / Sources tabs. Repeated coverage and people tables are disclosed. Existing hash anchors reveal the correct view and open its disclosure.
- Scenarios: a challenge navigator beside the scenario's actual description and population/world evidence, followed by Rankings and Across all scenarios views. Mobile offers a focused ranking and an explicit More columns control.
- Methodology: a continuous reading column with a navigable table of contents, rather than a grid of independent panels. Technical reference tables are disclosed; source wording and scientific qualifications remain intact.

Loading uses route-specific static headings and a branded skeleton while the actual data import is pending. It has no minimum display time or percentage. A slow load exposes a reload action after eight seconds. Resolved or failed content clears the busy state and the loading observer. Skeleton animation respects reduced motion.

## Motion and accessibility

Motion personality: calm corporate, with a user-requested continuous space-flight signature inside the homepage emblem. The supplied PNG remains the visible base in its original colours in both themes; a transparent, alpha-masked canvas adds perspective trails sharing one vanishing point. It does not replace the artwork with another coloured sky. Stars retain fixed spatial directions; camera depth advances at a constant velocity, so nearer stars grow and pass faster. No random wandering or twinkle cycle is used.

The flight runs at a maximum 30 frames per second, pauses offscreen or in a hidden tab, and has a visible Pause/Play motion control. Reduced motion and unavailable canvas retain the original still image. A single 600ms emblem entrance introduces the brand; interactions use explicit-property transitions at 150ms, with a 0.96 press scale. Frequent tab and data changes remain immediate. The loading skeleton pulses only while data is pending. No Lottie runtime is necessary.

Native selects and disclosures retain keyboard behavior. Tabs follow the tablist/tab/tabpanel pattern, roving focus, Arrow keys, Home and End. Escape closes the mobile menu and restores focus. Empty tooltips are hidden from assistive technology. Color is supplemented by labels and values.

Theme initialization precedes stylesheets. A static homepage introduction survives JavaScript being unavailable. CSP allows local scripts and fonts; existing chart geometry requires inline styles. It does not allow inline JavaScript.

## Deliberate constraints

The user's three-section, low-divider direction takes precedence over generic six-to-nine-section recommendations. The chart stylesheet retains its tested spacing geometry rather than forcing every existing value onto a new spacing scale. Applecn and shadcn are installed design skills; their React components are not shipped in this vanilla-JavaScript application.
