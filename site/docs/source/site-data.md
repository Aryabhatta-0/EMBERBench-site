# Reading the published results

The Anantam website presents official **public development** score reports from EMBERBench. The benchmark's simulation, scoring and model runners live in the benchmark repository; this website reads a generated result artifact. It does not present hidden-suite results.

## What is in this snapshot?

The published snapshot contains 27 entries: 19 AI decision models and 8 hand-coded reference agents. The frozen schedule contains 19 worlds. Every published entry has one trial per world. These counts describe the current artifact, rather than a general promise about future evaluation releases.

The run originally identified by `jev-latest` resolves to `jev-1.13.0` and is displayed as `typesafe/jev-1.13`. Its original model ID remains intact for evidence links. The newer `typesafe/jev-1.14` is a separate evaluated report.

Results describe performance on the public diagnostic suite. They do not establish generalization to held-out environments, statistical superiority, or safety in real evacuations.

## Reading the charts

The results page contains a ranking chart, a safety-versus-quality scatter plot, people outcomes, and a selected model's scenario scores. Selecting a model updates these views together. Scenario bars open the evaluated worlds with the same model selected.

EMBER is a composite score from 0 to 100. It is **not** the percentage of people evacuated. Safety and Quality are 0–1 factors. The people-outcome chart uses recorded counts summed across evaluated worlds; these counts are not family-balanced scores.

The default ranking follows the scoring specification. A custom metric sort changes the visual order without redefining official rank. Missing API measurements remain unavailable and are never plotted as zero. Reference agents are hand-coded programs, rather than another group of commercial AI models.

For definitions, read [EMBER scoring](scoring.md), [Episode metrics](metrics.md), and [Statistical analysis](statistics.md).

## API cost and latency

API measurements come from the run metadata. Some costs are provider-reported; others are estimates derived from token counts and recorded list prices. The website marks estimates with `≈`. These are measurements of the evaluated runs, not live pricing quotations.

Mean decision latency measures the recorded wait for one action call. It is different from total run wall time, which can include rate-limit waits and other overhead. If a run was resumed, API metadata may describe only its final invocation. Requests and token counts should be interpreted with that coverage limit in mind.

Cost, tokens, request counts and latency never change the EMBER Score. An absent measurement does not mean the model used no resources.

## Confidence intervals

The displayed 95% intervals come from the score report's stratified resampling procedure. With one published trial per model, these intervals cannot measure unobserved between-trial variability. Visual score differences do not establish a statistically significant winner.

The separate comparison page shows descriptive differences. Official paired inference requires matching scoring versions, constants, manifests, packs and applicable episodes. Those official comparison outputs are not part of the website's data artifact.

## Trace a result

Model profiles retain the evaluated model ID, trials and result digests. Scenario evidence retains the scenario and model context. The methodology page exposes the suite, EnvironmentPack, pack digest and scoring version for this snapshot.

The artifact contains no evaluation timestamp. A page load time, file modification time or model order must not be interpreted as a “last evaluated” date.

You can read the [generated results artifact](../data/results.js) directly, or inspect [integrity and provenance](integrity.md) and [frozen environments](environment-pack.md) for the underlying verification rules.

## How results are published

The data builder reads finished run directories containing official score reports and optional API summaries. It validates that the reports belong to the same frozen pack and scoring version, then writes `site/data/results.js`. That file is generated; displayed values must never be entered by hand in interface code.

Documentation is hosted as static pages on this site and works independently of loading the result artifact. The benchmark guides are mirrored from a recorded source revision, with their original Markdown available for download and the Apache License 2.0 preserved.
