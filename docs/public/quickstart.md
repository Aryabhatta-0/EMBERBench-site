# EMBERBench: public development

EMBERBench measures how decision models guide people through simulated fire evacuations. The simulator, observation/action interface, public training generator and EMBER Score are open source.

## What is published here

The website displays public-development results. Models may train or tune against these environments. Their scores are reproducible evidence about this public suite; they are not contamination-resistant hidden-test results and do not establish real-world evacuation safety.

Official EMBERBench requires server-side evaluation against an evaluator-private distribution. No official hidden-evaluation results are published here. A private runner or a retired research holdout must not be advertised as an active official leaderboard.

## Install and inspect the public CLI

Clone the public EMBERBench repository, then install its Python package with Python 3.12 or newer:

```sh
python -m pip install -e .
emberbench --help
emberbench version
```

The [command-line guide](cli.md) documents public generation, simulation, evaluation, replay verification and scoring. The [model interface](model-interface.md) defines the observations and actions that a model receives and returns.

## Run a public development evaluation

Use the [public scenarios](scenario-suite.md) and [evaluation guide](evaluation.md). Compare models under the same simulator and scoring versions, frozen environment pack, public schedule and inference settings. Keep unavailable operational measurements distinct from zero.

The [EMBER scoring specification](scoring.md) publishes the formula, component weights, gates, failure handling, aggregation and statistical comparison rules. Scoring transparency is intentional.

## Understand the boundary

The [evaluation boundary](evaluation-boundary.md) separates the open task from evaluator-private distribution construction. [Archived validation](archived-validation.md) describes previously disclosed research holdouts and their limits. These guides do not expose a future official suite's recipes, thresholds, mixture weights, seeds or rotation schedule.
