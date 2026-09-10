# UPL8 — Shepherding livestock on moorland (remove stock for at least 4 months)

Configured in `configurations/land-grants/actions/UPL8/`. 1 version(s) documented, newest first.

## Version 1.0.0

### Configuration

| Field                   | Value                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| Code                    | UPL8                                                                   |
| Description             | Shepherding livestock on moorland (remove stock for at least 4 months) |
| Semantic version        | 1.0.0                                                                  |
| Enabled                 | Yes                                                                    |
| Displayed to applicants | Yes                                                                    |
| Unit of measurement     | ha                                                                     |
| Duration (years)        | 1                                                                      |
| Start date              | 2025-01-01                                                             |
| Display order           | 5                                                                      |
| Group ID                | 3                                                                      |
| Availability            | —                                                                      |
| Payment                 | £74 per ha                                                             |
| Payment method          | default-calculation                                                    |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                      | Description                                                           | Configuration                                                                      | Caveat message                             |
| ----------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `parcel-has-intersection-with-data-layer` | Is this parcel on the moorland?                                       | `layerName`: moorland<br>`tolerancePercent`: 1<br>`minimumIntersectionPercent`: 50 | —                                          |
| `applied-for-total-available-area`        | Has the total available area been applied for?                        | —                                                                                  | —                                          |
| `sssi-consent-required`                   | Is the site of special scientific interest?                           | `layerName`: sssi<br>`tolerancePercent`: 1                                         | A consent is required from Natural England |
| `hefer-consent-required`                  | Does the site require a Historic Environment Farm Environment Record? | `layerName`: historic_features<br>`tolerancePercent`: 0                            | A hefer is needed from Historic England    |

### Example output

The parcel `SD5649-9215` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£74.00** (7400 pence) for 1 unit.

```json
{
  "code": "UPL8",
  "version": "1.0.0",
  "annualPaymentPence": 7400
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **not passed**.

- `parcel-has-intersection-with-data-layer-moorland` — passed
  - Reason: This parcel is majority on the moorland
  - moorland check: This parcel has a 100% intersection with the moorland layer. The target is 49%.

- `applied-for-total-available-area` — failed
  - Reason: There is not sufficient available area (762.9068 ha) for the applied figure (1 ha)
  - Total valid land cover: The available area was (762.9068 ha) the applicant applied for (1 ha)

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
  "actionCode": "UPL8",
  "sheetId": "SD5649",
  "parcelId": "9215",
  "hasPassed": false,
  "rules": [
    {
      "name": "parcel-has-intersection-with-data-layer-moorland",
      "passed": true,
      "reason": "This parcel is majority on the moorland",
      "description": "Is this parcel on the moorland?",
      "explanations": [
        {
          "title": "moorland check",
          "lines": [
            "This parcel has a 100% intersection with the moorland layer. The target is 49%."
          ]
        }
      ]
    },
    {
      "name": "applied-for-total-available-area",
      "passed": false,
      "reason": "There is not sufficient available area (762.9068 ha) for the applied figure (1 ha)",
      "description": "Has the total available area been applied for?",
      "explanations": [
        {
          "title": "Total valid land cover",
          "lines": [
            "The available area was (762.9068 ha) the applicant applied for (1 ha)"
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
          "actionCode": "UPL8",
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
  "code": "UPL8",
  "description": "Shepherding livestock on moorland (remove stock for at least 4 months)",
  "payment": {
    "ratePerUnitGbp": 74
  },
  "rules": [
    {
      "name": "parcel-has-intersection-with-data-layer",
      "config": {
        "layerName": "moorland",
        "tolerancePercent": 1,
        "minimumIntersectionPercent": 50
      },
      "description": "Is this parcel on the moorland?"
    },
    {
      "name": "applied-for-total-available-area",
      "description": "Has the total available area been applied for?"
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
  "durationYears": 1,
  "startDate": "2025-01-01",
  "semanticVersion": "1.0.0",
  "displayOrder": 5,
  "paymentMethod": {
    "name": "default-calculation",
    "config": {
      "ratePerUnitGbp": 74
    },
    "version": "1.0.0"
  },
  "enabled": true,
  "display": true,
  "groupId": 3
}
```

</details>
