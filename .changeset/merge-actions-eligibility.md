---
'grants-config-land-grants': minor
---

Combine `actions/actions_mapping.csv` and `actions/actions_sidedness.csv` into `actions/actions_eligibility.csv`, which holds each action code's SSSI and HF eligibility and, for linear actions, its sidedness. A land-grants-api without the matching change ignores the new file and keeps the values it already holds, so this can be released before or after it.
