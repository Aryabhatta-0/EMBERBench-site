# Versions and evaluation identity

A reproducible result names the simulator, model interface, metrics, scoring version and evaluation environment. These names tell you what the result measures. They do not make it an official test result.

## Public contracts

The simulator, observation and action schema, metrics and EMBER Score each have a versioned contract. The [scoring specification](scoring.md) defines the formula, weights, gates, failure handling and aggregation. A change to this website does not change a published score.

Run `emberbench version` to see the contract versions of your package. Use the [CLI guide](cli.md), [evaluation guide](evaluation.md) and [frozen-environment contract](environment-pack.md) to reproduce a development result.

## Generator versions

Public generator versions describe development worlds only. Matching them does not make a result an official test result. See the [evaluation boundary](evaluation-boundary.md).
