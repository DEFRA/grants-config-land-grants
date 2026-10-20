# CNUM2_26 — Legumes on improved grassland

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/cnum2-legumes-on-improved-grassland)

Configured in `configurations/land-grants/actions_config/CNUM2_26/`. 1 version(s) documented, newest first.

## Version 1.0.0

### Configuration

| Field                   | Value                         |
| ----------------------- | ----------------------------- |
| Code                    | CNUM2_26                      |
| Description             | Legumes on improved grassland |
| Semantic version        | 1.0.0                         |
| Enabled                 | Yes                           |
| Displayed to applicants | Yes                           |
| Unit of measurement     | ha                            |
| Duration (years)        | 3                             |
| Start date              | 2026-10-18                    |
| Display order           | 0                             |
| Group ID                | —                             |
| Availability            | partial                       |
| Payment                 | £102 per ha                   |
| Payment method          | default-calculation           |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                         | Description                                               | Configuration                                                                      | Caveat message                             |
| ------------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                  | `layerName`: moorland<br>`maximumIntersectionPercent`: 0<br>`tolerancePercent`: 10 | —                                          |
| `applied-for-total-or-partial-available-area`                | Has the total or partial available area been applied for? | —                                                                                  | —                                          |
| `sssi-consent-required`                                      | Is the site of special scientific interest?               | `layerName`: sssi<br>`tolerancePercent`: 1                                         | A consent is required from Natural England |

### Example output

> ⚠️ Example output unavailable for 1.0.0: failed to publish config: Timed out waiting for actions_config row code=CNUM2_26 version=1.0.0

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "ha",
  "availability": {
    "type": "partial"
  },
  "code": "CNUM2_26",
  "description": "Legumes on improved grassland",
  "display": true,
  "displayOrder": 0,
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/cnum2-legumes-on-improved-grassland",
  "payment": {
    "ratePerUnitGbp": 102
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 102
    },
    "name": "default-calculation",
    "version": "1.0.0"
  },
  "rotationType": "rotational",
  "rules": [
    {
      "config": {
        "layerName": "moorland",
        "maximumIntersectionPercent": 0,
        "tolerancePercent": 10
      },
      "description": "The parcel should not be on the moorland",
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer"
    },
    {
      "description": "Has the total or partial available area been applied for?",
      "name": "applied-for-total-or-partial-available-area"
    },
    {
      "config": {
        "caveatDescription": "A consent is required from Natural England",
        "layerName": "sssi",
        "tolerancePercent": 1
      },
      "description": "Is the site of special scientific interest?",
      "name": "sssi-consent-required",
      "version": "1.0.0"
    }
  ],
  "semanticVersion": "1.0.0",
  "startDate": "2026-10-18"
}
```

</details>
