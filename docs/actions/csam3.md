# CSAM3 — Herbal leys

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/csam3-herbal-leys)

Configured in `configurations/land-grants/actions/CSAM3/`. 3 version(s) documented, newest first.

## Version 1.2.0

### Configuration

| Field                   | Value               |
| ----------------------- | ------------------- |
| Code                    | CSAM3               |
| Description             | Herbal leys         |
| Semantic version        | 1.2.0               |
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
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                  | `layerName`: moorland<br>`tolerancePercent`: 10<br>`maximumIntersectionPercent`: 0 | —              |

### Example output

The parcel `SD6743-8083` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£224.00** (22400 pence) for 1 unit.

```json
{
  "code": "CSAM3",
  "version": "1.2.0",
  "annualPaymentPence": 22400
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **passed**.

- `applied-for-total-or-partial-available-area` — passed
  - Reason: The applied figure (1 ha) is within the allowed range (greater than 0 ha and up to 4.5341 ha)
  - Total or partial available area: The available area is (4.5341 ha), and the applicant applied for (1 ha).

- `parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland` — passed
  - Reason: This parcel is within the maximum allowed intersection with the moorland layer
  - moorland check: This parcel has a 0% intersection with the moorland layer. The target is 10%.

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "CSAM3",
  "sheetId": "SD6743",
  "parcelId": "8083",
  "hasPassed": true,
  "rules": [
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
    }
  ],
  "version": "1.2.0"
}
```

</details>

<details><summary>Raw config JSON</summary>

```json
{
  "code": "CSAM3",
  "description": "Herbal leys",
  "payment": {
    "ratePerUnitGbp": 224
  },
  "rules": [
    {
      "name": "applied-for-total-or-partial-available-area",
      "description": "Has the total or partial available area been applied for?"
    },
    {
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer",
      "config": {
        "layerName": "moorland",
        "tolerancePercent": 10,
        "maximumIntersectionPercent": 0
      },
      "description": "The parcel should not be on the moorland"
    }
  ],
  "applicationUnitOfMeasurement": "ha",
  "durationYears": 3,
  "startDate": "2025-01-01",
  "semanticVersion": "1.2.0",
  "displayOrder": 0,
  "paymentMethod": {
    "name": "default-calculation",
    "config": {
      "ratePerUnitGbp": 224
    },
    "version": "1.0.0"
  },
  "enabled": true,
  "display": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/csam3-herbal-leys",
  "availability": {
    "type": "partial"
  }
}
```

</details>

## Version 1.1.0

### Configuration

| Field                   | Value               |
| ----------------------- | ------------------- |
| Code                    | CSAM3               |
| Description             | Herbal leys         |
| Semantic version        | 1.1.0               |
| Enabled                 | Yes                 |
| Displayed to applicants | Yes                 |
| Unit of measurement     | ha                  |
| Duration (years)        | 1                   |
| Start date              | 2025-01-01          |
| Display order           | 8                   |
| Group ID                | 4                   |
| Availability            | —                   |
| Payment                 | £224 per ha         |
| Payment method          | default-calculation |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                         | Description                                               | Configuration                                                                      | Caveat message |
| ------------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| `applied-for-total-or-partial-available-area`                | Has the total or partial available area been applied for? | —                                                                                  | —              |
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                  | `layerName`: moorland<br>`tolerancePercent`: 10<br>`maximumIntersectionPercent`: 0 | —              |

### Example output

The parcel `SD6743-8083` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£224.00** (22400 pence) for 1 unit.

```json
{
  "code": "CSAM3",
  "version": "1.1.0",
  "annualPaymentPence": 22400
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **passed**.

- `applied-for-total-or-partial-available-area` — passed
  - Reason: The applied figure (1 ha) is within the allowed range (greater than 0 ha and up to 4.5341 ha)
  - Total or partial available area: The available area is (4.5341 ha), and the applicant applied for (1 ha).

- `parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland` — passed
  - Reason: This parcel is within the maximum allowed intersection with the moorland layer
  - moorland check: This parcel has a 0% intersection with the moorland layer. The target is 10%.

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "CSAM3",
  "sheetId": "SD6743",
  "parcelId": "8083",
  "hasPassed": true,
  "rules": [
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
    }
  ],
  "version": "1.1.0"
}
```

