# Private evaluation release preparation

Status: **disabled; no private results published**. Batch `b20261028a` is frozen but unevaluated. The live public-development snapshot stays unchanged. Do not run models, create evaluation runs, search for result folders, or reuse the internal pilot. The owner will provide an external local results folder after a separate evaluation session has finished.

This is an offline projection and static rendering path. It does not implement an evaluator, calculate scores, resample episodes, or call providers. Its tests use explicitly synthetic JSON in OS temporary directories and local browser previews marked as synthetic. No synthetic result is a research result.

## Public boundary

The only approved public structure is below. Unknown or missing keys fail at every level. Identifiers/name are the minimum needed to identify a model and an adjacent pair; they must not encode private task information.

```ts
type Evaluation = {
  batch_label: 'b20261028a';
  manifest_hash: string; // SHA-256, 64 lowercase hex characters
  harness_version: string;
  scoring_version: string;
  run_date: string; // UTC YYYY-MM-DD, latest model completion date
  models: Array<{
    id: string;
    name: string; // resolved provider/model identity
    official_score: number; // 0–100, never refusal-excluded diagnostic score
    ci95: [number, number]; // official score's 95% confidence interval
    zero_score_share: number; // 0–1
    refusal_rate: number; // 0–1, scheduled episodes as denominator
    usd_suite: number | null;
    calls: number | null;
    tokens: {input: number | null; output: number | null};
    wall_time_s: number | null;
    run_date: string; // UTC YYYY-MM-DD
  }>;
  adjacent_pairs: Array<{
    model_a: string;
    model_b: string;
    separates: boolean;
  }>;
};
```

Scores are ordered highest to lowest, with pairs referring to consecutive model IDs in that same order. An adjacent separation comes from the paired, family-stratified bootstrap at 95% confidence. Individual score-CI overlap is not a substitute. Pair intervals, probabilities and family diagnostics remain private; only the boolean decision crosses the boundary. An unresolved difference is not proof of equivalence.

Never release scenario files, seeds, per-scenario or per-episode results, family names or parameters, exposure logs, replay traces, provider endpoints, local paths or any pilot records. The manifest hash is allowed; the manifest and its contents are not. The importer constructs the public object field by field. It never spreads or copies a raw result object into public output.

Missing operational measurements are `null`, displayed as “Not reported”. A measured zero remains zero. Tokens require both input and output to show a combined total. Complete-suite accounting must include refusals, retries and resumed segments. The last invocation's `runtime_s` and success-only accounting are not complete-suite totals. Estimated pricing must not be labelled as a reported billed cost.

## Evaluation-session handoff (outside this repository)

The owner supplies the external folder path. Read files in place; never copy that folder, its logs, or its raw records into either public repository, `work/`, Git attachments or deployment output.

The separate evaluation session must first verify completion, replay validity, the frozen batch commitment, common manifest/pack/protocol, harness and scoring versions, official scores with refusals included, and the matched model cohort. It must produce the supported validity analysis and verify complete-suite usage. This website cannot infer those facts from filenames or the presence of a run directory.

The session supplies `release-review.json` **in that external folder**, referring to its statement, analysis and model records by relative JSON path and SHA-256. This receipt is technical provenance from the evaluation session; it is not a request to conduct new model runs or an extra website approval workflow.

```ts
type FileReference = {file: string; sha256: string};
type PrivateReview = {
  batch_label: 'b20261028a';
  manifest_hash: string;
  harness_version: string;
  scoring_version: string;
  scheduled_episodes: number;
  statement: FileReference;
  analysis: FileReference & {
    method: 'paired-family-stratified-bootstrap';
    confidence: 0.95;
  };
  models: Array<{
    run: FileReference;
    replay_verified: true;
    complete: true;
    accounting: {
      coverage: 'full-suite' | 'unavailable';
      billing_basis: 'reported' | 'unavailable';
      usd_suite: number | null;
      calls: number | null;
      tokens: {input: number | null; output: number | null};
      wall_time_s: number | null;
    };
  }>;
};
```

