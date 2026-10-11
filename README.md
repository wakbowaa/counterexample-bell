# Counterexample Bell

Some claims deserve applause only after they survive an honest attempt to break them. Counterexample Bell opens a bounded public falsification window around one universal claim and its explicit domain.

The owner rings the bell with two to eight domain rules. A different wallet may submit a concrete scenario and an argument. Validators agree on the complete domain-membership vector and whether the scenario contradicts the claim. Only `all(domain_matches) && contradicts` can produce `VALID_COUNTEREXAMPLE` and move the record to `BROKEN`. Outside-domain examples and ambiguity remain visible without defeating the claim.

An untouched bell may be cancelled by its owner. Once challenged, the owner cannot erase it. If no valid counterexample arrives before the deadline, anyone may close the bell as `SURVIVED`. This is a falsification receipt, not proof that a claim is eternally true.

This repository is intentionally contract-native: the complete public API is exposed directly through GenLayer Studio and Explorer, so it does not ship a decorative frontend.

Run `python -m pytest -q` and `genvm-lint contracts/contract.py`. Deployment and a live challenge are recorded after StudioNet publication.
