# Results and documentation revision

The results page no longer embeds comparison tables, a data-table toggle, multi-model selection, a scenario comparison selector or a quick-compare panel. Its fourth chart now shows the selected model's ten scenario scores as labeled bars on a fixed 0–100 scale. The existing separate comparison route remains available for deliberate comparison.

The results main element spans the browser width. Desktop gutters are 32px; phone gutters are 20px. The explorer and individual chart sections have no card background, enclosing border or rounded frame. Charts retain vertical page space, readable labels, filters, model selection, keyboard access and evidence links. Reset restores the Scores lens as well as filters.

## Documentation

`docs.html` opens a local documentation library. It includes all 26 upstream guides, the benchmark overview/setup README and a site-data interpretation guide. Every article is complete static HTML, with guide navigation, section links, adjacent-guide links and original Markdown downloads. JavaScript adds local full-text search, code copying and mobile menu behavior. Reading does not require JavaScript, GitHub availability or the result artifact to load.

The 26 source-document blobs were checked against the GitHub directory response; every blob matched the local benchmark checkout. `site/docs/source-manifest.json` records benchmark revision `f0ba4774cecae7c3dad83ebaee4f2e3e8e7d41c8` and original blob identities. The source license is included. The static build uses Marked and sanitizes rendered HTML; these are build dependencies, not browser bundles. Documentation links in methodology, scenario evidence, shared navigation and fallback text now open local guides. Explicit source-code links still identify implementation files on GitHub.

## Skills applied

- **UI/UX Pro Max:** searched documentation navigation guidance and applied readable mobile text, visible labels, predictable local navigation, unobscured anchors and contrast checks. The existing brand palette is preserved.
- **Hallmark v2:** used the existing locked visual system and its floor to keep the docs typography and colors consistent, avoid generic card stacks, preserve focus states and check rendered layouts. The user explicitly overrides its capped-container default for leaderboard results. The render sweep reports zero hard failures after fixing the docs search field contrast. Inherited white-control/optical-spacing reflexes are retained under the recorded design exceptions; long technical documents and a conventional quoted-protocol treatment are intentional.
- **Brainstorming:** the bounded brief is the user's explicit correction: remove embedded comparisons, use the leaderboard viewport and host complete documentation. No additional feature-approval step was introduced.

No newly installed design skill is claimed. Relevant requested skills were already installed; only the two Markdown build dependencies were added for this revision.

## Validation

- 19 Node checks pass.
- Across the browser suites: 393 checks and 64 accessibility scans pass with no reported violations. The documentation and reading suites were rerun after the final link, field-contrast and reset changes.
- All 28 local guide pages and their relative assets, guide links and section anchors resolve.
- Responsive result/docs checks include 320, 390, 768, 1440 and 1920px widths; dashboard also covers 1280px.
- Full-text search, empty-search recovery, guide navigation, methodology-to-docs links, mobile Escape/focus restoration, no-JavaScript reading and unavailable-results independence pass.
- Existing hero assembly/continuous line behavior, model/scenario evidence, missing API values, filters and keyboard selection pass.
- `site/data/results.js` is unchanged. There is no merge or deployment in this revision.