If coverage is unavailable, all operational fields must be null. With full coverage, each unsupported measurement may still be null. If billing basis is unavailable, cost must be null. Refusal counts/rates must reconcile with the scheduled episode count. A run must identify exactly one resolved model. The supported analysis is `emberbench-validity/1.0`: `agents` supplies the official score, CI and zero-score share; `models_only.models` and `adjacent_pairs` supply the exact cohort and paired decisions. A paired interval rounded to zero inconsistently with `separated` is rejected; supply sufficient consistent precision from the evaluation session.

The checks bind the files to the supplied hashes and cross-check their contents. Hashes and `replay_verified` attestations cannot prove scientific truth or evaluator identity. The separate evaluation session remains responsible for the underlying replay verification, bootstrap procedure, accounting and trustworthy handoff.

## Check and stage, without publication

Run only after the owner provides the results path. Quotes are important for paths containing spaces.

```powershell
# Read/check only; writes nothing.
node tools/stage_evaluation_release.mjs --source "C:\external\completed-results"

# Optional minimal projection to a NEW external JSON file.
# Parent must already exist, outside both source folder and repository.
node tools/stage_evaluation_release.mjs --source "C:\external\completed-results" --out "C:\external\release\evaluation.json"
```

The exporter reads only explicitly referenced JSON files. It rejects path traversal, symlinked input, stale digests, mixed provenance, incomplete/unverified models, missing pairs and unexpected fields in the receipt/public object. Output is created exclusively, never overwritten. Parse and filesystem errors withhold raw private contents. It has no directory-copy, model, evaluator or network operation.

## Future activation

**Do not activate during preparation.** `tools/evaluation-publication.json` currently has `sha256: null`. No `site/data/evaluation.json` is present, and the normal build produces the same public site. Even an accidentally placed artifact is rejected while this gate is off.

When the owner later supplies results and requests publication:

1. Check the external handoff and inspect its minimal staged JSON against the public contract. Confirm every model/date/usage total and paired decision. Do not move private files into the repository.
2. Place **only that minimal aggregate projection** at `site/data/evaluation.json`; pin its exact byte SHA-256 in `tools/evaluation-publication.json`. The registry accepts only `b20261028a` and this fixed artifact path. Never change `site/data/results.js` to represent the private batch.
3. Run the build and checks below. The builder adds a separate “Private evaluation” section to the benchmark routes and its controlled stylesheet. It preserves the public-development cohort and existing data. New company artwork must be independently sourced/reviewed; unknown providers get a text identity and neutral color.
4. Review the built page at laptop and phone widths, downloads, scope labels and production checks before the ordinary deployment workflow. No automatic promotion is part of the exporter.

```sh
npm run build
node --test tests/site.test.mjs tests/docs-policy.test.mjs tests/evaluation.test.mjs
node tests/evaluation.browser.mjs
```

The prepared rendering has seven open vertical chart sections: official score with 95% CI, zero-score share, refusal rate, $/suite, calls, input/output token totals and wall time. Every series sorts independently highest to lowest, with honest lower-is-better labels and missing values last. Readable vertical bands replace sideways scrolling and zoom buttons. Adjacent-pair decisions and the approved batch metadata follow. There are no comparison tables, private scenario links or episode drill-downs. Static HTML remains readable without JavaScript.

The aggregate export is a separate contract from the legacy public dataset. Search/agent descriptions continue to describe the public-development snapshot until a deliberate future release updates their scope; preparation does not claim that private results exist.

## Skills applied

- **Evidence Provenance:** hashed source references, matched cohort/protocol checks and traceable field selection; explicit limits on what hashes establish.
- **Security and Hardening:** recursive public allowlist, disabled publication gate, path/symlink and output-boundary checks, no raw data copying.
- **UI/UX Pro Max:** direct values, visible uncertainty, truthful missing states, open vertical charts and responsive bands in Anantam's existing light theme. The owner's chart direction and fewer-layout preferences take precedence over generic chart recommendations.
