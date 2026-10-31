# Public development generator

`emberbench.generator` is the open development generator. Use it to make reproducible training and debugging worlds under the public simulator rules. You may generate and tune on these worlds.

## Scope

Public generator settings describe development worlds only. A generated suite, even with a fresh seed, is not an official or contamination-resistant test.

The [CLI guide](cli.md) lists the generation commands and the [scenario schema](scenario-schema.md) defines valid outputs. The [simulation contract](simulation-contract.md) defines movement, fire and outcomes. Generation does not change the [EMBER Score](scoring.md).

## Reproducible development

- Keep your configuration, generation manifest, simulator version and seeds with your run.
- Freeze generated scenarios before you compare models.
- Verify recorded trajectories and recompute metrics.

The official test is separate and private. See the [evaluation boundary](evaluation-boundary.md).
