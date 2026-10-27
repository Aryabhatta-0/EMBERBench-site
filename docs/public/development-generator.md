# Public development generator

`emberbench.generator` is the open development generator. It supports reproducible training and debugging worlds under the public simulator contract. Public users may generate and tune on these worlds.

## Public scope

Public generator configurations and descriptive family thresholds define development behaviour. They do not define membership in the official hidden evaluation distribution. A generated suite, even when generated after submission with a fresh seed, is not automatically an official or contamination-resistant test.

Use the [CLI guide](cli.md) for the supported generation commands and the [scenario schema](scenario-schema.md) for valid outputs. The [simulation contract](simulation-contract.md) defines movement, fire and outcomes. Development generation does not change the [EMBER Score](scoring.md).

## Reproducible development

Keep your development configuration, generation manifest, simulator version and seeds with your own run. Freeze generated scenarios before comparing models. Verify recorded trajectories and recomputed metrics. These are development reproducibility practices, not evidence that a publicly specified distribution is secret.

## Official evaluation is separate

Official evaluation uses evaluator-private families, parameter distributions, mixture weights, selection rules, adversarial cases, out-of-distribution variants and seeds. The official path must require its private policy and must fail closed if that policy is missing. It must not fall back to the public generator, public family thresholds or an archived composition recipe.

No private recipe or exact official suite composition is distributed through this website. The [evaluation boundary](evaluation-boundary.md) explains the public/private contract and publication rules.
