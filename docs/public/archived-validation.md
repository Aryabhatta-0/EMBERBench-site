# Archived validation and research holdouts

EMBERBench's scoring studies used public diagnostic suites and generated research holdouts to examine score behaviour. Their disclosed seeds, generator configurations and study results are historical validation evidence.

## A research holdout is not an official secret test

A set can be held out during a particular scoring study and later be published for reproducibility. Once its seed or construction recipe has been disclosed, it must be described as an archived validation set or research holdout. It is no longer an undisclosed official evaluation set.

The published scoring formula, component weights, gates, aggregation and failure rules remain available in the [scoring specification](scoring.md). Their transparency does not require publishing a future official test distribution.

## What archived studies can establish

Archived studies can document sensitivity to scoring choices, sanity checks, known baseline behaviour and reproducibility under a pinned simulator. They cannot establish that a model generalizes to a future private distribution, that a disclosed recipe is contamination-resistant, or that results from the public development suite are official hidden-test results.

## What is on this website

The displayed results are public-development evaluations. Models may train or tune against their environments. They are not evidence that the previously disclosed research holdout or archived suite-construction recipe remains secret.

## Future official evaluation

A future official batch must use a separately maintained private policy and fresh private assets. It should assess unseen layouts, distribution shifts and adversarial failure cases while keeping exact construction parameters private. Public reporting must preserve the scoring contract and clearly identify the actual evaluation scope.

The [evaluation boundary](evaluation-boundary.md) records what stays public and what belongs to the evaluator-private workspace.
