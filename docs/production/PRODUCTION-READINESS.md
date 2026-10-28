# Production readiness — 28 October 2026

Primary origin: https://anantam-labs.vercel.app/. Anantam is an independent initiative, not currently a registered company. The owner authorised `arsathvik48@gmail.com` as the public enquiry/privacy/security contact. No postal address, company registration, jurisdiction, phone number, certifications or extra products were invented.

## Delivery

- Static Privacy, Terms, Cookies and preferences, About, Contact and Accessibility pages; shared footer links on every page. Effective policy date: 28 October 2026.
- No application cookies, ads, visitor analytics, remotely hosted fonts or social embeds. Vercel project inspection confirms Web Analytics disabled; Speed Insights has no collected data. Provider security processing is disclosed rather than claiming the host receives no information.
- Optional comparison memory is off until the visitor saves an explicit choice. Withdrawal removes saved selections. Clear removes only `anantam-preferences`, `ember-compare` and the old `ember-theme` key, preserving other site data. Blocked storage has a truthful failure message and does not break comparison. URLs still preserve explicit view state and may reach hosting logs on navigation; the policies explain that distinction.
- Useful initial HTML for benchmark results, methodology and scenarios. Static navigation/footer and the homepage's reserved header height reduce load-time layout changes. A failed interactive results import preserves published text evidence, JSON/docs links and a retry action. Original results, scientific ranks and scores are unchanged.
- Distinct page titles/descriptions, canonical URLs, full Open Graph and Twitter cards, accurate 1200×630 social artwork, verified-contact Organization/WebSite metadata, Dataset metadata and documentation breadcrumbs. No fake reviews, addresses, incorporation details or hidden-test claims.
- Sitemap generated from the actual 31 indexable canonical HTML pages, including all 20 reviewed guides. Retired guides, error pages, duplicate result aliases and parameter-driven model/comparison pages are excluded. A robots file advertises the sitemap.
- `llms.txt`, Markdown alternatives and compact JSON let agents read public research without rendering an application. The files preserve public-development, one-trial and score-interpretation limitations; they do not advertise an inference API, MCP server or official submission service.
- Ordered Vercel static routes negotiate Markdown for explicit `Accept: text/markdown`, declare `Vary: Accept` and canonical links, and preserve real HTML/Markdown HTTP 404s. The legacy leaderboard URL remains a compatible canonical alias so query state is retained. Old social-card requests redirect to the corrected artwork.
- HTTP CSP, framing protection, MIME sniffing protection, referrer and device-permission policies, and HSTS. JSON-LD has CSP hashes; JavaScript does not gain `unsafe-inline` or `unsafe-eval`. Only content-fingerprinted assets receive immutable caching; HTML, modules and result artifacts revalidate. No application server or production dependency installation was added.
- A private security-report contact is published at `/.well-known/security.txt`, expiring 28 April 2027. Renew it before expiry.
- An IndexNow hosting-verification file and deliberate maintainer submission command cover the sitemap's public URLs. The token is intentionally reachable over public HTTP for that protocol; it is not an account credential. Acceptance is not indexing or a ranking guarantee.

## Measurements and checks

Three-run cold-cache Chromium lab comparison: 390×844 viewport, 1.6 Mbps download, 150 ms latency, 4× CPU slowdown, local static delivery. These are synthetic observations, not production field Core Web Vitals or traffic measurements.

| Metric | Baseline median | Updated median |
| --- | ---: | ---: |
| Resource bytes | 1,054,754 | 253,689 |
| Load event | 5,821.9 ms | 2,352 ms |
| Cumulative layout shift | 0.10237 | 0.00008 |
| Largest contentful paint | 2,208 ms | 2,024 ms |
| Long tasks | 2 | 9 |

The byte reduction is about 76%, and the measured load-event reduction about 60%. LCP changed modestly and is not claimed as a field improvement. The long-task count increased; no INP or field-interaction claim is made. Preserving the requested one-time particle assembly remains part of the design. The logo changed from 629,173 bytes to a 31,544-byte on-screen encoding; the two fonts changed from 310,176 bytes to 104,696 bytes. Original font licences and supplied artwork remain available. The new social image is 28,516 bytes and uses the exact current tagline/name.

