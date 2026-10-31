# EMBERBench: public development

EMBERBench measures how decision models guide people through simulated fire evacuations. The simulator, observation and action interface, public training generator and EMBER Score are open source.

The results on this site come from the public development suite. Models may train or tune on it. The scores are reproducible, but they are not official test results and do not show real-world evacuation safety. See the [evaluation boundary](evaluation-boundary.md).

## Install the command line

Clone the public EMBERBench repository, then install the Python package with Python 3.12 or newer:

```sh
python -m pip install -e .
emberbench --help
emberbench version
```

The [command-line guide](cli.md) covers generation, simulation, evaluation, replay verification and scoring. The [model interface](model-interface.md) defines what a model receives and returns.

## Run a public development evaluation

Use the [public scenarios](scenario-suite.md) and the [evaluation guide](evaluation.md). Compare models with the same simulator and scoring versions, frozen environment pack, schedule and inference settings. Keep missing measurements separate from zero.

The [EMBER scoring specification](scoring.md) gives the formula, weights, gates, failure handling, aggregation and statistics.
