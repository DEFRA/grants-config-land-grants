# PA3 — Woodland management plan

Configured in `configurations/land-grants/actions/PA3/`. 2 version(s) documented, newest first.

## Version 1.1.0

### Configuration

| Field                   | Value                    |
| ----------------------- | ------------------------ |
| Code                    | PA3                      |
| Description             | Woodland management plan |
| Semantic version        | 1.1.0                    |
| Enabled                 | Yes                      |
| Displayed to applicants | No                       |
| Unit of measurement     | ha                       |
| Duration (years)        | 3                        |
| Start date              | 2025-01-01               |
| Display order           | 0                        |
| Group ID                | —                        |
| Availability            | —                        |
| Payment                 | Tiered                   |
| Payment method          | wmp-calculation          |

**Payment tiers**

| Lower limit (ha) | Upper limit (ha) | Flat rate (£) | Rate per unit (£) |
| ---------------- | ---------------- | ------------- | ----------------- |
| 0.5              | 50               | 1500          | 0                 |
| 50               | 100              | 1500          | 30                |
| 100              | —                | 3000          | 15                |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                          | Description                                                                  | Configuration                                 | Caveat message |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------- | -------------- |
| `parcel-has-minimum-eligibility-for-woodland-management-plan` | Is the parcel eligible for the woodland management plan action?              | `minimumSize`: 0.5<br>`minOldWoodlandHa`: 0.4 | —              |
| `total-area-not-exceed-land-parcels-woodland-management-plan` | Is the total woodland area less than or equal to the total land parcel area? | —                                             | —              |

### Example output

The parcel `SD5649-9215` was used to capture the responses below.

_No payment example was returned for this parcel._

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **not passed**.

- `parcel-has-minimum-eligibility-for-woodland-management-plan` — failed
  - Reason: No woodland area over 10 years old has been provided
  - Woodland minimum eligibility: The minimum required total woodland area is (0.5 ha), the holding has (0 ha)

