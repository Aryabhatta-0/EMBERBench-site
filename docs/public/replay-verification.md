# Replay verification

Replay verification checks a recorded run against the simulator rules and recomputes its measurements. It is part of EMBERBench's public reproducibility contract.

## Before scoring

The evaluator checks that:

- the run belongs to the expected suite and schedule
- every action is valid under the simulator contract
- the replayed measurements agree with the stored metrics

Scoring then uses only verified outcomes under the pinned [scoring specification](scoring.md). The [evaluation guide](evaluation.md), [episode metrics](metrics.md) and [frozen environments](environment-pack.md) describe the public record formats.

## What a model sees

Models receive only the documented [observations and allowed actions](model-interface.md). Evaluator data, such as seeds and future fire states, never goes into an observation or an error message.

## Safe publication

Publish reviewed aggregate outcomes, not raw evaluation manifests and seeds.
