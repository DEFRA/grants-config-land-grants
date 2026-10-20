# CSAM3_26 — Herbal leys

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/csam3-herbal-leys)

Configured in `configurations/land-grants/actions_config/CSAM3_26/`. 1 version(s) documented, newest first.

## Version 1.0.0

### Configuration

| Field                   | Value               |
| ----------------------- | ------------------- |
| Code                    | CSAM3_26            |
| Description             | Herbal leys         |
| Semantic version        | 1.0.0               |
| Enabled                 | Yes                 |
| Displayed to applicants | Yes                 |
| Unit of measurement     | ha                  |
| Duration (years)        | 3                   |
| Start date              | 2025-01-01          |
| Display order           | 0                   |
| Group ID                | —                   |
| Availability            | partial             |
| Payment                 | £224 per ha         |
| Payment method          | default-calculation |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                         | Description                                               | Configuration                                                                      | Caveat message |
| ------------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| `applied-for-total-or-partial-available-area`                | Has the total or partial available area been applied for? | —                                                                                  | —              |
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                  | `layerName`: moorland<br>`maximumIntersectionPercent`: 0<br>`tolerancePercent`: 10 | —              |

### Example output

> ⚠️ Example output unavailable for 1.0.0: failed to publish config: Timed out waiting for actions_config row code=CSAM3_26 version=1.0.0

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "ha",
  "availability": {
    "type": "partial"
  },
  "code": "CSAM3_26",
  "description": "Herbal leys",
  "display": true,
  "displayOrder": 0,
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/csam3-herbal-leys",
  "payment": {
    "ratePerUnitGbp": 224
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 224
    },
    "name": "default-calculation",
    "version": "1.0.0"
  },
  "rotationType": "rotational",
  "rules": [
    {
      "description": "Has the total or partial available area been applied for?",
      "name": "applied-for-total-or-partial-available-area"
    },
    {
      "config": {
        "layerName": "moorland",
        "maximumIntersectionPercent": 0,
        "tolerancePercent": 10
      },
      "description": "The parcel should not be on the moorland",
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer"
    }
  ],
  "semanticVersion": "1.0.0",
  "startDate": "2025-01-01"
}
```

</details>
