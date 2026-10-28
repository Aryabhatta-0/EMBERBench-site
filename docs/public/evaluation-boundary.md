# Public development and official evaluation

EMBERBench keeps the task open while separating the official test distribution from public development material.

## Public development leaderboard

The results currently displayed on this website come from the public development suite. Models may train or tune against this environment. Scores can be reproduced, but this exposure means they are not contamination-resistant hidden-test results.

## Official EMBERBench

Official evaluation is a separate server-side process. Its scenario distribution and frozen evaluation assets are evaluator-private. No official hidden-evaluation results or live submission service are announced here.

A future official result requires a frozen model identity, private policy and suite commitments, authenticated trajectories, pinned scoring versions and an appropriate publication review. The public scoring formula alone does not certify an official evaluation.

## What remains open

The observation/action API, simulator semantics, public training generator, public scenarios, baseline agents, CLI, metric definitions, EMBER Score, aggregation/statistics, replay verification and fairness contract remain public. Component weights, gates and failure handling stay in the [normative scoring specification](scoring.md).

## Evaluator-private material

Official suite composition, generator parameter distributions, scenario-mixture weights, hidden-membership thresholds, candidate-pool construction, top-up recipes, adversarial templates, hidden out-of-distribution variants, seeds, frozen hidden suites and exact future rotation schedules stay outside the public repositories and website.

Private evaluation should cover unseen in-distribution, distribution-shift and adversarial cases. Exact proportions and construction parameters belong to the private policy rather than the public documentation.

## Disclosure and retirement

Previously published recipes, seeds and detailed study results are exposed historical research. Removing a current file cannot erase public Git history, earlier packages, previews or copies. They must not be reused or represented as a secret official distribution. New official evaluation requires a fresh private policy and new private assets.

Only reviewed, allowlisted public contracts and curated guides are hosted here. Former construction-study URLs lead to this boundary or an archived-validation explanation; their raw recipes and Markdown downloads are not published by the site.

## Official scoring is not official hidden evaluation

An official-scoring flag identifies use of the normative public formula and constants. It does not certify that a result came from a private distribution or an official hidden test. Public development results may correctly use the official EMBER Score.
