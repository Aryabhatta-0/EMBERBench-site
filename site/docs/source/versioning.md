# Versions and evaluation identity

A reproducible public-development result identifies the simulator, model interface, metrics, scoring version and evaluation environment. These identities explain what the result measures; they must not be confused with an official hidden-test certification.

## Public contracts

The simulator, observation/action schema, metrics and EMBER Score have separate versioned contracts. The [scoring specification](scoring.md) defines the formula, weights, gates, failure handling and aggregation. A change to website presentation does not change the published score artifact.

Use `emberbench version` to inspect the public package's contract versions. Consult the [CLI guide](cli.md), [evaluation guide](evaluation.md) and [frozen-environment contract](environment-pack.md) when reproducing a development result.

## Development generator identity

The public generator and its descriptive family/calibration rules describe public development behaviour. Their version strings do not declare an official private distribution, and matching them does not make a development result an official hidden-evaluation result.

## Private official policy

Official evaluation separately pins a private policy and frozen batch. The public record may expose approved commitments and scoring identities without exposing the underlying distributions, membership thresholds, seeds, candidate history or future rotation schedule. Missing private policy must stop official generation rather than select a public fallback.

## Retired research

Previously disclosed study holdouts and composition recipes remain archived public research, even when their original version labels are retained for historical artifact compatibility. They cannot regain secrecy through a version rename or deletion from the current tree.

See [archived validation](archived-validation.md) and the [evaluation boundary](evaluation-boundary.md) before interpreting any hidden-evaluation claim.