`tools/check_public_site.mjs` retains the strict public/private boundary and pinned original data hash. `tools/check_production.mjs` verifies 47 HTML pages, 31 sitemap URLs, 27 unaltered public model records, canonical/Markdown links, schema, policies, real-error routes and security headers. CI rebuilds the generated artifacts and rejects drift from committed output. Native dependency audit: zero known npm advisories at this review.

## Dora and agent research

See [DORA-SEO-RESEARCH.md](DORA-SEO-RESEARCH.md) for primary-source evidence. Dora's public guides document shared defaults, per-page title/description/URL overrides and deliberate domain publishing. Its live domains did not resolve through the research tool; no live-source reverse engineering or automatic traffic-promotion engine is claimed. We applied the supported techniques rather than copying unsupported promises.

The initial Is Agentic report scored the exact production target 56/100 on 28 October 2026. Its issues included missing JSON-LD, trust pages and Markdown negotiation. Some recommendations attribute the hosting platform to the site or request features inappropriate for a static research project. We did not invent an address, MCP server or public API to satisfy a score. A report is a point-in-time third-party heuristic; cached reports refresh after six hours unless explicitly rescanned. Do not report a score improvement without a newer `scanned_at` value.

## Remaining owner-dependent work

Google Search Console and Bing Webmaster account ownership were not available through a connected tool. For Google, create/verify the URL-prefix property `https://anantam-labs.vercel.app/` and submit `sitemap.xml`; do not try to verify the parent `vercel.app` DNS domain. A future verification token can be published after the owner obtains it. No token, indexed-page count, ranking, backlink acquisition, organic traffic or paid promotion is fabricated.

Policies describe the audited implementation and are not a legal-compliance certification or jurisdiction-specific legal opinion. Review them with appropriate legal advice before introducing accounts, payments, analytics, submissions, a registered entity or new personal-data processing. Re-audit dependencies and update the policy/security dates when practices change.

## Skills used

- SEO Audit (Firecrawl): inspected actual production metadata/content and prioritised source-backed defects instead of inventing a score or forecasting traffic.
- Research: delegated primary-source Dora publishing/SEO research and retained a cited report with coverage limits.
- Source-Driven Development: checked Google Search Central, Vercel configuration, the llms.txt proposal, IndexNow and regulator/provider documentation before implementing the relevant patterns.
- Vercel Is Agentic: obtained the baseline report, addressed relevant evidence, and rejected fake business/MCP fields and stale-score claims.
- Security and Hardening: explicit data/storage boundaries, fail-closed publication checks, dependency audit, safe static JSON parsing, headers and no new visitor tracking.
- Performance Optimization: measured cold loads before changing assets/layout, then repeated the same lab conditions and recorded the trade-offs.
- Accessibility: keyboard/policy/preference journeys, JavaScript-disabled reading, reduced motion and axe checks, including WCAG 2.2 tags on the new pages. Automated scans are not a conformance certification.
- Vercel Deploy: release to the existing production project after CI, with control-plane verification of the promoted commit and alias.
Relevant skills were already installed. No unrelated reverse-engineering or marketing package was installed, and the public-source analysis does not pretend to inspect Dora’s private code.

Primary sources: [Dora SEO](https://dora-design.notion.site/SEO-Settings-3df9c8d15c2a4ae586aeb65d2ac869c9?pvs=25), [Dora publishing](https://dora-design.notion.site/Publish-Custom-Domain-be8260e71892403da18d0d8a3f24b0e4?pvs=25), [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [Dataset structured data](https://developers.google.com/search/docs/appearance/structured-data/dataset), [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [llms.txt proposal](https://llmstxt.org/), [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json), [IndexNow](https://www.indexnow.org/documentation), [ICO cookies guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/), [Vercel privacy](https://vercel.com/legal/privacy-notice).