</details>

<details><summary>Raw config JSON</summary>

```json
{
  "code": "CSAM3",
  "description": "Herbal leys",
  "payment": {
    "ratePerUnitGbp": 224
  },
  "rules": [
    {
      "name": "applied-for-total-or-partial-available-area",
      "description": "Has the total or partial available area been applied for?"
    },
    {
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer",
      "config": {
        "layerName": "moorland",
        "tolerancePercent": 10,
        "maximumIntersectionPercent": 0
      },
      "description": "The parcel should not be on the moorland"
    }
  ],
  "applicationUnitOfMeasurement": "ha",
  "durationYears": 1,
  "startDate": "2025-01-01",
  "semanticVersion": "1.1.0",
  "displayOrder": 8,
  "paymentMethod": {
    "name": "default-calculation",
    "config": {
      "ratePerUnitGbp": 224
    },
    "version": "1.0.0"
  },
  "enabled": true,
  "display": true,
  "groupId": 4
}
```

</details>

## Version 1.0.0

### Configuration

| Field                   | Value               |
| ----------------------- | ------------------- |
| Code                    | CSAM3               |
| Description             | Herbal leys         |
| Semantic version        | 1.0.0               |
| Enabled                 | Yes                 |
| Displayed to applicants | Yes                 |
| Unit of measurement     | ha                  |
| Duration (years)        | 1                   |
| Start date              | 2025-01-01          |
| Display order           | 8                   |
| Group ID                | 4                   |
| Availability            | —                   |
| Payment                 | £224 per ha         |
| Payment method          | default-calculation |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                         | Description                                               | Configuration                                                                      | Caveat message |
| ------------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| `applied-for-total-or-partial-available-area`                | Has the total or partial available area been applied for? | —                                                                                  | —              |
| `parcel-intersection-does-not-exceed-maximum-for-data-layer` | The parcel should not be on the moorland                  | `layerName`: moorland<br>`tolerancePercent`: 10<br>`maximumIntersectionPercent`: 0 | —              |

### Example output

The parcel `SD6743-8083` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£224.00** (22400 pence) for 1 unit.

```json
{
  "code": "CSAM3",
  "version": "1.0.0",
  "annualPaymentPence": 22400
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **passed**.

- `applied-for-total-or-partial-available-area` — passed
  - Reason: The applied figure (1 ha) is within the allowed range (greater than 0 ha and up to 4.5341 ha)
  - Total or partial available area: The available area is (4.5341 ha), and the applicant applied for (1 ha).

- `parcel-intersection-does-not-exceed-maximum-for-data-layer-moorland` — passed
  - Reason: This parcel is within the maximum allowed intersection with the moorland layer
  - moorland check: This parcel has a 0% intersection with the moorland layer. The target is 10%.

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "CSAM3",
  "sheetId": "SD6743",
  "parcelId": "8083",
  "hasPassed": true,
  "rules": [
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
    }
  ],
  "version": "1.0.0"
}
```

</details>

<details><summary>Raw config JSON</summary>

```json
{
  "code": "CSAM3",
  "description": "Herbal leys",
  "payment": {
    "ratePerUnitGbp": 224
  },
  "rules": [
    {
      "name": "applied-for-total-or-partial-available-area",
      "description": "Has the total or partial available area been applied for?"
    },
    {
      "name": "parcel-intersection-does-not-exceed-maximum-for-data-layer",
      "config": {
        "layerName": "moorland",
        "tolerancePercent": 10,
        "maximumIntersectionPercent": 0
      },
      "description": "The parcel should not be on the moorland"
    }
  ],
  "applicationUnitOfMeasurement": "ha",
  "durationYears": 1,
  "startDate": "2025-01-01",
  "semanticVersion": "1.0.0",
  "displayOrder": 8,
  "paymentMethod": {
    "name": "default-calculation",
    "config": {
      "ratePerUnitGbp": 224
    },
    "version": "1.0.0"
  },
  "enabled": true,
  "display": true,
  "groupId": 4
}
```

</details>
