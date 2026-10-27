# Multi-model results revision

27 October 2026.

## Reference study

Inspected the live [Artificial Analysis Intelligence chart](https://artificialanalysis.ai/#intelligence), its evaluation chart sections, and the [Decision Index](https://artificialanalysis.ai/evaluations/artificial-analysis-decision-index). Checked the rendered desktop charts, score navigation, provider marks, model labels and supporting sections. The relevant pattern is a shared ranking scale, many models visible together, direct numeric labels, company identity beneath each column and further comparative charts down the page.

EMBERBench adopts that comparison structure within Anantam's existing light theme. It retains its own scoring, scientific order and public-development qualifications. Artificial Analysis scores, methodology and visual branding are not imported.

## Resulting behaviour

- All 19 published decision models appear together in the main desktop chart. There is no ranking pagination or horizontal chart scrolling. Phones use readable labeled rows.
- The unparameterized page has no selected or featured model. Explicit selection reveals model evidence while every overview chart continues to represent the filtered cohort.
- Four open sections contain 13 comparative plots: ranking, safety versus execution quality, people outcomes, and ten scenario charts.
- People outcomes compare every matching model using its own evaluated population as the denominator. Hover and keyboard focus expose exact counts. The evacuation percentage is explicitly distinguished from EMBER.
- Each scenario contains every matching model on a shared 0–100 scale, in the same order as the main chart. Its links preserve the exact scenario and model.
- One search and a closed Filters disclosure control the whole cohort. Reference agents, metric changes, unavailable API values, explicit model bookmarks and keyboard navigation remain available.
- Comparison tables remain absent from results. Published `site/data/results.js` is unchanged.

## Authentic provider identity

All 12 decision-model providers have locally hosted artwork. Eleven assets come directly from the official sites or their linked CDNs; OpenAI's Blossom SVG comes from the MIT-licensed svgl repository and was checked against [OpenAI's brand guidance](https://openai.com/brand/). Artwork is not recoloured or distorted. Chart accents use colours observed in the provider artwork or site, rather than claiming every company has published a formal colour standard.

| Provider | Chart colour | Identity source |
| --- | --- | --- |
| TypeSafe | `#e551ba` | [Official site](https://typesafe.ai/) and linked pink icon |
| Nace.AI | `#171717` | [Official icon](https://www.nace.ai/icon.svg) |
| Liquid AI | `#000000` | [Official site](https://www.liquid.ai/) and linked icon |
| OpenAI | `#000000` | [Official guidance](https://openai.com/brand/) and [svgl artwork](https://github.com/pheralb/svgl/blob/main/static/library/openai.svg) |
| Perplexity | `#20808d` | [Official icon](https://www.perplexity.ai/favicon.svg) and [identity standards](https://live.standards.site/perplexity) |
| SubQ | `#e04e1f` | [Official site](https://subq.ai/) and linked artwork |
| Respan | `#f55656` | [Official site](https://www.respan.ai/) accent and icon |
| Cloudflare | `#ff500a` | [Official site](https://www.cloudflare.com/) and linked icon |
| Microsoft | `#00a4ef` | [Official site](https://www.microsoft.com/) and four-colour icon |
| Inception | `#17c4c4` | [Official site](https://www.inceptionlabs.ai/) accent and icon |
| Together AI | `#fc4c02` | [Official site](https://www.together.ai/) and linked artwork |
| Upstage | `#805cfb` | [Official site](https://www.upstage.ai/) and linked symbol |

Exact downloaded asset URLs, SHA-256 hashes and retrieval date are recorded in `site/assets/providers/SOURCES.json`. The svgl license is included alongside the artwork. Shared provider chips also use the authentic images instead of invented initial badges.

## Skills applied

- **UI/UX Pro Max:** searched its multi-category comparison guidance. Applied common zero baselines, ordered columns, direct numeric/model labels, brand identity as an additional cue and full-width responsive charts. The phone layout uses readable horizontal rows rather than squeezed desktop columns. Hover information is also available through focus.
- **Firecrawl / Brand Identity:** retrieved the reference page and official provider sites, located linked identity assets and recorded observed colours and source URLs. Browser inspection supplemented extraction for chart composition and navigation.
- **Hallmark's existing-project guidance:** kept the locked Anantam palette, local fonts and open page system. This was a targeted chart revision, not a new Hallmark theme or a new theme-generation run.

The required skills were already installed. No new skill installation was needed for this revision.

## Verification

All eight browser suites passed: **414 checks and 64 accessibility scans**, with no reported violations. The **19 Node checks** passed. Width checks covered 320, 390, 768, 1280, 1440 and 1920px. At 1280px the main chart fits its 1176px available plotting width, and all 19 models are present simultaneously. All provider images loaded without resource errors. Filter panels fit at desktop and phone widths; filtering to Liquid AI consistently produced two models and twenty scenario bars.

Desktop ranking, scenario labels and phone layouts were visually inspected. Checks cover the complete cohort, exact counts and scenario scores, selection and reload, keyboard navigation, missing API values, recovery, shared pages, hosted docs and existing hero motion. No merge or deployment is included.
