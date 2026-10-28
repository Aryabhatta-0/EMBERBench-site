# Replay verification

Replay verification authenticates a recorded trajectory against the simulator rules and recomputes its measurements. It is a public part of EMBERBench's reproducibility contract.

## Before scoring

The evaluator checks that the recorded run belongs to the expected suite and schedule, that actions are valid under the simulator contract, and that replayed measurements agree with the stored metrics. Scoring then consumes verified outcomes under the pinned [scoring specification](scoring.md).

The [evaluation guide](evaluation.md), [episode metrics](metrics.md) and [frozen environments](environment-pack.md) describe the public record formats and paired public-development workflow. Verification is not a substitute for protecting an official test distribution.

## Model-visible boundary

Models receive only the documented [observations and allowed actions](model-interface.md). Evaluator-private seeds, future fire states, family-selection rules, construction metadata and private configuration must not be added to the model's observation or error response.

## Safe publication

A full evaluation result can embed its manifest and evaluation seeds. Official evaluation must keep such raw artifacts private while a batch remains live. Publish reviewed aggregate outcomes and approved provenance commitments rather than raw live-suite manifests. Releasing an old batch for audit must retire its secrecy claim first.

## Historical evidence

A disclosed seed or construction procedure remains useful for scientific validation, but belongs to [archived research](archived-validation.md). The [evaluation boundary](evaluation-boundary.md) explains why reproducible public-development results are distinct from official hidden evaluation.
