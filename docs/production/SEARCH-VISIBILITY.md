# Search visibility work — 28 October 2026

Target: https://anantam-labs.vercel.app/. Primary identity **Anantam**, searchable alternate name **Anantam Labs**, exact tagline **Boundless Possibilities**. EMBERBench remains the sole published contribution. No private results or new products are announced.

## Observed baseline

The India-targeted search for `"anantam labs"` returned ten other profiles/entities, with no target-site result. `site:anantam-labs.vercel.app` returned no results from that search source. These observations do not measure the owner's personalized Google ranking, prove deindexing or establish a ranking cause. Google states that `site:` results are not exhaustive; use Search Console's URL Inspection for the actual status.

Live HTTP checks found the homepage, robots.txt and sitemap accessible with status 200, an index/follow homepage, the correct canonical and no X-Robots-Tag exclusion. A simulated Googlebot user-agent received the same accessible content; that is an access check, not evidence of a real Googlebot visit. The sitemap contains 31 URLs. Google's actual crawl date, selected canonical, indexed status, impressions, clicks and position remain **unverified** without owner-account access.

## Concrete corrections

- Homepage title/description and visible contribution copy establish Anantam Labs. About explicitly connects the Anantam and Anantam Labs names while retaining the unregistered-initiative disclosure.
- WebSite and Organization schema use `alternateName: Anantam Labs`; Organization links the actual official GitHub organization with `sameAs`. No invented social profiles, legal name or registration details.
- Markdown and the agent guide carry the same alias. These improve accessibility to tools; they are not claimed to improve Google rankings or trigger AI citations.
- The official GitHub organization previously had no website. The benchmark repository had no homepage, and the site repository pointed at the old host. Organization/repository website fields and descriptions now identify the current site. Both default-branch READMEs link directly to the company site, public results, methodology and docs.
- Public results, scientific ranks and the disabled private-batch gate stay unchanged.

## Google owner-account handoff

Search Console is not connected, and browser control did not initialize. The owner has been asked for the HTML verification tag. No account access or indexing submission is claimed.

1. In [Search Console](https://search.google.com/search-console/), add the **URL-prefix** property `https://anantam-labs.vercel.app/`. Do not try to verify the parent `vercel.app` domain.
2. Choose HTML tag verification and provide the generated `google-site-verification` value. It is an intentionally public ownership-verification token, not a password or API credential.
3. Set that exact value in `tools/search-verification.json`, rebuild, run the checks and promote the reviewed deployment. The builder adds one static tag to the homepage's head. Keep it for Google's periodic ownership checks; never invent a value. Unknown keys or executable markup fail validation.
4. Click Verify in Search Console. Submit `https://anantam-labs.vercel.app/sitemap.xml` under Sitemaps and record its real processing status.
5. Inspect `/`, `/about.html` and `/benchmark.html`; run the live test and request indexing where appropriate. Record Google's actual reported reason for exclusions before choosing a fix. Do not repeatedly resubmit the same URL to try to accelerate crawling.
6. Record Page Indexing status and Search Performance for `anantam`, `anantam labs` and `emberbench`, including property, date range, country/device filters, impressions, clicks, CTR and average position. No report data yet exists in this task. A screenshot/search rank is not a substitute for those measurements.

The earlier IndexNow submission returned HTTP 202 for 31 URLs. It does not prove Google submission, indexing or ranking. No further identical submission is needed to verify ownership with Google. No advertising, fake reviews, purchased links or fabricated third-party mentions are introduced.

## Release safety

Updating the website repository's default-branch README triggered its existing Vercel Git integration to publish older `main` code. The previously reviewed production deployment was restored immediately. The project is now configured with **automatic production domain assignment disabled** (`autoAssignCustomDomains: false`). Git builds can continue, but assigning the live domain requires an explicit promotion of a reviewed deployment. Keep this deliberate promotion workflow while the open stacked PRs remain unmerged.

The upload ignore file excludes local QA work, local evaluator checkouts, environments and logs. Only `site/` is hosted; the strict publication checker remains the first deployment build step.

## Sources and skills

Local verification passed: 47 native/publication tests, 145 production/reading/navigation browser checks and 34 accessibility scans. Production guards validate 47 HTML pages, 31 indexable sitemap URLs and 27 unchanged public model records. The original result artifact retains SHA-256 `d80c3e9885fd0037568fc80d5cba186dd37a8b5464c71dcc5f0c5a6083d4b276`; the private release remains disabled. Automated accessibility scans are not a conformance certification.

[Google site names](https://developers.google.com/search/docs/appearance/site-names), [Organization schema](https://developers.google.com/search/docs/appearance/structured-data/organization), [ownership verification](https://support.google.com/webmasters/answer/9008080), [requesting recrawls](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [site-query limits](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site), [Google AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Vercel promotion](https://vercel.com/docs/deployments/promoting-a-deployment).

SEO Audit supplied the evidence-based baseline and explicit unverified metrics. Source-Driven Development supplied Google's supported identity/verification patterns. Security and Hardening supplied strict verification-value validation and the unchanged publication boundary. Vercel Deploy/CLI supplied scoped project inspection, recovery and deliberate promotion. Existing relevant skills were used; no unrelated package was installed.
