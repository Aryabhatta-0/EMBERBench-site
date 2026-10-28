# Readable benchmark comparisons

This revision supersedes the compact overview described in MOTION_AND_CHARTS.md. The user's current instruction allows vertical scrolling and prioritizes readable charts over fitting everything into the first viewport.

## Reference and implementation

Inspected [Artificial Analysis's chart sections](https://artificialanalysis.ai/#intelligence) and [model leaderboard](https://artificialanalysis.ai/leaderboards/models) in a live browser. The useful patterns were full-width primary comparisons, clear metric units/direction, nearby controls, and distinct sections connected by ordinary page scrolling. The existing Anantam palette and typography stay in place.

- Ranking spans the content width with ten models per page, a 280px plot, direct values, complete wrapped labels and fixed scientific scales. Native paging reaches every filtered result without horizontal scrolling.
- Safety/quality and people-outcome charts have substantially larger plots and readable legends. The outcome title identifies its selected model.
- All ten scenario families appear together as labeled rows, with exact scores for both models and a comparison selector beside the chart. Each score links to its underlying evidence.
- Section links support jumping through the longer page. The exact sortable data table, filters, keyboard selection, URL state and missing-data behavior remain.
- On phones, ranking columns become labeled rows with horizontal bars. These fit the page width and scroll vertically with the document.

## Skills applied

UI/UX Pro Max's category-ranking guidance informed the ten-category bar chart, direct category/value labels, responsive bar orientation and exact-data fallback. Its correlation/distribution guidance supported retaining explicit axes and keyboard selection on the safety/quality plot. The existing brand tokens and Hallmark exceptions in DESIGN.md were preserved; this was a targeted revision of the locked design system, not a new Hallmark theme run.

The supplied EMBERBench data is unchanged. No charts imply a statistically significant winner, and no extra evaluation results or metrics were invented.

## Verification

Responsive checks cover 320, 390, 768, 1280, 1440 and 1920px widths. They verify full-width chart placement, vertical flow, no horizontal page/chart overflow, complete model reachability, all ten scenario scores, local comparison selection, chart navigation, keyboard operation, reload state and missing API values. Desktop and phone captures were inspected. Automated accessibility checks are bounded evidence, not a conformance certification.

Local validation passed: 19 Node checks, 319 browser checks and 57 automated accessibility scans across the regression suites. The affected reading and dashboard suites were rerun after correcting scenario-cell contrast; both passed with zero reported violations.
