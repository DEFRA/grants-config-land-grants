# CNUM2 — Legumes on improved grassland

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/cnum2-legumes-on-improved-grassland)

Configured in `configurations/land-grants/actions/CNUM2/`. 2 version(s) documented, newest first.

## Version 1.0.1

### Configuration

| Field                   | Value                         |
| ----------------------- | ----------------------------- |
| Code                    | CNUM2                         |
| Description             | Legumes on improved grassland |
| Semantic version        | 1.0.1                         |
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

The parcel `SD6743-8083` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£102.00** (10200 pence) for 1 unit.

```json
{
  "code": "CNUM2",
  "version": "1.0.1",
  "annualPaymentPence": 10200
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **passed**.

- `parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland` — passed
  - Reason: This parcel is within the maximum allowed intersection with the moorland layer
  - moorland check: This parcel has a 0% intersection with the moorland layer. The target is 10%.

- `applied-for-total-or-partial-available-area` — passed
  - Reason: The applied figure (1 ha) is within the allowed range (greater than 0 ha and up to 4.5341 ha)
  - Total or partial available area: The available area is (4.5341 ha), and the applicant applied for (1 ha).

- `sssi-consent-required` — passed
  - Reason: No consent is required from Natural England
  - sssi check: This parcel has a 0% intersection with the sssi layer. The tolerance is 1%.

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "CNUM2",
  "sheetId": "SD6743",
  "parcelId": "8083",
  "hasPassed": true,
  "rules": [
    {
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland",
      "passed": true,
      "reason": "This parcel is within the maximum allowed intersection with the moorland layer",
      "description": "The parcel should not be on the moorland",
      "explanations": [
        {
          "title": "moorland check",
          "lines": [
            "This parcel has a 0% intersection with the moorland layer. The target is 10%."
          ]
        }
      ]
    },
    {
      "name": "applied-for-total-or-partial-available-area",
      "passed": true,
      "reason": "The applied figure (1 ha) is within the allowed range (greater than 0 ha and up to 4.5341 ha)",
      "description": "Has the total or partial available area been applied for?",
      "explanations": [
        {
          "title": "Total or partial available area",
          "lines": [
            "The available area is (4.5341 ha), and the applicant applied for (1 ha)."
          ]
        }
      ]
    },
    {
      "name": "sssi-consent-required",
      "passed": true,
      "reason": "No consent is required from Natural England",
      "description": "Is the site of special scientific interest?",
      "explanations": [
        {
          "title": "sssi check",
          "lines": [
            "This parcel has a 0% intersection with the sssi layer. The tolerance is 1%."
          ]
        }
      ]
    }
  ],
  "version": "1.0.1"
}
```

</details>

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "ha",
  "availability": {
    "type": "partial"
  },
  "code": "CNUM2",
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
  "semanticVersion": "1.0.1",
  "startDate": "2026-10-18"
}
```

</details>

## Version 1.0.0

### Configuration

| Field                   | Value                         |
| ----------------------- | ----------------------------- |
| Code                    | CNUM2                         |
| Description             | Legumes on improved grassland |
| Semantic version        | 1.0.0                         |
| Enabled                 | Yes                           |
| Displayed to applicants | Yes                           |
| Unit of measurement     | ha                            |
| Duration (years)        | 3                             |
| Start date              | 2026-10-18                    |
| Display order           | 0                             |
| Group ID                | —                             |
| Availability            | —                             |
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

The parcel `SD6743-8083` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£102.00** (10200 pence) for 1 unit.

```json
{
  "code": "CNUM2",
  "version": "1.0.0",
  "annualPaymentPence": 10200
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **passed**.

- `parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland` — passed
  - Reason: This parcel is within the maximum allowed intersection with the moorland layer
  - moorland check: This parcel has a 0% intersection with the moorland layer. The target is 10%.

- `applied-for-total-or-partial-available-area` — passed
  - Reason: The applied figure (1 ha) is within the allowed range (greater than 0 ha and up to 4.5341 ha)
  - Total or partial available area: The available area is (4.5341 ha), and the applicant applied for (1 ha).

- `sssi-consent-required` — passed
  - Reason: No consent is required from Natural England
  - sssi check: This parcel has a 0% intersection with the sssi layer. The tolerance is 1%.

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "CNUM2",
  "sheetId": "SD6743",
  "parcelId": "8083",
  "hasPassed": true,
  "rules": [
    {
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland",
      "passed": true,
      "reason": "This parcel is within the maximum allowed intersection with the moorland layer",
      "description": "The parcel should not be on the moorland",
      "explanations": [
        {
          "title": "moorland check",
          "lines": [
            "This parcel has a 0% intersection with the moorland layer. The target is 10%."
          ]
        }
      ]
    },
    {
      "name": "applied-for-total-or-partial-available-area",
      "passed": true,
      "reason": "The applied figure (1 ha) is within the allowed range (greater than 0 ha and up to 4.5341 ha)",
      "description": "Has the total or partial available area been applied for?",
      "explanations": [
        {
          "title": "Total or partial available area",
          "lines": [
            "The available area is (4.5341 ha), and the applicant applied for (1 ha)."
          ]
        }
      ]
    },
    {
      "name": "sssi-consent-required",
      "passed": true,
      "reason": "No consent is required from Natural England",
      "description": "Is the site of special scientific interest?",
      "explanations": [
        {
          "title": "sssi check",
          "lines": [
            "This parcel has a 0% intersection with the sssi layer. The tolerance is 1%."
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
  "applicationUnitOfMeasurement": "ha",
  "code": "CNUM2",
  "description": "Legumes on improved grassland",
  "display": true,
  "displayOrder": 0,
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
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
