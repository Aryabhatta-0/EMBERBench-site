# Persistent chart rules

27 October 2026.

The user's chart preferences are recorded in root `AGENTS.md`, `PRODUCT.md`, `DESIGN.md` and the design-system rules:

1. Bar charts stay vertical on every screen, including phones.
2. Every series is ordered highest to lowest by its own value. Missing values stay last. Labels still explain when lower values are better.
3. Crowded plots receive more space through zoom and vertical bands, without hiding models or forcing sideways page scrolling.

## Implementation

The main desktop chart still fits all 19 decision models together. On phones, a measured layout allocates as many readable columns as the available width allows, then continues down the page with repeated axes. At 390px this produces four bands; at 320px it produces five. The values, zero baseline and scale are identical between bands.

Each plot has keyboard-accessible zoom controls. Zoom enlarges column spacing, text and plot height, adding bands below. Zoom out restores the overview. All matching models remain present, and zoom settings survive selection/filter rerenders. Resize observers are disconnected before rebinding a rendered chart.

The horizontal people-outcome bars are replaced by vertical 100% stacked columns, ordered by evacuation share. Safety and execution quality are separate, independently sorted vertical charts. Each of the ten scenario charts sorts by its own score. Selected-model outcome strips on the results page also remain vertical. There are 14 plots across four open sections.

Metric changes and legacy ascending URLs now render highest to lowest, including cost and latency. Their lower-is-better labels are retained. Visual score order uses actual numeric values; official scientific rank and its tie-breaks remain unchanged. Published `site/data/results.js` is unchanged.

UI/UX Pro Max's existing comparison and accessibility guidance informed repeated scales, direct model/value labels, readable density, visible keyboard focus and preserving the complete cohort. Existing provider artwork, brand colours and the Anantam visual system remain.

## Validation

- 20 Node checks passed, including numeric descending order, zero and unavailable values.
- 317 browser checks and 52 accessibility scans passed across dashboard/hero, reading, browser, workspace and company suites, with no reported violations.
- Every plotted series was checked for descending order and vertical geometry at 320, 390, 768, 1280, 1440 and 1920px.
- Zoom preserved every model, added readable bands and restored the overview without horizontal page overflow.
- Legacy ascending cost URLs normalized to descending order while retaining the lower-is-better explanation.
- Laptop, phone and vertical outcome renders were inspected.

The change updates PR #4. No merge or deployment is included.
