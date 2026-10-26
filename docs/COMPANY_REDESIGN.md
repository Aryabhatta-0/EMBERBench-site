# Anantam: revised implementation

This document describes the current revision, including the subsequent visitor-experience feedback. The latest user brief takes precedence over all historical design notes.

## Latest visitor-experience revision

Studied the complete homepage sequences, navigation and representative product/model journeys on Sarvam and Gnani in a real browser. [Research and source links](../design/research.md) distinguish what was observed from the design choices applied here. [The visitor audit](../design/audit.md) records the specific friction and fixes. This is a task-based heuristic review, not a study with recruited participants.

- Visual results now lead: a fixed-scale chart, a nearby model explanation, exact people outcomes, relevant scenario links, and an immediate two-model comparison.
- AI decision models are the initial cohort. Hand-coded reference agents remain available and explicitly identified.
- Scores, people and API usage answer distinct questions. Missing API data remains unavailable. The exact sortable table, all measurements and comparison selection remain available through Data table.
- Model choice, comparison partner, metric, filters, format and expansion persist in the URL. On phones, the explanation follows its selected row; keyboard navigation is immediate.
- Profiles and comparisons lead with people outcomes. Profiles show the lowest-scoring scenarios with direct evidence links. All seven technical factors remain available on demand.
- The contribution preview offers two real public initial worlds and matching scenario actions. Results preview bars open that selected model inside the benchmark. The diagram is not a policy replay.
- The existing Sarvam-inspired rail expansion is retained. New pointer inspector feedback is 220ms; result filtering and keyboard actions do not wait for animation. Scene motion remains finite and respects reduced motion.

Additional skills used in this pass: design-research (primary-source journeys), design-audit (prioritized task friction), review-animations (frequency, purpose, interruption and reduced-motion review). The original fifteen remain installed; their concrete applications are below.

## What changed

| User issue | Current implementation |
| --- | --- |
| Dark/light toggle | Removed throughout the site. Theme initialization always sets light; saved and OS dark preferences are ignored. Dark token blocks and theme controls are removed. |
| Left-aligned hero and action | Centered emblem, direct company statement, short contribution sentence and centered action. |
| Generic navy stats card and barely visible tilt | Replaced with one expanding Environment / Results / Methodology showcase. No pointer tilt or dark marketing card. |
| Explore opens another old hero | `benchmark.html` now runs `leaderboard.js` and opens visual results immediately, with an optional searchable, sortable table. The former `benchmark.js` landing page is deleted. |
| Multiple disconnected experiences | Every route shares the same Anantam header. Benchmark tools have Results / Compare / Scenarios navigation. `leaderboard.html` is a compatibility URL for the same results module, canonicalized to benchmark.html. |
| Empty future-outlook copy | Removed. The homepage has two sections: introduction and current contribution. |
| Mobile controls hide the evidence | Type/provider/sort/reset are inside a native Filters & sort disclosure on phones. Search and lenses remain visible; the first score row fits in the initial 390×844 screen. |

Anantam remains an experimental AI company with EMBERBenchmark as its sole published contribution. No future products or achievements are invented.

## Reference analysis and actual motion

