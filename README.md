# Counterexample Bell

Some claims deserve applause only after they survive an honest attempt to break them. Counterexample Bell opens a bounded public falsification window around one universal claim and its explicit domain.

The owner rings the bell with two to eight domain rules. A different wallet may submit a concrete scenario and an argument. Validators agree on the complete domain-membership vector and whether the scenario contradicts the claim. Only `all(domain_matches) && contradicts` can produce `VALID_COUNTEREXAMPLE` and move the record to `BROKEN`. Outside-domain examples and ambiguity remain visible without defeating the claim.

An untouched bell may be cancelled by its owner. Once challenged, the owner cannot erase it. If no valid counterexample arrives before the deadline, anyone may close the bell as `SURVIVED`. This is a falsification receipt, not proof that a claim is eternally true.

This repository is intentionally contract-native: the complete public API is exposed directly through GenLayer Studio and Explorer, so it does not ship a decorative frontend.

## Verified StudioNet deployment

- Contract: [`0x8A076bE666aF7ABf1502B7a4D2E8D155F7699068`](https://explorer-studio.genlayer.com/address/0x8A076bE666aF7ABf1502B7a4D2E8D155F7699068)
- Deployment transaction: [`0xc7f006...c9f5cc`](https://explorer-studio.genlayer.com/tx/0xc7f006f1f6267f94a759e111f8bdb250ca6d22a7c75d264b3eaf1ced32c9f5cc)
- Live ring transaction: [`0x1961c9...a2b3c`](https://explorer-studio.genlayer.com/tx/0x1961c94324a512d7200312cc5d3fac80789e6fd177858f13c06be55c351a2b3c)
- Live challenge transaction: [`0x796d75...af0ac5`](https://explorer-studio.genlayer.com/tx/0x796d75dd0712e65682c93147de4efff9382f47c2d3dcfb808824dc6d00af0ac5)

The finalized evidence record is in `evidence/live-run.json`. Run `python -m pytest -q` and `genvm-lint contracts/contract.py` to repeat local checks.
