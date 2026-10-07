# CLIG3_26 — Manage grassland with very low nutrient inputs

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/clig3-manage-grassland-with-very-low-nutrient-inputs)

Configured in `configurations/land-grants/actions/CLIG3_26/`. 1 version(s) documented, newest first.

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

The parcel `SD5649-9215` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£151.00** (15100 pence) for 1 unit.

```json
{
  "code": "CLIG3_26",
  "version": "1.0.0",
  "annualPaymentPence": 15100
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **not passed**.

- `applied-for-total-available-area` — failed
  - Reason: There is not sufficient available area (762.4624 ha) for the applied figure (1 ha)
  - Total valid land cover: The available area was (762.4624 ha) the applicant applied for (1 ha)

- `parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland` — failed
  - Reason: This parcel exceeds the maximum allowed intersection with the moorland layer
  - moorland check: This parcel has a 100% intersection with the moorland layer. The target is 10%.

- `sssi-consent-required` — passed
  - Reason: A consent is required from Natural England
  - sssi check: This parcel has a 99.99% intersection with the sssi layer. The tolerance is 1%.
  - Caveat: A consent is required from Natural England (`ne-consent-required`)

- `hefer-consent-required` — passed
  - Reason: No hefer is needed from Historic England
  - historic_features check: This parcel has a 0% intersection with the historic_features layer. The tolerance is 0%.

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "CLIG3_26",
  "sheetId": "SD5649",
  "parcelId": "9215",
  "hasPassed": false,
  "rules": [
    {
      "name": "applied-for-total-available-area",
      "passed": false,
      "reason": "There is not sufficient available area (762.4624 ha) for the applied figure (1 ha)",
      "description": "Has the total available area been applied for?",
      "explanations": [
        {
          "title": "Total valid land cover",
          "lines": [
            "The available area was (762.4624 ha) the applicant applied for (1 ha)"
          ]
        }
      ]
    },
    {
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland",
      "passed": false,
      "reason": "This parcel exceeds the maximum allowed intersection with the moorland layer",
      "description": "The parcel should not be on the moorland",
      "explanations": [
        {
          "title": "moorland check",
          "lines": [
            "This parcel has a 100% intersection with the moorland layer. The target is 10%."
          ]
        }
      ]
    },
    {
      "name": "sssi-consent-required",
      "passed": true,
      "reason": "A consent is required from Natural England",
      "description": "Is the site of special scientific interest?",
      "explanations": [
        {
          "title": "sssi check",
          "lines": [
            "This parcel has a 99.99% intersection with the sssi layer. The tolerance is 1%."
          ]
        }
      ],
      "caveat": {
        "code": "ne-consent-required",
        "description": "A consent is required from Natural England",
        "metadata": {
          "actionCode": "CLIG3_26",
          "parcelId": "9215",
          "sheetId": "SD5649",
          "percentageOverlap": 99.99,
          "overlapAreaHectares": 764.1672
        }
      }
    },
    {
      "name": "hefer-consent-required",
      "passed": true,
      "reason": "No hefer is needed from Historic England",
      "description": "Does the site require a Historic Environment Farm Environment Record?",
      "explanations": [
        {
          "title": "historic_features check",
          "lines": [
            "This parcel has a 0% intersection with the historic_features layer. The tolerance is 0%."
          ]
        }
      ]
    }
  ],
  "version": "1.0.0"
}
```

</details>

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