- `total-area-not-exceed-land-parcels-woodland-management-plan` — passed
  - Reason: The total woodland area (0 ha) does not exceed the total land parcel area (0 ha)
  - Woodland total area: The total land parcel area is (0 ha), the total woodland area (young + old) is (0 ha)

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "PA3",
  "sheetId": "SD5649",
  "parcelId": "9215",
  "hasPassed": false,
  "rules": [
    {
      "name": "parcel-has-minimum-eligibility-for-woodland-management-plan",
      "passed": false,
      "reason": "No woodland area over 10 years old has been provided",
      "description": "Is the parcel eligible for the woodland management plan action?",
      "explanations": [
        {
          "title": "Woodland minimum eligibility",
          "lines": [
            "The minimum required total woodland area is (0.5 ha), the holding has (0 ha)"
          ]
        }
      ]
    },
    {
      "name": "total-area-not-exceed-land-parcels-woodland-management-plan",
      "passed": true,
      "reason": "The total woodland area (0 ha) does not exceed the total land parcel area (0 ha)",
      "description": "Is the total woodland area less than or equal to the total land parcel area?",
      "explanations": [
        {
          "title": "Woodland total area",
          "lines": [
            "The total land parcel area is (0 ha), the total woodland area (young + old) is (0 ha)"
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
  "code": "PA3",
  "description": "Woodland management plan",
  "enabled": true,
  "display": false,
  "payment": null,
  "rules": [
    {
      "name": "parcel-has-minimum-eligibility-for-woodland-management-plan",
      "config": {
        "minimumSize": 0.5,
        "minOldWoodlandHa": 0.4
      },
      "description": "Is the parcel eligible for the woodland management plan action?"
    },
    {
      "name": "total-area-not-exceed-land-parcels-woodland-management-plan",
      "description": "Is the total woodland area less than or equal to the total land parcel area?"
    }
  ],
  "applicationUnitOfMeasurement": "ha",
  "durationYears": 3,
  "startDate": "2025-01-01",
  "semanticVersion": "1.1.0",
  "displayOrder": 0,
  "paymentMethod": {
    "name": "wmp-calculation",
    "config": {
      "tiers": [
        {
          "flatRateGbp": 1500,
          "lowerLimitHa": 0.5,
          "upperLimitHa": 50,
          "ratePerUnitGbp": 0
        },
        {
          "flatRateGbp": 1500,
          "lowerLimitHa": 50,
          "upperLimitHa": 100,
          "ratePerUnitGbp": 30
        },
        {
          "flatRateGbp": 3000,
          "lowerLimitHa": 100,
          "upperLimitHa": null,
          "ratePerUnitGbp": 15
        }
      ],
      "newWoodlandMaxPercent": 20
    }
  },
  "groupId": null
}
```

</details>

## Version 1.0.0

### Configuration

| Field                   | Value                    |
| ----------------------- | ------------------------ |
| Code                    | PA3                      |
| Description             | Woodland management plan |
| Semantic version        | 1.0.0                    |
| Enabled                 | No                       |
| Displayed to applicants | No                       |
| Unit of measurement     | ha                       |
| Duration (years)        | 10                       |
| Start date              | 2025-01-01               |
| Display order           | 0                        |
| Group ID                | —                        |
| Availability            | —                        |
| Payment                 | Tiered                   |
| Payment method          | wmp-calculation          |

**Payment tiers**

| Lower limit (ha) | Upper limit (ha) | Flat rate (£) | Rate per unit (£) |
| ---------------- | ---------------- | ------------- | ----------------- |
| 0.5              | 50               | 1500          | 0                 |
| 50               | 100              | 1500          | 30                |
| 100              | —                | 3000          | 15                |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                          | Description                                                                  | Configuration                                 | Caveat message |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------- | -------------- |
| `parcel-has-minimum-eligibility-for-woodland-management-plan` | Is the parcel eligible for the woodland management plan action?              | `minimumSize`: 0.5<br>`minOldWoodlandHa`: 0.4 | —              |
| `total-area-not-exceed-land-parcels-woodland-management-plan` | Is the total woodland area less than or equal to the total land parcel area? | —                                             | —              |

### Example output

The parcel `SD5649-9215` was used to capture the responses below.

_No payment example was returned for this parcel._

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **not passed**.

- `parcel-has-minimum-eligibility-for-woodland-management-plan` — failed
  - Reason: No woodland area over 10 years old has been provided
  - Woodland minimum eligibility: The minimum required total woodland area is (0.5 ha), the holding has (0 ha)

- `total-area-not-exceed-land-parcels-woodland-management-plan` — passed
  - Reason: The total woodland area (0 ha) does not exceed the total land parcel area (0 ha)
  - Woodland total area: The total land parcel area is (0 ha), the total woodland area (young + old) is (0 ha)

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "PA3",
  "sheetId": "SD5649",
  "parcelId": "9215",
  "hasPassed": false,
  "rules": [
    {
      "name": "parcel-has-minimum-eligibility-for-woodland-management-plan",
      "passed": false,
      "reason": "No woodland area over 10 years old has been provided",
      "description": "Is the parcel eligible for the woodland management plan action?",
      "explanations": [
        {
          "title": "Woodland minimum eligibility",
          "lines": [
            "The minimum required total woodland area is (0.5 ha), the holding has (0 ha)"
          ]
        }
      ]
    },
    {
      "name": "total-area-not-exceed-land-parcels-woodland-management-plan",
      "passed": true,
      "reason": "The total woodland area (0 ha) does not exceed the total land parcel area (0 ha)",
      "description": "Is the total woodland area less than or equal to the total land parcel area?",
      "explanations": [
        {
          "title": "Woodland total area",
          "lines": [
            "The total land parcel area is (0 ha), the total woodland area (young + old) is (0 ha)"
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
  "code": "PA3",
  "description": "Woodland management plan",
  "enabled": false,
  "display": false,
  "payment": null,
  "rules": [
    {
      "name": "parcel-has-minimum-eligibility-for-woodland-management-plan",
      "config": {
        "minimumSize": 0.5,
        "minOldWoodlandHa": 0.4
      },
      "description": "Is the parcel eligible for the woodland management plan action?"
    },
    {
      "name": "total-area-not-exceed-land-parcels-woodland-management-plan",
      "description": "Is the total woodland area less than or equal to the total land parcel area?"
    }
  ],
  "applicationUnitOfMeasurement": "ha",
  "durationYears": 10,
  "startDate": "2025-01-01",
  "semanticVersion": "1.0.0",
  "displayOrder": 0,
  "paymentMethod": {
    "name": "wmp-calculation",
    "config": {
      "tiers": [
        {
          "flatRateGbp": 1500,
          "lowerLimitHa": 0.5,
          "upperLimitHa": 50,
          "ratePerUnitGbp": 0
        },
        {
          "flatRateGbp": 1500,
          "lowerLimitHa": 50,
          "upperLimitHa": 100,
          "ratePerUnitGbp": 30
        },
        {
          "flatRateGbp": 3000,
          "lowerLimitHa": 100,
          "upperLimitHa": null,
          "ratePerUnitGbp": 15
        }
      ],
      "newWoodlandMaxPercent": 20
    }
  },
  "groupId": null
}
```

</details>
