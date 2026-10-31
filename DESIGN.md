---
name: Anantam
description: Golden dawn. The supplied gold mandala and Earth wordmark on Ivory, with Indian heritage in the details and direct access to published research.
colors:
  ivory: "#FAF3E8"
  dawn: "#F1D4A2"
  gold: "#D9A24C"
  copper: "#A96930"
  earth: "#39291F"
  primary: "#39291f"
  canvas: "#faf3e8"
  surface: "#fffbf4"
  surface-subtle: "#f5e6cc"
  text: "#39291f"
  secondary: "#5e4a3b"
  muted: "#6b5444"
  border: "#e7d5b6"
  grid: "#efe2cb"
  link: "#8c5321"
  focus: "#a96930"
  input-border: "#9a7b5c"
  accent-soft: "#f5e6cc"
  series-1: "#1f6b6b"
  series-2: "#a96930"
  series-3: "#3c4f86"
  outcome-safe: "#2f6f5e"
  outcome-death: "#b4472c"
  outcome-stranded: "#ae7a16"
  outcome-unavoidable: "#8f8274"
  chart-track: "#f2e5cf"
  chart-selected: "#f7ebd6"
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

The supplied gold mandala (text removed), the Earth "anantam" wordmark, local Instrument Serif and local DM Sans are the brand anchors. The theme is a golden sunrise: the site should feel like the first light over an Indian morning, calm and ceremonial, never loud. The latest explicit user correction removes all evacuation-grid, initial-map and reference-replay interfaces. Do not restore them from earlier design notes or screenshots.

## Color direction

The user fixed five colours: Ivory #FAF3E8, Dawn #F1D4A2, Gold #D9A24C, Copper #A96930 and Earth #39291F. They are root tokens (`--ivory`, `--dawn`, `--gold`, `--copper`, `--earth`) in anantam.css. Ivory is the canvas. Dawn carries the sky and soft fills. Gold is ornament only: rays, hairlines, kolam threads, focus accents. It never carries text, because it fails contrast on Ivory. Copper and its deeper step #8c5321 carry links, focus and small accents. Earth carries text and the primary action. Analytical series and outcome colours were warmed to sit on Ivory but keep their semantic meaning and visible labels. Provider brand colours are unchanged. Light appearance is mandatory regardless of system or stored preference.

All marketing colours and fonts use root tokens in anantam.css and experience.css. Existing measured table spacing is preserved as a documented Hallmark exception.

## Heritage details

Heritage is carried by craft, not by stock imagery or new claims:

- The mandala is the sun. It rises once from a gold horizon over a river, with a glowing disc in its open centre, soft light beams and a striped reflection. It then turns once every 320s.
- Faint ghat and temple silhouettes (shikharas with pennants, chhatris and steps) frame the sun, in two depths, and reflect in the water.
- अनन्तम् (Sanskrit, `lang="sa"`) sits under the wordmark between gold hairlines, in the system Devanagari serif stack (`--font-devanagari`).
- A pulli-kolam rule (two interlaced gold threads around copper dots, gathered by the mandala) opens the contribution. It draws outward from the centre on scroll where `animation-timeline: view()` is supported.
- The mandala returns as a faint, slowly turning watermark behind the contribution and in the footer.
- The footer is deep Earth with Dawn and Gold type, like a lamp-lit evening that closes the day.

## Hero and composition

The centred identity stacks अनन्तम्, the Earth wordmark, the tagline and one action above the rising sun. The exact tagline is **Boundless Possibilities**, set in Instrument Serif. One primary action opens benchmark.html directly. The sky warms from Ivory to Dawn toward the horizon (72% of the hero; 70% on phones, 80% in short windows). The sun's size is set with container units, so the sun never meets the action. Fine paper grain softens the gradients. Up to 46 lamp-ember motes (26 on phones) drift up on one canvas. Content is capped within the hero; the coloured field spans the viewport.