Studied the live [Sarvam site](https://www.sarvam.ai/) in the browser, including before/after hover captures and computed styles. Its horizontal product accordion changes an inactive rail from about 86px to an active view of about 855px at 1440px, with a 650ms expansion and staggered content. The new showcase applies that spatial behavior to three views of one real contribution. The [Gnani site](https://www.gnani.ai/) informed centered company positioning and a direct product path.

Anantam's desktop showcase uses GSAP to interpolate three numeric grid weights over 650ms with `power3.out`. At 1440px, the active view is about 1033px and inactive rails about 83px. The content follows the expansion. Reversals start from the current weights. The tests measure an intermediate width during motion, not just a changed end state. Mobile uses horizontal tabs; keyboard and reduced-motion switches skip expansion.

The Environment view switches between the public corridor-bottleneck scenario (15×7, eight people, one exit) and unequal-exits scenario (20×9, five people, two exits). Source coordinates and upstream license are documented in `site/assets/SCENARIO-NOTICE.txt` and `EMBERBench-LICENSE.txt`. A finite line animation highlights the corridor; it is not a recorded model-policy replay. Results use the unchanged generated snapshot, with visible metric name and 0–100 scale.

## Requested skills: concrete use in this revision

All requested skills are installed. Existing installations were reused; no additional installation was needed in this revision. Guidance is applied in the existing vanilla HTML/CSS/JavaScript stack, rather than introducing a new React application.

| Skill | Source | Part of the revision |
| --- | --- | --- |
| Impeccable 4.7 | [pbakaus/impeccable](https://github.com/pbakaus/impeccable/tree/skill-v4.7.0/.agents/skills/impeccable) | Reassessed the rejected composition against the explicit brief, used a fresh independent finish reviewer, corrected its score-context/mobile findings, and updated the durable design context through a separate documenter. Engine context loading remains unavailable because curl.exe is missing; written guidance and source context were used. |
| Hallmark v2 | [Nutlope/hallmark](https://github.com/Nutlope/hallmark/tree/main/skills/hallmark) | Cut the layout to two useful sections, kept tokens and factual material, and ran the rendered floor scan. The requested expansion takes priority over generic advice to avoid layout animation or add more sections. |
| Emil Kowalski Skills | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng) | Keyboard changes are immediate; hover expansion retargets cleanly. Frequent sorting and filtering do not wait for decorative transitions. |
| Applecn | [STiXzoOR/applecn](https://github.com/STiXzoOR/applecn/tree/main/.agents/skills/applecn) | Shared semantic color/control roles and consistent light control geometry. Guidance only; no React/Tailwind runtime. |
| Apple HIG | [ykswang/apple-hig-skill](https://github.com/ykswang/apple-hig-skill/tree/main/skills/apple-hig) | One predictable navigation system, visible focus, native disclosure for secondary phone controls, sufficient touch targets and reduced-motion support. Community packaging of HIG, not an Apple-issued skill. |
| Anthropic Frontend Design | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Centered composition follows the user's explicit reference; the real evacuation world provides subject-specific material. Preserved local Instrument Serif, DM Sans and the supplied emblem. |
| Jakub Krehel Interfaces | [jakubkrehel/skills](https://github.com/jakubkrehel/skills/tree/main/skills/better-ui) | Removed the token 3D tilt, aligned rails/actions, retained deliberate corner geometry and restrained press feedback. |
| UI/UX Pro Max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Responsive/a11y review, evidence visible on the first phone screen, readable chart-to-evidence journeys, nearby phone explanations, input sizing and accessibility scans. |
| LottieFiles Motion Design | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | One unfolding interaction with coordinated rail/content/scene timing, finite environment highlighting and a static reduced-motion state. No Lottie player is needed. |
| Official shadcn | [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) | Reused existing controls, semantic tablist/tab/tabpanel structure and existing analytical tools. Guidance only; no React components installed. |
| Emil mobile-native | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/mobile-native) | Capability-gated hover, mobile tabs, touch-action, zoom left enabled, safe-area spacing and 16px phone search/filter controls. |
| Official GSAP Skills | [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | Real numeric track interpolation, retargeting, finite SVG timeline, preference-change handling and teardown. Core/timeline skills used; ScrollTrigger is not shipped because this interaction does not need pinned scrolling. |
| Emil apple-design | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/apple-design) | Direct response to hover/click, continuity when changing panels, native mobile disclosure, an in-place inspector and comparison, and retained context when switching views. |
| Taste Skill v2 | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Re-read the reference and explicit user direction instead of defending the earlier composition; reduced page density and committed to one interactive product surface. |
| Anti-AI-Slop | [Krirox/anti-ai-slop-skills](https://github.com/Krirox/anti-ai-slop-skills) | Removed generic future copy, the navy metric-card treatment and the duplicated landing page. Replaced them with source-backed worlds and direct access to evidence; replaced table-first entry with a useful reading flow. |

## Verification

- 17 analytics/data/entry-point Node tests pass.
- 255 browser checks pass: 38 company, 75 baseline/route, 66 analytical workspace, 4 loading-motion, 35 loader and 37 result-reading journey checks.
- 50 automated accessibility scans report zero violations at the tested WCAG A/AA rules. They cover all routes and alternate evidence views, five company widths, saved/OS dark preference rejection, and the disclosed phone filters.
- Motion checks measure intermediate and final widths. Keyboard focus, disabled/inert inactive content, reduced motion, mobile tab navigation, unavailable GSAP/data and no-JavaScript fallbacks are checked.
- The direct-to-results action and phone first-result visibility have dedicated regressions.
- The preceding revision’s rendered Hallmark floor-only scan reported zero failures/warnings; it was not rerun for this visitor-experience pass. This does not claim a full heuristic score or override the user's reference with generic section-count rules.
- The preceding revision’s independent review resolved metric/scale labeling and phone evidence discovery. The current fresh review found two material issues: a clipped preview action and slow comparison pacing. Both were corrected and scored resolved in a ship verdict scoped to those two fixes. The first reviewer failed to start due model capacity; a fresh retry completed the review. Runtime evidence comes from the browser suites.

The generated result snapshot and Python scoring/builder are unchanged. Physical phones, Safari/WebKit, Firefox and the protected Vercel preview have not been runtime-verified. Existing GitHub CI runs the Python builder as well as frontend tests.

## Delivery

Update to [draft PR #3](https://github.com/Aryabhatta-0/EMBERBench-site/pull/3), branch `codex/anantam-company`. The current local preview is `http://127.0.0.1:8927/`. `npm run preview` starts a fresh static server on port 8917.

The static output requires no app build or production package installation. The homepage, shared styles, original fonts/logo and pinned GSAP distribution are local assets. The updated motion recording demonstrates rail expansion, environment highlighting and the direct transition into actual benchmark results.
