# EMBERBench public-development results

- Models may train or tune on this public environment.
- One trial per model; no statistically significant winner is established.
- EMBER is a family-balanced composite out of 100, not a survival percentage.
- This is simulated research, not guidance for an actual evacuation.
- No evaluation timestamp is recorded in the source snapshot.

Scoring version: 1.0. Public worlds: 19. Source SHA-256: d80c3e9885fd0037568fc80d5cba186dd37a8b5464c71dcc5f0c5a6083d4b276.

## Decision models

- [typesafe/jev-1.14](https://anantam-labs.vercel.app/model.html?id=openrouter-typesafe_jev-1.14-choice-r1): 51.70 EMBER points / 100; Safety 0.5415; execution quality 0.7928.
- [typesafe/jev-1.13](https://anantam-labs.vercel.app/model.html?id=typesafe-jev-latest-choice-r1): 48.27 EMBER points / 100; Safety 0.4966; execution quality 0.7924.
- [nace-ai/drex-v2.0](https://anantam-labs.vercel.app/model.html?id=openrouter-nace-ai_drex-v2.0-choice-r1): 32.66 EMBER points / 100; Safety 0.3568; execution quality 0.7554.
- [liquid/d1-ultra](https://anantam-labs.vercel.app/model.html?id=openrouter-liquid_d1-ultra-choice-r1): 32.39 EMBER points / 100; Safety 0.3339; execution quality 0.7154.
- [openai/gpt-6-luna-decisions](https://anantam-labs.vercel.app/model.html?id=openrouter-openai_gpt-6-luna-decisions-choice-r1): 30.75 EMBER points / 100; Safety 0.3406; execution quality 0.7157.
- [nace-ai/drex-max](https://anantam-labs.vercel.app/model.html?id=openrouter-nace-ai_drex-max-choice-r1): 26.16 EMBER points / 100; Safety 0.2757; execution quality 0.7039.
- [perplexity/pplx-decider-v1.2](https://anantam-labs.vercel.app/model.html?id=openrouter-perplexity_pplx-decider-v1.2-choice-r1): 26.03 EMBER points / 100; Safety 0.2747; execution quality 0.7175.
- [subq/subq-snap-preview](https://anantam-labs.vercel.app/model.html?id=subq-subq-snap-preview-choice-r1): 24.76 EMBER points / 100; Safety 0.26; execution quality 0.7097.
- [respan/span-02](https://anantam-labs.vercel.app/model.html?id=openrouter-respan_span-02-choice-r1): 23.97 EMBER points / 100; Safety 0.2562; execution quality 0.6853.
- [cloudflare/clef](https://anantam-labs.vercel.app/model.html?id=openrouter-cloudflare_clef-choice-r1): 22.80 EMBER points / 100; Safety 0.2738; execution quality 0.6977.
- [microsoft/microsoft-decision-1](https://anantam-labs.vercel.app/model.html?id=openrouter-microsoft_microsoft-decision-1-choice-r1): 21.07 EMBER points / 100; Safety 0.2206; execution quality 0.7199.
- [inception/mercury-decide](https://anantam-labs.vercel.app/model.html?id=openrouter-inception_mercury-decide-choice-r1): 20.68 EMBER points / 100; Safety 0.224; execution quality 0.6602.
- [liquid/d1](https://anantam-labs.vercel.app/model.html?id=openrouter-liquid_d1-choice-r1): 19.94 EMBER points / 100; Safety 0.2119; execution quality 0.6754.
- [togethercomputer/tev1-4b-experimental](https://anantam-labs.vercel.app/model.html?id=openrouter-togethercomputer_tev1-4b-experimental-choice-r1): 19.84 EMBER points / 100; Safety 0.2231; execution quality 0.713.
- [perplexity/pplx-decider-flash-v1.2](https://anantam-labs.vercel.app/model.html?id=openrouter-perplexity_pplx-decider-flash-v1.2-choice-r1): 18.87 EMBER points / 100; Safety 0.2225; execution quality 0.6511.
- [cloudflare/clef-flash](https://anantam-labs.vercel.app/model.html?id=openrouter-cloudflare_clef-flash-choice-r1): 13.54 EMBER points / 100; Safety 0.1414; execution quality 0.7384.
- [cloudflare/clef-omni](https://anantam-labs.vercel.app/model.html?id=openrouter-cloudflare_clef-omni-choice-r1): 11.77 EMBER points / 100; Safety 0.1197; execution quality 0.7055.
- [upstage/solar-decide-flash](https://anantam-labs.vercel.app/model.html?id=openrouter-upstage_solar-decide-flash-choice-r1): 0.21 EMBER points / 100; Safety 0.0023; execution quality 0.4169.
- [upstage/solar-decide](https://anantam-labs.vercel.app/model.html?id=openrouter-upstage_solar-decide-choice-r1): 0.20 EMBER points / 100; Safety 0.0107; execution quality 0.3742.

## Reference agents

- cooperative-forecast-whca-r1: 88.59 EMBER points / 100.
- forecast-shortest-path-r1: 62.29 EMBER points / 100.
- congestion-aware-v1: 53.68 EMBER points / 100.
- fire-aware-shortest-path-v1: 40.81 EMBER points / 100.
- static-shortest-path-v1: 36.10 EMBER points / 100.
- nearest-exit-greedy-v1: 26.20 EMBER points / 100.
- random-legal-v1: 0.00 EMBER points / 100.
- always-stay: 0.00 EMBER points / 100.

[Structured public data](https://anantam-labs.vercel.app/data/leaderboard.json) · [Scoring contract](https://anantam-labs.vercel.app/docs/source/scoring.md) · [Evaluation scope](https://anantam-labs.vercel.app/docs/source/evaluation-boundary.md)