The hero uses height: calc(100svh - measured header height), with a compact identity arrangement in short landscape windows. The layout remains two main sections, respecting the user's preference for fewer layouts and less copy.

Below the horizon the water fades into the page canvas, so the hero has no hard lower edge. With scroll-driven animation support, scrolling the first screen lets the sun climb and its reflection sink. A canvas-coloured inverse path reveals the next section.

The contribution is a single text-led editorial spread, capped at 1440px. Instrument Serif gives EMBERBench a clamp(3.5rem,6.4vw,5.75rem) title and the description a clamp(1.75rem,2.5vw,2.375rem) serif lede; DM Sans carries the supporting paragraphs on the right. At 900px and below it becomes one column; at 700px and below the scale becomes 2.75rem / 1.5rem / 1rem with 20px gutters. Rem units preserve browser text scaling, headings balance and prose wraps naturally. No right column, stock image, feature list, model scores or charts appear here. The homepage no longer loads the results artifact or an evaluation-loop script.

The hero contains the homepage's sole benchmark CTA. No navigation links, duplicate Explore action or promotional subheading appear in the contribution. There is no map, reference agent selector, playback timeline, player readout or replay download. Scenario routes preserve source definitions, population/world counts, descriptions, model evidence, rankings and the matrix. Selecting a scenario keeps model context and URL state. Profiles return to the selected scenario/model.

## Motion and interactions

The sunrise runs once on arrival: horizon 2s, sun 3.6s, text staggered from 0.5s, all with the dawn ease-out curve. Ambient motion (sun rotation, beams, glitter, ripples, motes) pauses offscreen. Reduced motion shows the final scene with no animation and no motes. Canvas failure keeps the whole scene except the motes. Reduced motion shows the completed mark; hidden/offscreen suspends work; resize recalculates targets and navigation cleans up. The original emblem remains the Canvas/sampling/no-JavaScript fallback. No pointer tracking or motion-control button; the companion side ribbons remain clipped within the hero.

The homepage introduction is static and readable without JavaScript. Published people-outcome visualizations remain on analytical pages, where they serve the actual results.

The Methodology evaluation loop uses immediate selection and a small pointer-only explanation entrance. Native controls, visible keyboard outlines, 44px targets, failure recovery and shared site navigation remain. The palette applies to all routes, including the analytical loader's surroundings.

## Data and scope

Anantam’s tagline is always **Boundless Possibilities**; EMBERBench is its sole published contribution. Do not invent launches, testimonials, customer metrics or future products. Published results, ranks, scoring definitions and model identities are unchanged. Scores are composite results, not survival percentages. Keep one-trial, public-development and descriptive-comparison qualifications visible.

The removed reference player, geometry data, replay records, animation exports and generator are no longer shipped. Scientific simulation remains part of the underlying benchmark and its methodology; removing its website visualization does not change that research process.

## Hallmark exceptions

Ivory labels on Earth controls remain for legibility. Existing optical spacing is kept in the analytical routes. The hero fills the visible viewport below the actual header; contributions start after the first screen. Labeled person pictographs remain as actual statistical evidence. These four exceptions are recorded in experience.css and inherited by this locked system. They do not waive accessibility or functional defects.

## Scrolling benchmark results

The leaderboard spans the browser width; its content starts on the shared `--page-edge` (the 1264px content edge on wide desktops, 32px at 1100px and below, 20px on phones). Every bar chart stays vertical, including on phones. Every series sorts highest to lowest by its own numeric value, with unavailable measurements last; lower-is-better metrics retain that explanation. Official rank metadata and scientific tie-breaks are unchanged. The main desktop ranking fits all 19 decision models together. If columns or labels become crowded, the measured layout continues into vertical bands with repeated axes. Per-chart zoom enlarges columns, labels and plot height, adding bands below without hiding models or creating horizontal page scrolling. The safety/quality scatter is replaced by two separately sorted vertical factor plots. People outcomes are vertical 100% stacked columns ordered by evacuation share, with exact counts on hover/focus. Each of ten scenario charts sorts independently by its own score. No model is featured by default. Provider logos, observed brand colours, direct values, zero baselines and model/scenario evidence links are preserved. Source identities remain recorded in assets/providers/SOURCES.json.

