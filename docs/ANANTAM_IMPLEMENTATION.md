# Anantam implementation

## Reference analysis

The live [Sarvam homepage](https://www.sarvam.ai/) uses a spacious introduction, a short statement, primary/secondary actions, and interactive product demonstrations. Anantam adopts that hierarchy with one benchmark action and an interactive evidence workspace.

The live [Gnani homepage](https://www.gnani.ai/) connects a prominent serif introduction to models and measurable outcomes. Anantam connects its introduction directly to real benchmark results. No reference code, images, logos, testimonials, or performance claims were copied.

The user's preferences take precedence over generic templates: three main homepage sections, short copy, few decorative rules, and detailed tools on their existing routes. The site is named Anantam; EMBERBench remains the underlying benchmark's name.

## Requested skills

All ten are installed in the user's Codex skills directory. Installed skills are available for automatic discovery on the next turn; their files were read and applied directly during this task.

| Requested skill | Verified source / installation | Application |
| --- | --- | --- |
| Impeccable 4.7 | [pbakaus/impeccable, skill-v4.7.0](https://github.com/pbakaus/impeccable/tree/skill-v4.7.0/.agents/skills/impeccable), installed as `impeccable-4.7` | Product/design context, hierarchy, restrained surfaces, craft review, independent finish review, DESIGN.md and design sidecar. The helper engine could not launch because curl.exe was unavailable; the written guidance was applied directly. |
| Hallmark v2 | [Nutlope/hallmark](https://github.com/Nutlope/hallmark/tree/main/skills/hallmark), installed version 2.0.0 | Short homepage, token-based visual layer, limited decorative lines, and static/rendered design scans. Generic section-count and spacing recommendations were assessed against the user's brief and existing chart geometry. |
| Emil Kowalski Skills | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng), installed as `emil-design-eng-current` | Explicit transition properties, immediate repeated interactions, 150ms press feedback, restrained entrance motion. |
| Applecn | [STiXzoOR/applecn](https://github.com/STiXzoOR/applecn/tree/main/.agents/skills/applecn) | Semantic color roles, shared control geometry, capsule actions, consistent light/dark treatment. Guidance applied to existing HTML/CSS; React components were not installed into the site. |
| Apple HIG Skill | [ykswang/apple-hig-skill](https://github.com/ykswang/apple-hig-skill/tree/main/skills/apple-hig) | Clarity, native controls, 44px touch controls, visible focus, reduced motion and adaptable layout. This is a community packaging of Apple's HIG, not an Apple-issued skill. |
| Anthropic Frontend Design | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design), installed as `anthropic-frontend-design` | Navy logo-led identity, distinct serif/sans pairing, concise copy and one visually dominant brand element. |
| Jakub Krehel Interfaces | [jakubkrehel/skills](https://github.com/jakubkrehel/skills/tree/main/skills/better-ui), current `better-ui` skill | Surface hierarchy, optically aligned SVG actions, 0.96 press scale, instant tab changes and theme-transition suppression. This is the current UI-polish skill from the Interfaces collection. |
| UI/UX Pro Max | Existing full installation copied from `.agents/skills/ui-ux-pro-max` into Codex skills | Ran the design-system search, applied evidence-demo hierarchy, touch sizing, responsive and accessibility checks. Kept the user's navy brand rather than the search's generic palette suggestion. |
| LottieFiles Motion Design | [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill/tree/main/skills/motion-design) | Calm corporate motion personality, duration/easing tokens, one finite emblem entrance and reduced-motion behavior. Its principles work with CSS; no Lottie runtime is needed. |
| Official shadcn skill | [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) | CLI framework inspection, reuse of existing primitives, semantic theming and grouped tab structure. CLI confirmed a Manual project with no React/Tailwind configuration; no shadcn React components were added. |

## Implementation and verification

- All six routes share the Anantam identity. Existing data, scoring, model IDs, query parameters and analytical modules remain intact.
- Locally hosted fonts include OFL licenses. The supplied transparent logo is preserved as an original PNG; compact dark-mode marks use a white CSS silhouette for visibility.
- Native disclosures hold deeper charts and provenance. Tabs support Arrow keys, Home and End. Escape closes the mobile menu and returns focus.
- Theme initialization runs before paint. The homepage retains an introduction without JavaScript. The CSP permits local scripts/fonts and existing inline chart styles, with no inline JavaScript.
- All 16 existing Node tests pass. The Chromium suite passes 64 checks over six routes at 320, 390, 768 and 1440 pixels, covering filters, empty states, comparison limits, themes, keyboard behavior, reduced motion, no-script content and invalid model recovery.
- Four axe-core WCAG A/AA scans report zero violations: home light desktop, home dark desktop, home light mobile, and leaderboard light. This is bounded automated coverage, not a conformance certification.
- Hallmark's static scan reports zero floor failures. It still reports spacing and design heuristics inherited from the chart stylesheet or deliberately pinned by the brief; no blanket clean-lint claim is made.
- Independent screenshot/source review returned `ship` after dark compact-logo visibility and footer icon fixes. Review scope was the code-led design and supplied captures, not an approved visual comp or an independent browser session.
- CI runs the original analytics/data tests, the unchanged Python builder checks, and the new browser suite. Browser evidence is uploaded as an artifact.

## Local preview

```bash
python -m http.server 8917 --bind 127.0.0.1 --directory site
```

Open `http://127.0.0.1:8917/`. No application build or production npm dependencies are needed.

For browser checks, run `npm ci --ignore-scripts`, `npx playwright install chromium`, and `npm run test:browser` while the preview is running. Output goes to `work/browser/`. Override the preview URL with `ANANTAM_BASE_URL` and the evidence directory with `ANANTAM_QA_DIR`.

The Python builder/scoring implementation was not changed or independently rerun locally for this frontend-only work. Its pinned checks remain in CI. Merging the review branch triggers the existing GitHub Pages deployment workflow.
