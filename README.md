# Anantam

**Boundless Possibilities.** **EMBERBench** is its first and only published contribution.

The light-only company homepage presents a centered identity, a mist-blue hero with flowing brand ribbons and direct benchmark access, followed by a concise typographic introduction to EMBERBench. It does not load result data or display a leaderboard. The benchmark uses the browser width for four open chart sections, with every matching model in the main ranking, people outcomes and ten scenario comparisons, using local provider logos and observed brand colours. Charts stay vertical at every width and each series is ordered highest to lowest. Zoom enlarges crowded plots into vertical bands without hiding models. Comparison controls and tables belong on the separate comparison page. Complete documentation is hosted on the site, with local search and section navigation.

See [the motion and charts revision](docs/MOTION_AND_CHARTS.md) for the latest changes. See [the earlier skill-by-skill report](docs/COMPANY_REDESIGN.md) for the fifteen requested skills, references, implementation choices, validation, and limits. Earlier implementation notes below describe the benchmark explorer's history.

A dependency-free, GitHub Pages-compatible explorer of official **public development** score reports from [EMBERBench](https://github.com/Aryabhatta-0/EMBERBench). The portal does not present a hidden-suite leaderboard.

This repository holds only the user interface and its data module. The benchmark, the scoring and the model runners stay in EMBERBench:

```text
EMBERBench run directories          this repository
(scores/*.json, summary.json)  -->  tools/build_results_site.py  -->  site/data/results.js  -->  site/*.html
```

- `site/`: the static website. GitHub Pages publishes it from `main` (`.github/workflows/pages.yml`).
- `site/data/results.js`: the generated data. Never edit it by hand.
- `tools/build_results_site.py`: reads EMBERBench run directories and writes the data. It uses the `emberbench` package, pinned to an EMBERBench commit in `requirements.txt`.
- `docs/VALIDATION.md`: the checks and the limits of the current data.

## Add or update results

1. In an EMBERBench checkout, run the benchmark: the offline evaluation pack (`tools/experiments/v1/run_public_benchmark.py`) for the reference agents, and `tools/experiments/remote/run_remote.py` for each remote model. Each run writes a directory with `scores/` and, for a remote model, `summary.json`.
2. Here, install the requirements and rebuild the data from every run directory (see [Generate data](#generate-data)).
3. Run the tests, preview the site and commit `site/data/results.js`.

If EMBERBench changes its scoring or report format, update the `emberbench` pin in `requirements.txt` and the EMBERBench `ref` in `.github/workflows/tests.yml` together.

## Pages

- `index.html`: centered company identity and a static introduction explaining the benchmark's task and evaluation.
- `benchmark.html`: full-width charts, model evidence, searchable filters and metric sorting, without comparison tables or selectors.
- `leaderboard.html`: compatibility URL for the same results page. Query parameters preserve explicit model selection, filters and sorting.
- `compare.html?models=ID,ID`: 2–4 model profiles, components, scenarios, world scores, robustness, congestion and API metrics. Exactly two entries also show descriptive paired world differences.
- `model.html?id=ID`: model profile with nine evidence sections and reproducibility metadata.
- `scenarios.html?scenario=ID`: documented public scenarios, generated populations/world counts, sortable scenario rankings and heatmap ordering.
- `methodology.html`: scoring, frozen environments, replay verification, uncertainty, public/hidden distinction and provenance.
- `docs.html` and `docs/*.html`: a searchable library of 28 complete guides. Articles and navigation are static HTML; JavaScript enhances search, mobile navigation and code copying.

All routes use relative assets and ordinary HTML paths. Model links stay in the same tab and support normal browser open-in-new-tab behavior. The separate comparison page supports two to four models. Appearance is light only, regardless of OS or old saved theme preferences.

## Build documentation

The checked-in static guides need no runtime backend. Run `npm ci`, then `npm run build:docs` to regenerate them from `site/docs/source/`. Markdown is rendered at build time and sanitized; no Markdown parser ships to the browser. Local guide links and heading anchors are preserved.

To deliberately update the benchmark documentation snapshot, run `node tools/build_docs.mjs --source /path/to/EMBERBench`. This copies the 26 benchmark guides, benchmark README, original license and statistical figure, records source revision/blob identities in `site/docs/source-manifest.json`, and adds the local [site-data guide](docs/SITE_DATA.md). Review the source changes alongside the generated pages. It never modifies `site/data/results.js`.

## Data and scientific boundaries

`data/results.js` is generated exclusively by `tools/build_results_site.py`. Never enter results in UI source files. The module format avoids using a `.json` extension reserved by the public-asset guard for benchmark assets.

The snapshot is generated from the original run directories: the evaluation-pack reference run, the TypeSafe Jev and SubQ Snap runs, and 17 OpenRouter decision-model runs, including `typesafe/jev-1.14`. It contains 27 entries (19 decision models and 8 reference agents). The previously requested `jev-latest` run resolves to `jev-1.13.0` and displays as `typesafe/jev-1.13`; its original ID remains stable for existing links. No evaluation date or latest-to-oldest order is inferred. The snapshot contains one trial per model; reported CIs do not capture between-trial variability from a single trial.

The data uses schema version 2: suite/manifest/constants digests, deterministic source report digests, trial counts, families, failure/component details, and authoritative ranks computed before display rounding. Legacy (pre-v2) data uses the scoring tiebreak policy on the rounded values. Rank is descriptive, never a significance claim.

Paired differences match `(index, scenario_id, seed)` and average repeated trials within each world. Their unweighted mean is descriptive and differs from the family-balanced aggregate score. Incomplete trial groups are excluded and coverage is reported. No official comparison inference is present in the snapshot.

API usage is operational metadata, not a score input. Missing usage/cost is not zero; reference-agent compute cost is unmeasured. Mean decision latency is not measured streaming time to first token. Resumed run metadata can cover only the final invocation and include provider waits. **≈** means estimated API cost at supplied list prices. Cost-frontier lines are descriptive and mix reported/estimated invocation metadata; they do not imply price guarantees.

## Generate data

Use Python 3.12+ and every original finished run directory, each containing `scores/` and a matching `summary.json` for API models:

```bash
python -m pip install -r requirements.txt
python tools/build_results_site.py --run ../pack-run --run ../jev-run --run ../subq-run --out site/data/results.js
```

Optional `--price MODEL_ID=INPUT,OUTPUT` supplies USD per million tokens where the API reported no cost. Estimation requires both token counts; measured zero cost is preserved. The current snapshot uses `--price typesafe-jev-latest-choice-r1=0.042,0 --price subq-subq-snap-preview-choice-r1=0.05,0`; OpenRouter runs report their own cost.

`run_remote.py` writes `mean_act_latency_s` as a fixed-point string (`"0.577"`); the builder accepts that form and rejects any other string.

Generation rejects nonofficial reports, mismatched packs, scoring versions, constants, suite/manifest hashes, scheduled worlds, model identities and summary provenance. It uses explicit field allowlists and emits no endpoint URLs, keys, cache paths or nondeterministic timestamps. This validates report consistency; it does not replace the evaluator's replay authentication.

## Preview and tests

```bash
python -m http.server 8765 --bind 127.0.0.1 --directory site
node --test tests/site.test.mjs
EMBERBENCH_ROOT=../EMBERBench python -m pytest -q
python -m mypy
```

Open `http://127.0.0.1:8765/`. The site must be served over HTTP because it uses JavaScript modules. No application build step, external font requests, analytics, CDNs, or production package installation are required. The fonts, supplied Anantam logo and pinned GSAP distribution are served locally; only the company homepage loads GSAP.

The builder tests need the public suite of an EMBERBench checkout: set `EMBERBENCH_ROOT`, or clone EMBERBench into `./emberbench` (ignored by Git). CI checks out the pinned commit there. CI runs the Node tests and the builder tests as separate jobs.

## Anantam design

The current design follows the explicit light-only, centered, sparse brief. Sarvam’s live accordion was measured before implementation: a narrow rail expands into a product view over about 650ms. Anantam applies this to three views of its single contribution, with a real public scenario diagram, recorded results and methodology. Mobile uses accessible tabs; secondary benchmark filters and sorting are disclosed so results appear in the initial screen.

See `PRODUCT.md`, `DESIGN.md` and `docs/COMPANY_REDESIGN.md` for the current system and all fifteen requested skills. Older implementation notes are historical.

## Automated browser checks

Development-only tooling is pinned in `package-lock.json`. Start a static preview in another terminal, then run:

```bash
npm ci --ignore-scripts
npx playwright install chromium
# Preview, in a separate terminal:
python -m http.server 8917 --bind 127.0.0.1 --directory site
# While the preview is running:
npm run test:browser
```

Set `ANANTAM_BASE_URL` for a different HTTP preview. Screenshots and JSON verification reports go to `work/browser/` by default; override with `ANANTAM_QA_DIR`. CI runs the original regression checks plus the analytical workspace/loading checks, and uploads evidence on success or failure. Accessibility scans cover all five analytical routes in desktop/mobile light mode with dark OS/saved-preference rejection checks, plus their alternate evidence views and the homepage. Automated scans complement manual checks; they do not certify WCAG conformance.

## Browser verification inventory

Validate desktop, tablet and narrow mobile; light-only appearance under both OS preferences; shared navigation and mobile menu; direct paths and query parameters; search/type/provider filter cycles; ascending/descending sorts; missing API values; table horizontal scroll/focus preservation; empty search; invalid model/metric IDs; 2–4 selections and fifth-selection rejection; profile navigation; all relationship charts, highlights, hover/focus tooltips and Escape; heatmap keyboard visibility; scenario navigation/sorting; and console errors.

Desktop Chromium checks and narrow viewport captures are recorded in the task's screenshot artifacts. Public development scope and one-trial uncertainty caveats remain visible throughout.