Methodology keeps the global site header and its local contents list. It does not show benchmark sub-navigation or an Explore the results action. Links to full hosted protocol guides are retained as reading references.

Scenarios mirrors that reading design: a 190px sticky challenge index, a 58px gap and an open article. Its headings share Methodology's serif treatment. The horizontal challenge rail, dashboard tabs and extra top navigation are removed. Ranking evidence stays visible, model filters are disclosed on demand, and the matrix/catalogue expand inline. At 700px and below a native scenario selector replaces the side index. Deep-linked evidence sections expand automatically. Under the selected scenario, the index lists its four parts (Overview, Ranking, All scenarios, Diagnostic suite). The part in view carries `aria-current="location"` and a 2px accent rule. At 700px and below the same parts form a sticky bar under the header with an accent underline. A part link opens its disclosure before it scrolls.

Every page ends in a shared company footer with the same asymmetric Bézier shore inverted above a deep Earth field with Dawn and Gold type. Its content uses the same `--page-edge` as the header, so the footer logo lines up with the header logo at every width. Anantam's supplied emblem, name, exact tagline and first-contribution statement lead; Research and Resources links occupy two columns. Copyright sits in a separate bottom row. The main site uses a shared renderer that also generates static docs and not-found footers. The footer is the explicitly requested company detail area; it does not add CTAs inside the homepage contribution.

Documentation has a separate local library at docs.html. Reviewed public contracts and local scope guides use the locked golden-dawn palette and local fonts, a readable text measure, searchable guide navigation and an on-page contents list. Protocol links open hosted guides. Reviewed Markdown and source revision/license records are retained; JavaScript is an enhancement rather than a prerequisite for reading. Code examples and wide reference tables scroll locally within their document, never the page.

The company main wrapper has width 100%, no side margins and no maximum width. Header and hero share the Ivory-to-Dawn sky, eliminating an inset rectangular panel. The hero clips its scene. The displayed contribution name is EMBERBench everywhere.

Production polish (27 October 2026): the hero keeps its source-image fallback hidden during normal startup. No source-image flash occurs on refresh; no-JavaScript and Canvas-failure fallbacks retain the supplied artwork. Results use one unboxed scope paragraph, aligned search and Filters controls, and an inline responsive filter row with active-count feedback and reset. Chart zoom buttons are removed; automatic vertical bands preserve every model without sideways scrolling. These requirements supersede earlier per-chart zoom and floating-filter instructions.

Reading and consent revision (28 October 2026): company pages preserve a 190px index and 56px gap to an open 780px article. Keep the actual index/header nodes mounted; reserve the scrollbar gutter and align the sticky index with its initial position. Phones keep a sticky wrapping index. No company footer appears on Methodology, docs or the company/policy workspace. About is included in the same shared header across all generated routes. These explicit changes override the earlier every-page footer rule.

The first-visit consent notice uses the existing Ivory/Earth tokens, DM Sans, a single white surface and equal outline accept/reject controls. It stays non-modal, never steals focus and enters with one 180ms/8px transform when motion is allowed. On phones (600px and below) it is a compact card with Preferences beside its title. Keep the notice fully opaque throughout so its text never loses contrast during entry. Its measured phone footprint is reserved above the actual-emblem loading region. The logo loader is visible only while interactive research is pending; no minimum brand duration is imposed, and no-JavaScript/slow/failed loads retain real reading material.

