# SCR2 — Manage scrub and open habitat mosaics

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/scr2-manage-scrub-and-open-habitat-mosaics)

Configured in `configurations/land-grants/actions/SCR2/`. 2 version(s) documented, newest first.

## Version 1.1.0

### Configuration

| Field                   | Value                                 |
| ----------------------- | ------------------------------------- |
| Code                    | SCR2                                  |
| Description             | Manage scrub and open habitat mosaics |
| Semantic version        | 1.1.0                                 |
| Enabled                 | Yes                                   |
| Displayed to applicants | Yes                                   |
| Unit of measurement     | ha                                    |
| Duration (years)        | 3                                     |
| Start date              | 2026-10-18                            |
| Display order           | 0                                     |
| Group ID                | —                                     |
| Availability            | partial                               |
| Payment                 | £350 per ha                           |
| Payment method          | default-calculation                   |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                         | Description                                               | Configuration                                                                      | Caveat message |
| ------------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                  | `layerName`: moorland<br>`maximumIntersectionPercent`: 0<br>`tolerancePercent`: 10 | —              |
| `applied-for-total-or-partial-available-area`                | Has the total or partial available area been applied for? | —                                                                                  | —              |

### Example output

The parcel `SD6743-8083` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£350.00** (35000 pence) for 1 unit.

```json
{
  "code": "SCR2",
  "version": "1.1.0",
  "annualPaymentPence": 35000
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

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "SCR2",
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
    }
  ],
  "version": "1.1.0"
}
```

</details>

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "ha",
  "code": "SCR2",
  "description": "Manage scrub and open habitat mosaics",
  "display": true,
  "displayOrder": 0,
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "payment": {
    "ratePerUnitGbp": 350
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 350
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
    }
  ],
  "semanticVersion": "1.1.0",
  "startDate": "2026-10-18",
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/scr2-manage-scrub-and-open-habitat-mosaics",
  "availability": {
    "type": "partial"
  }
}
```

</details>

## Version 1.0.1

### Configuration

| Field                   | Value                                 |
| ----------------------- | ------------------------------------- |
| Code                    | SCR2                                  |
| Description             | Manage scrub and open habitat mosaics |
| Semantic version        | 1.0.1                                 |
| Enabled                 | Yes                                   |
| Displayed to applicants | Yes                                   |
| Unit of measurement     | ha                                    |
| Duration (years)        | 3                                     |
| Start date              | 2026-10-18                            |
| Display order           | 0                                     |
| Group ID                | —                                     |
| Availability            | —                                     |
| Payment                 | £350 per ha                           |
| Payment method          | default-calculation                   |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                         | Description                                               | Configuration                                                                      | Caveat message |
| ------------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                  | `layerName`: moorland<br>`maximumIntersectionPercent`: 0<br>`tolerancePercent`: 10 | —              |
| `applied-for-total-or-partial-available-area`                | Has the total or partial available area been applied for? | —                                                                                  | —              |

### Example output

The parcel `SD6743-8083` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£350.00** (35000 pence) for 1 unit.

```json
{
  "code": "SCR2",
  "version": "1.0.1",
  "annualPaymentPence": 35000
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

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "SCR2",
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
  "code": "SCR2",
  "description": "Manage scrub and open habitat mosaics",
  "display": true,
  "displayOrder": 0,
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "payment": {
    "ratePerUnitGbp": 350
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 350
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
    }
  ],
  "semanticVersion": "1.0.1",
  "startDate": "2026-10-18"
}
```

</details>
