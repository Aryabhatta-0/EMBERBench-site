# Hero motion and a four-chart leaderboard

The latest correction makes the hero fill the visible window below the header and removes all pointer-follow motion from the side ribbons and emblem. The prior pointer-utility implementation described below is historical; the independent flow animation and its controls remain.

The latest revision replaces the long horizontal ranking list with a bounded analytical overview. The company hero keeps the accepted light palette and original emblem, adding ribbon linework informed by its infinity form.

## Leaderboard

Four distinct views appear together on desktop:

1. **Ranking columns:** five entries per page, exact values, fixed 0–100 scale for EMBER. Paging reaches every filtered entry without extending the plot. Metric controls retain people and API views, their units and missing-value states.
2. **Safety versus execution quality:** all filtered entries at their actual coordinates on fixed 0–1 axes. A selected model is highlighted. Points support keyboard selection and focus/hover readouts; the native model selector provides direct access to overlapping points.
3. **People outcomes:** a donut encodes the selected model's exact published counts. The nearby legend reports counts, not score-derived percentages.
4. **Scenario performance:** the selected model and its comparison appear in a labeled score matrix. Two fixed pages cover ten scenarios. Every cell opens the corresponding scenario and preserves the model. Shading uses 25-point bands; numbers retain exact display values.

Selecting a bar, scatter point or model updates all four views. Selection, chart page and scenario page are shareable through the URL. Detailed model evidence, confidence intervals and quick comparison follow the overview. The sortable data table remains available.

The complete overview fits within the initial 1280×800, 1440×900 and 1920×1080 desktop views. At 320–390px the four charts stack at readable sizes; no chart requires horizontal scrolling. Phone search and filters share a compact row. All charts derive exclusively from the unchanged published results module.

## Hero

The header and hero form one edge-to-edge mist-blue first screen. Its height subtracts the actual navigation height. There are no inherited side gutters or inset panel. Both the hero and the ribbon SVG clip overflow; the artwork fades before its boundaries and cannot extend into the contribution section.

The original logo and centered identity remain. Side artwork does not follow the pointer. The entrance and traveling accents finish within 4.15 seconds and settle; there is no pause-motion control or repeating timeline. Reduced motion and the no-GSAP fallback show static content. Visibility/intersection state suspends an unfinished entrance, and navigation releases its context and listeners.

## Skills

Exactly one agent handled skill discovery and installation, as requested. It made no website edits and spawned no additional agents.

| Skill | Status | Specific application |
| --- | --- | --- |
| [Official GSAP Performance](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-performance) | Newly installed into `~/.codex/skills/gsap-performance` | Reused `quickTo` tweens for pointer response; batched geometry reads; bounded work; offscreen/hidden pausing and cleanup. |
| [Official GSAP Utils](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-utils) | Newly installed into `~/.codex/skills/gsap-utils` | `clamp` and `mapRange` turn pointer position into controlled movement and rotation. |
| Official GSAP Core and Timeline | Existing skills reused | Finite entry choreography and a reusable flow timeline. Fractional SVG stroke offsets disable pixel rounding for continuous movement. |
| LottieFiles Motion Design | Existing skill reused | Staged primary/secondary motion, restrained easing, uninterrupted reading, an a finite entrance and reduced-motion behavior. No Lottie runtime needed. |
| UI/UX Pro Max | Existing skill reused | Matched comparison, relationship, proportion and scenario questions to appropriate charts; preserved labels, scales, keyboard access and a table alternative. |
| Emil Kowalski Design Engineering | Existing skill reused | Immediate analytical selection, responsive feedback, interruption handling, restrained motion and preserving the accepted identity. |

## Validation and limits

19 Node checks and 312 browser checks pass, including pagination coverage, exact people counts, synchronized selection, URL restoration, scenario links, missing API values, actual changing animation offsets, pause, offscreen behavior, pointer response and reduced-motion fallback. All 57 automated accessibility scans report zero violations in the WCAG A/AA rules checked. Native in-app-browser use confirms the pause control, direct hero action and ranking pagination.

The implementation was inspected in desktop and phone captures. Browser tests use Chromium; physical phones, other engines and the protected deployed preview were not runtime-verified. This is engineering and heuristic validation, not a recruited user study. Published score/rank definitions and the one-trial public-development qualifications remain unchanged.