Future private evaluation uses a separate, disabled section in the existing light reading system. It must not replace or mix with the public cohort. Seven vertical plots show only approved aggregate metrics, direct values and score CI whiskers; columns continue in readable vertical bands, every metric independently descending and missing last. Use existing reviewed provider artwork where available. State “Not reported” for missing operations and preserve real zero. Pair decisions derive from the paired family-stratified analysis, never individual CI overlap; “Not resolved” does not imply equivalence. No comparison tables, private diagnostics or scenario drill-downs. The pending state contains no fabricated model/result, and neither pending nor ready state ships until explicit artifact activation.

Mobile revision (28 October 2026): at 700px and below, secondary text is at least 12px and every select is 16px, so iOS does not zoom on focus. Table model links, docs contents links, scenario chart titles and sort buttons have 44px tap areas without changing row layout. The model chooser table fits phone widths, so the EMBER column stays visible. Charts narrower than 480px show every model in one row with 200px plots (160px compact): columns are 1px apart, values and short names turn vertical, logos are hidden, and label size shrinks below 12px only when a column is narrower than 12px. The header, company gutters and consent notice respect safe-area insets on the full-bleed homepage. Touch controls use `touch-action: manipulation` and text size adjustment is fixed at 100%.

Navigation revision (28 October 2026): the main header no longer has an Our work link; the Anantam logo is the route to the homepage. The Results / Compare / Scenarios sub-navigation also appears on Scenarios. The logo, sub-navigation, public-results notice and page title share one left edge (`--page-edge`: the 1264px content edge on desktop, 32px at 1100px and below, 20px on phones). Every page keeps the vertical scrollbar, so the header does not move between short and long pages. Menu revision (30 October 2026): on phones and tablets (up to 1100px, except landscape phones) the Menu control is a two-line icon that turns into a close cross; its accessible name stays Menu/Close. The open menu is a white panel that drops from the white header with 24px lower corners and a soft warm shadow, over a dimmed, 6px-blurred page; tapping the dimmed page, a link or Escape closes it. Links are DM Sans 13px uppercase rows (0.12em tracking) on hairline dividers with a right arrow; the current page is Earth and bold. GitHub (Earth pill) and Contact (light pill) sit side by side below the rows. The panel unfolds with a clip-path reveal (320ms open, 180ms close), rows follow with a 30ms stagger, and reduced motion keeps only fades. The header stays sticky in flow, so the page behind neither moves nor scrolls, and it is inert while the panel is open. Hover fills apply only to hover-capable pointers, so tapped buttons do not stay grey. Landscape phones (up to 1100px wide and 500px tall) show the four links inline in the header with no Menu button. These requests override the earlier rules that removed the sub-navigation from Scenarios.

Reading-page revision (30 October 2026): Docs, Methodology and Compare follow the Sarvam pattern of white hairline cards (16–20px radius, 1px `--border`, 1px shadow) on the Ivory canvas, small uppercase labels with 0.1–0.12em tracking, and Earth/light pill actions. Docs: the index has a kicker, Get started and Read the scoring pills, and each guide as a card with an arrow (one grouped list per section on phones). The sidebar search has an icon and a `/` shortcut hint; "On this page" is a hairline rail that marks the section in view; code sits in a framed block with a language bar and a copy pill; tables are rounded cards. On phones, Browse documentation is a sticky switcher bar under the header that shows the current guide and opens the guide list as a scrolling panel. Methodology: sections are numbered 01–07, the contents rail marks the section in view (sticky chip row on phones), the evaluation loop is a white card with pill steps (five equal pills on phones), source links are chips and Safety/Quality are side-by-side cards. Compare: the model pickers sit in one white card (stacked on phones, so model names are not cut off); each model card has a series dot in the same colour as its component bars (navy, teal, blue, grey); the tabs are a bordered segmented control; outcomes, scenario and diagnostic panels and every disclosure are cards.

