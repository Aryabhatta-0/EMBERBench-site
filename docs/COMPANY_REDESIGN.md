# Anantam company website

Anantam is now presented as an experimental AI company. EMBERBenchmark is its first and only published contribution. The homepage has three sections, short copy and one product card. Further experiments are described as future intent; there are no fabricated products, customers, testimonials, launch dates or achievements.

The complete existing results explorer moved to `benchmark.html`. Leaderboard, comparison, model profiles, scenarios, methodology, report data and their deep links remain available. The user-facing contribution is called EMBERBenchmark; underlying scientific material retains its source name, EMBERBench.

## Reference work

Studied the live [Sarvam homepage](https://www.sarvam.ai/) and [Gnani homepage](https://www.gnani.ai/) in a real browser. Sarvam informed the generous product display and restrained interaction that gives a product surface depth. Gnani informed the direct path from company identity to a named contribution. Anantam uses its existing navy infinity artwork and local typography. No reference branding, assets, code or claims were copied.

The single navy contribution card displays three real decision-model results, calculated from the unchanged result snapshot. Its visual layer tilts by at most three degrees and lifts six pixels in response to a precise hovering pointer, returning smoothly when the pointer leaves. Touch and reduced-motion modes keep the card still. Existing benchmark tabs and disclosures hold the detailed analysis away from the company homepage.

## The fifteen requested skills

Existing installations were reused. Missing skills were installed with the Codex skill-installer from their upstream repositories: Emil `mobile-native`, GSAP `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, and `anti-ai-slop`. These installations are available for automatic discovery on the next turn; their files were read directly during this task. The user’s short-copy, few-layout brief took priority over conflicting generic section-count and framework recommendations.

| Requested skill | Source / installation | Concrete application in this revision |
| --- | --- | --- |
| Impeccable 4.7 | [pbakaus/impeccable, skill-v4.7.0](https://github.com/pbakaus/impeccable/tree/skill-v4.7.0/.agents/skills/impeccable), existing `impeccable-4.7` | Separated company Persuade mode from analytical Operate/Read modes; craft review, independent screenshot/source finish reviewer, and separate design documenter. Updated PRODUCT.md, DESIGN.md and sidecar. The context engine could not launch because curl.exe is unavailable; project context and written guidance were read directly. This was a code-led build, without a seeded/approved visual comp. |
| Hallmark v2 | [Nutlope/hallmark](https://github.com/Nutlope/hallmark/tree/main/skills/hallmark), existing version 2.0.0 | One idea per section, semantic color tokens, no decorative eyebrows or fake social proof. Ran its real-browser render scan, fixed the image-grid track failure, and enlarged the scope caption. Final floor-only rendered scan: zero failures or warnings. Full heuristic findings include inherited chart spacing, compact hero and short outlook; the user's fewer-layout requirement prevails over suggested extra sections. |
| Emil Kowalski Skills | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng), existing `emil-design-eng-current` | Brief, interruptible feedback and explicit properties; retained immediate analytical tab changes. One finite entrance and one pointer-driven product interaction. |
| Applecn | [STiXzoOR/applecn](https://github.com/STiXzoOR/applecn/tree/main/.agents/skills/applecn), existing `applecn` | Reused semantic surface/text roles, capsule actions, 44px control geometry and consistent themes. Applied guidance to the existing vanilla site. Its React/Tailwind component runtime was not installed. |
| Apple HIG Skill | [ykswang/apple-hig-skill](https://github.com/ykswang/apple-hig-skill/tree/main/skills/apple-hig), existing `apple-hig` | Clear navigation, touch targets, visible focus, readable hierarchy, zoom support, reduced motion and company introduction available without scripting. This is community packaging of Apple's HIG, not an Apple-issued skill. |
| Anthropic Frontend Design | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design), existing `anthropic-frontend-design` | Existing navy emblem as brand material, local Instrument Serif/DM Sans contrast, asymmetric introduction, a single visually dominant product surface, concise factual copy. |
| Jakub Krehel Interfaces | [jakubkrehel/skills](https://github.com/jakubkrehel/skills/tree/main/skills/better-ui), existing `better-ui` | Consistent surface geometry, optically simple actions, preserved 0.96 press feedback, pointer-only hover styling and theme-transition suppression. Used the collection's current UI-polish skill. |
| UI/UX Pro Max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), existing full local installation | Ran the design-system search, reviewed accessibility/touch/performance priorities, checked five company viewport widths and both themes. Rejected its unrelated generic green/biophilic palette suggestion in favor of the established brand. |
| LottieFiles Motion Design | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill), existing `motion-design` | Calm motion personality, staged introduction and deliberate secondary movement in the contribution visual. Finite homepage star flight, reduced-motion fallback and offscreen suspension. These principles are implementation-independent; no Lottie player added. |
| Official shadcn skill | [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn), existing `shadcn` | Inspected the existing manual/static stack and reused shared shell, buttons and tab semantics. Semantic roles stay consistent. Guidance applied; no React components added to this vanilla project. |
| Emil `mobile-native` | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/mobile-native), newly installed | Safe-area padding, viewport-fit=cover, capability-based hover, touch-action: manipulation and nonselectable control text. Zoom remains enabled. Verified in browser emulation; physical iPhone/Android verification was unavailable. |
| Official GSAP Skills | [greensock/gsap-skills](https://github.com/greensock/gsap-skills), newly installed core/timeline/scrolltrigger | GSAP 3.15.0, locally served and pinned: a coordinated finite entrance, quickTo for reversible card depth, clamped tilt, matchMedia cleanup and preference-change reset. Core/timeline guidance drives shipped code. ScrollTrigger was read but not shipped: this page does not need pinned or scrubbed scrolling. |
| Emil `apple-design` | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/apple-design), existing `apple-design` | Immediate press feedback, direct pointer response, continuous retargeting and a clean return path when leaving the card. Navigation and actions never wait for animation completion. |
| Taste Skill v2 | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), existing `design-taste-frontend` | Read the brief before choosing density/motion: quiet research-company identity, sparse three-section composition, existing brand retained, real product evidence. Avoided a default feature-card catalogue, mesh gradients and decorative UI. |
| Anti-AI-Slop | [Krirox/anti-ai-slop-skills](https://github.com/Krirox/anti-ai-slop-skills), newly installed `anti-ai-slop` | Removed the generic platform narrative: a specific early-stage company, one named contribution, actual scores and a plain future statement. No three-feature grid, fake testimonials, speculative product cards, neon/glass effects or promotional filler. |

## Production behavior

- Static GitHub Pages deployment remains intact. No build step or CDN is needed. GSAP is shipped as a pinned local asset on the company page only; upstream notice and provenance are retained.
- Company text, contribution links and artwork are delivered in HTML. Data or animation-library failure leaves the company website usable.
- The optional result preview reports unavailability with a direct path to the benchmark. Existing analytical loading, error, empty and recovery states are preserved.
- Company motion ends after 4.5 seconds. Reduced-motion preferences reset GSAP transforms and retain still artwork. The analytical benchmark's existing flight behavior remains unchanged.
- New page metadata, 1200×630 social image, sitemap, robots file and a GitHub Pages project-path 404 recovery page are included. The social image is rendered from the existing logo, local fonts and factual copy.
- Existing content security policy permits local scripts/fonts and excludes inline JavaScript. Data/scoring code and the generated snapshot are unchanged.

## Validation in this revision

- 17 Node tests pass, including seven route entry points and existing analytics/data contracts.
- 216 browser checks pass: 28 company, 78 baseline/route, 61 analytical workspace, 14 cosmos, 35 loader checks.
- 35 automated axe scans report zero violations at their tested WCAG A/AA rules. Company scans cover 320, 390, 768, 1440 and 1920px in light mode plus desktop dark mode. Other suites cover analytical routes and alternate views.
- Company checks include data failure, unavailable GSAP, no JavaScript, real scores, route transitions, mobile anchor navigation, finite motion and preference changes.
- Independent code-led screenshot/source review found no material visual defect; its documentation finding was corrected by a separate design documenter. The review does not claim comp fidelity or independent runtime testing.
- Full Hallmark heuristic output is not described as clean: legacy chart rules and deliberately compact company structure produce heuristic findings. The final **floor-only** rendered pass has zero failures/warnings.

Physical mobile hardware, Safari/WebKit, Firefox and live deployment are not verified locally. The unchanged Python result builder was not rerun for this frontend change; its existing pinned CI checks remain in place.

## Preview

Serve `site/` over HTTP. During this task the preview is at `http://127.0.0.1:8927/`. For a fresh session, `npm run preview` uses port 8917. Run `ANANTAM_BASE_URL=http://127.0.0.1:8927/ npm run test:browser` when testing the task preview (set the environment variable using your shell's syntax).

Changes are prepared on `codex/anantam-company` for review. Publishing follows the existing GitHub Pages workflow when the reviewed change reaches main.
