# Reading navigation and first-visit preferences

28 October 2026. This revision supersedes the earlier every-page footer and static-summary loading presentation.

## Delivered behaviour

- About appears in the shared global header, including nested documentation.
- About, Contact, Privacy, Terms, Cookies and Accessibility share one persistent reading shell. Same-origin company-page links in the index, articles, header and cookie notice replace only the article. The actual sidebar and header nodes stay mounted. Scrollbar space is reserved so short/long articles do not shift the columns.
- URLs, titles, canonical/social metadata, current-link state and heading focus follow the article. Back and Forward restore reading positions. Modified clicks, new tabs and same-page fragment links retain native behaviour. Failed article fetches fall back to normal navigation. Direct URLs and reading still work without JavaScript.
- The company footer is omitted from Methodology, the documentation library and the company/policy workspace. It remains on the homepage and analytical routes. About's left index keeps policies accessible without adding another bottom layout.
- EMBERBench and Methodology show the supplied Anantam emblem while their real interactive data is pending. Ready content appears immediately, without a forced brand delay. After eight seconds or an import failure, readable source content and recovery links remain available. No-JavaScript visitors read the source content directly.
- A first-visit, non-modal cookie/preferences notice offers equally prominent Accept optional and Reject optional buttons, plus Preferences. It requests only comparison memory and does not introduce trackers or analytics. Either explicit choice persists in the existing preference key; optional model identifiers remain absent until the visitor opts in and selects models. The prompt does not steal focus or disappear before a choice.
- The notice's measured footprint reserves space above the phone/short-window loading emblem. A blocked store produces truthful feedback and a Continue without saving action. About → Cookies & preferences remains the route for changing or withdrawing a choice.

## Skills and references

| Skill | Applied to |
| --- | --- |
| UI/UX Pro Max | Targeted navigation/sticky-navigation and feedback searches, 44px controls, responsive overflow and predictable Back behaviour. The generic toast result does not fit consent, so no automatic dismissal was copied. |
| Hallmark v2 | Locked Anantam tokens and type, one notice surface, equal controls, spacing scale, reduced-motion fallback, render lint and an independent finish review. No new theme was dealt because DESIGN.md is locked. |
| Taste | Scoped redesign of existing reading/navigation controls; kept the light theme, serif/body hierarchy, established shapes and content. No new cards, imagery, gradients or layout families were added. |
| Emil design engineering | Small, motivated 180ms notice entrance; actual pending-state feedback, stable elements, no artificial loading delay and no motion on frequent article changes. |
| Accessibility | Keyboard focus after article changes, ordinary link semantics, no focus trap, blocked-storage recovery, no-JavaScript reading and axe checks at phone/desktop widths. |
| Playwright | Delayed/failed imports, true node-identity and position checks, Back/Forward, preference persistence, first-visit notice, runtime/CSP checks and actual screenshots. |
| Vercel Deploy | Existing preview/production release workflow after the reviewed build and CI; production alias and commit identity are recorded in the release evidence. |

Primary references: [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API), [ICO cookies and storage guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/), [Sarvam](https://www.sarvam.ai/). Sarvam's public homepage was retrievable through web research; the direct browser visit timed out, so no claim is made that its current cookie implementation was inspected or copied. Anantam's notice follows the user's requested first-visit interaction and the site's actual storage practices.

## Verification

The publication and production guards retain all 27 original model records, scores and ranks. Hallmark's rendered component sweep produced zero failures, reflex findings or warnings. The finish review found a phone notice/logo overlap and an unhandled Preferences link; both were fixed with targeted regression coverage. Automated accessibility checks support this review but do not certify WCAG conformance.

See the task's release report for the final CI run, production deployment and completed check totals.