Contact actions (30 October 2026): below the email paragraph, a white card holds Write in Gmail (Earth pill; opens Gmail's web composer in a new tab with the address and the subject "Anantam enquiry"), Use another email app (mailto with the same subject) and Copy address (shown only when the clipboard is available). The buttons stack at full width on phones. The card is added by tools/build_production.mjs, because contact.html is generated from docs/company/contact.md.

Compare cards and sticky bars (30 October 2026): each Compare model card has the identity first (series dot, kind, rank chip, name), then a hairline, then the score with "EMBER / 100" and the CI. A container query stacks the rank and the note when a card is narrower than 320px. On phones each card is one compact row with the score on the right. The open picker has four equal columns from 1280px and two columns below that. On phones every sticky sub-bar (legal index, Methodology contents, docs switcher, scenario parts) sits flush under the header at top: var(--site-header-height); a gap there lets page text show above the bar. Workspace tabs stay on one row on phones.

Polish revision (31 October 2026): every page title uses one `--title-size` (56px desktop, 48px at 1100px and below, 40px on phones) and every page lede uses one `--lede-size` (16px, 15px on phones). Headlines and empty-state headings end without a period. The not-found page starts on the page edge instead of a centered column. In the selected-model evidence on Results, the people-outcome legend sits at the top of its column with the counts beside their labels (320px maximum). On phones the model chooser shows the entry type as quiet muted text instead of a two-line chip. Uppercase menu, kicker and card labels from the 30 October revisions stay as requested.

Results and founders revision (31 October 2026): a headline row of three open columns (Instrument Serif numerals, copper labels, gold hairline dividers) sits between the title and the scope note; on phones it stacks. Axis labels centre on their grid lines, the 100 line is drawn and the zero baseline is darker. The EMBER ranking adds a 1.5px dashed copper reference line labelled with the best hand-coded agent, and 22px ivory numerals with a gold ring above official ranks 1–3 (hidden on squeezed phone charts). Factor charts carry a one-line meaning under each title. The homepage skyline has 26 temples (30% fewer). Founders: a centred heading with a Sanskrit संस्थापकाः line, then two cards (24px radius, gold hairline, ivory-to-dawn fill) with a gilded monogram seal, serif name, uppercase role, short bio, gold-diamond facts and pill links; one column at 900px and below.
Round 4 (31 October 2026): Founders are two jharokha cards: an elliptical arch (200px radius, 160px on phones), a 1px gold border with an inner gold hairline 11px inside, a dawn-to-ivory fill, and the slowly turning sun mandala rising behind a horizon line with a gold diamond. A Devanagari initial (सा, सं) sits in an ivory disc at the sun's centre. Below: serif name, a spaced uppercase Founder role between gold diamond outlines, focus pills, bio, one serif stat with a gold hairline above and below, and links divided by gold diamonds with 44px targets. Cards lift and the sun rises on scroll (scroll-driven, off under reduced motion); a soft dawn light follows a fine pointer. Results: the filter bar is a 16px-radius ivory panel with uppercase labels, an earth-filled segmented control and 44px fields; chart-jump pills follow. Scatter points are 28px ivory discs with the provider logo and a 1.5px brand ring; frontier points get a gold ring, a dashed gold line and visible labels. The scenario heatmap uses six warm bins (under 1 to 95–100) whose text colour keeps 4.5:1 contrast, a sticky model column and a key.

Round 5 (31 October 2026): replaces the Round 4 founder cards and results header above. The user rejected both the jharokha card and a carved doorway: founder cards are minimal. Each card is framed only by the outline of a cusped Hampi arch (Lotus Mahal style: three lobes a side and a pointed crown lobe), one line of gold-copper on the page background, with no fill, no shadow and no ornament. The arch is an inline SVG sized in cqi of its layer (viewBox 400 x 230, spring at 57.5cqi); straight sides continue it down and fade out, so the archway stays open at the bottom. The Devanagari initial sits under the crown in copper. The outline draws itself once on scroll (scroll-driven, off under reduced motion); on hover it deepens to copper. Text is the light-theme founder text. Results: the header is the title, the question and one scope line with the counts; there is no stat band and no chart-jump row. The filter bar has no panel; on phones Provider and Rank by share one row.
