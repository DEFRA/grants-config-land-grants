# CLIG3_26 — Manage grassland with very low nutrient inputs

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/clig3-manage-grassland-with-very-low-nutrient-inputs)

Configured in `configurations/land-grants/actions_config/CLIG3_26/`. 1 version(s) documented, newest first.

## Version 1.0.0

### Configuration

| Field                   | Value                                          |
| ----------------------- | ---------------------------------------------- |
| Code                    | CLIG3_26                                       |
| Description             | Manage grassland with very low nutrient inputs |
| Semantic version        | 1.0.0                                          |
| Enabled                 | Yes                                            |
| Displayed to applicants | Yes                                            |
| Unit of measurement     | ha                                             |
| Duration (years)        | 3                                              |
| Start date              | 2025-01-01                                     |
| Display order           | 0                                              |
| Group ID                | —                                              |
| Availability            | total                                          |
| Payment                 | £151 per ha                                    |
| Payment method          | default-calculation                            |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                         | Description                                                           | Configuration                                                                      | Caveat message                             |
| ------------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `applied-for-total-available-area`                           | Has the total available area been applied for?                        | —                                                                                  | —                                          |
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                              | `layerName`: moorland<br>`tolerancePercent`: 10<br>`maximumIntersectionPercent`: 0 | —                                          |
| `sssi-consent-required`                                      | Is the site of special scientific interest?                           | `layerName`: sssi<br>`tolerancePercent`: 1                                         | A consent is required from Natural England |
| `hefer-consent-required`                                     | Does the site require a Historic Environment Farm Environment Record? | `layerName`: historic_features<br>`tolerancePercent`: 0                            | A hefer is needed from Historic England    |

### Example output

> ⚠️ Example output unavailable for 1.0.0: failed to publish config: Timed out waiting for actions_config row code=CLIG3_26 version=1.0.0

<details><summary>Raw config JSON</summary>

```json
{
  "code": "CLIG3_26",
  "description": "Manage grassland with very low nutrient inputs",
  "payment": {
    "ratePerUnitGbp": 151
  },
  "rules": [
    {
      "name": "applied-for-total-available-area",
      "description": "Has the total available area been applied for?"
    },
    {
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer",
      "config": {
        "layerName": "moorland",
        "tolerancePercent": 10,
        "maximumIntersectionPercent": 0
      },
      "description": "The parcel should not be on the moorland"
    },
    {
      "name": "sssi-consent-required",
      "config": {
        "layerName": "sssi",
        "tolerancePercent": 1,
        "caveatDescription": "A consent is required from Natural England"
      },
      "description": "Is the site of special scientific interest?"
    },
    {
      "name": "hefer-consent-required",
      "config": {
        "layerName": "historic_features",
        "tolerancePercent": 0,
        "caveatDescription": "A hefer is needed from Historic England"
      },
      "description": "Does the site require a Historic Environment Farm Environment Record?"
    }
  ],
  "applicationUnitOfMeasurement": "ha",
  "durationYears": 3,
  "startDate": "2025-01-01",
  "semanticVersion": "1.0.0",
  "displayOrder": 0,
  "paymentMethod": {
    "name": "default-calculation",
    "config": {
      "ratePerUnitGbp": 151
    },
    "version": "1.0.0"
  },
  "enabled": true,
  "display": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/clig3-manage-grassland-with-very-low-nutrient-inputs",
  "availability": {
    "type": "total"
  }
}
```

</details>
