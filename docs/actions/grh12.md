# GRH12 — Manage rough grassland and upland breeding waders

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/grh12-manage-rough-grassland-for-upland-breeding-waders)

Configured in `configurations/land-grants/actions/GRH12/`. 1 version(s) documented, newest first.

## Version 1.0.0

### Configuration

| Field                   | Value                                             |
| ----------------------- | ------------------------------------------------- |
| Code                    | GRH12                                             |
| Description             | Manage rough grassland and upland breeding waders |
| Semantic version        | 1.0.0                                             |
| Enabled                 | No                                                |
| Displayed to applicants | No                                                |
| Unit of measurement     | ha                                                |
| Duration (years)        | 3                                                 |
| Start date              | 2026-10-18                                        |
| Display order           | 0                                                 |
| Group ID                | —                                                 |
| Availability            | partial                                           |
| Payment                 | £203 per ha                                       |
| Payment method          | default-calculation                               |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                         | Description                                                           | Configuration                                                                      | Caveat message                             |
| ------------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `min-max-parcel-size`                                        | The parcel's total area must be 2 hectares or more                    | `minimumParcelSizeSqm`: 20000                                                      | —                                          |
| `parcel-has-intersection-with-data-layer`                    | Is this parcel on less favoured area?                                 | `layerName`: lfa<br>`tolerancePercent`: 1<br>`minimumIntersectionPercent`: 100     | —                                          |
| `sssi-consent-required`                                      | Is the site of special scientific interest?                           | `layerName`: sssi<br>`tolerancePercent`: 1                                         | A consent is required from Natural England |
| `hefer-consent-required`                                     | Does the site require a Historic Environment Farm Environment Record? | `layerName`: historic_features<br>`tolerancePercent`: 0                            | A hefer is needed from Historic England    |
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                              | `layerName`: moorland<br>`maximumIntersectionPercent`: 0<br>`tolerancePercent`: 10 | —                                          |
| `applied-for-total-or-partial-available-area`                | Has the total or partial available area been applied for?             | —                                                                                  | —                                          |

### Example output

The parcel `SD5649-9215` was used to capture the responses below.

_No payment example was returned for this parcel._

_No validation example was returned for this parcel._

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "ha",
  "code": "GRH12",
  "description": "Manage rough grassland and upland breeding waders",
  "display": false,
  "displayOrder": 0,
  "durationYears": 3,
  "enabled": false,
  "groupId": null,
  "availability": { "type": "partial" },
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/grh12-manage-rough-grassland-for-upland-breeding-waders",
  "payment": {
    "ratePerUnitGbp": 203
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 203
    },
    "name": "default-calculation",
    "version": "1.0.0"
  },
  "rules": [
    {
      "config": {
        "minimumParcelSizeSqm": 20000
      },
      "description": "The parcel's total area must be 2 hectares or more",
      "name": "min-max-parcel-size"
    },
    {
      "config": {
        "layerName": "lfa",
        "tolerancePercent": 1,
        "minimumIntersectionPercent": 100
      },
      "description": "Is this parcel on less favoured area?",
      "name": "parcel-has-intersection-with-data-layer"
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
    },
    {
      "name": "hefer-consent-required",
      "config": {
        "layerName": "historic_features",
        "tolerancePercent": 0,
        "caveatDescription": "A hefer is needed from Historic England"
      },
      "description": "Does the site require a Historic Environment Farm Environment Record?"
    },
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
    }
  ],
  "semanticVersion": "1.0.0",
  "startDate": "2026-10-18"
}
```

</details>
