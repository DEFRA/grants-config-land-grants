# HEF1 — Maintain weatherproof traditional farm or forestry buildings

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/hef1-maintain-weatherproof-traditional-farm-or-forestry-buildings)

Configured in `configurations/land-grants/actions/HEF1/`. 2 version(s) documented, newest first.

## Version 1.1.0

### Configuration

| Field                   | Value                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Code                    | HEF1                                                         |
| Description             | Maintain weatherproof traditional farm or forestry buildings |
| Semantic version        | 1.1.0                                                        |
| Enabled                 | Yes                                                          |
| Displayed to applicants | Yes                                                          |
| Unit of measurement     | sqm                                                          |
| Duration (years)        | 3                                                            |
| Start date              | 2026-10-18                                                   |
| Display order           | 0                                                            |
| Group ID                | —                                                            |
| Availability            | —                                                            |
| Payment                 | £5 per sqm                                                   |
| Payment method          | default-calculation                                          |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                   | Description                                                           | Configuration                                           | Caveat message                          |
| ------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------- |
| `hefer-consent-required`                               | Does the site require a Historic Environment Farm Environment Record? | `layerName`: historic_features<br>`tolerancePercent`: 0 | A hefer is needed from Historic England |
| `building-check-required<br>(`manual-check-required`)` | Check that buildings on the land meet the action criteria             | —                                                       | A manual building check is required     |

### Example output

The parcel `SD5649-9215` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£5.00** (500 pence) for 1 unit.

```json
{
  "code": "HEF1",
  "version": "1.1.0",
  "annualPaymentPence": 500
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **passed**.

- `hefer-consent-required` — passed
  - Reason: No hefer is needed from Historic England
  - historic_features check: This parcel has a 0% intersection with the historic_features layer. The tolerance is 0%.

- `building-check-required` — passed
  - Reason: A manual building check is required
  - Manual check required: A manual building check is required
  - Caveat: A manual building check is required (`building-check-required`)

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "HEF1",
  "sheetId": "SD5649",
  "parcelId": "9215",
  "hasPassed": true,
  "rules": [
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
    },
    {
      "name": "building-check-required",
      "passed": true,
      "reason": "A manual building check is required",
      "description": "Check that buildings on the land meet the action criteria",
      "explanations": [
        {
          "title": "Manual check required",
          "lines": ["A manual building check is required"]
        }
      ],
      "caveat": {
        "code": "building-check-required",
        "description": "A manual building check is required",
        "metadata": {
          "actionCode": "HEF1",
          "parcelId": "9215",
          "sheetId": "SD5649"
        }
      }
    }
  ],
  "version": "1.1.0"
}
```

</details>

<details><summary>Raw config JSON</summary>

```json
{
  "code": "HEF1",
  "description": "Maintain weatherproof traditional farm or forestry buildings",
  "payment": {
    "ratePerUnitGbp": 5
  },
  "rules": [
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
        "caveatDescription": "A manual building check is required"
      },
      "description": "Check that buildings on the land meet the action criteria",
      "name": "building-check-required",
      "type": "manual-check-required"
    }
  ],
  "applicationUnitOfMeasurement": "sqm",
  "durationYears": 3,
  "startDate": "2026-10-18",
  "semanticVersion": "1.1.0",
  "displayOrder": 0,
  "paymentMethod": {
    "name": "default-calculation",
    "config": {
      "ratePerUnitGbp": 5
    },
    "version": "1.0.0"
  },
  "enabled": true,
  "display": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/hef1-maintain-weatherproof-traditional-farm-or-forestry-buildings"
}
```

</details>

## Version 1.0.0

### Configuration

| Field                   | Value                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Code                    | HEF1                                                         |
| Description             | Maintain weatherproof traditional farm or forestry buildings |
| Semantic version        | 1.0.0                                                        |
| Enabled                 | Yes                                                          |
| Displayed to applicants | Yes                                                          |
| Unit of measurement     | sqm                                                          |
| Duration (years)        | 3                                                            |
| Start date              | 2026-10-18                                                   |
| Display order           | 0                                                            |
| Group ID                | —                                                            |
| Availability            | —                                                            |
| Payment                 | £5 per sqm                                                   |
| Payment method          | default-calculation                                          |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                     | Description                                                           | Configuration                                           | Caveat message                          |
| ------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------- |
| `hefer-consent-required` | Does the site require a Historic Environment Farm Environment Record? | `layerName`: historic_features<br>`tolerancePercent`: 0 | A hefer is needed from Historic England |

### Example output

The parcel `SD5649-9215` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£5.00** (500 pence) for 1 unit.

```json
{
  "code": "HEF1",
  "version": "1.0.0",
  "annualPaymentPence": 500
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **passed**.

- `hefer-consent-required` — passed
  - Reason: No hefer is needed from Historic England
  - historic_features check: This parcel has a 0% intersection with the historic_features layer. The tolerance is 0%.

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "HEF1",
  "sheetId": "SD5649",
  "parcelId": "9215",
  "hasPassed": true,
  "rules": [
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
  "code": "HEF1",
  "description": "Maintain weatherproof traditional farm or forestry buildings",
  "payment": {
    "ratePerUnitGbp": 5
  },
  "rules": [
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
  "applicationUnitOfMeasurement": "sqm",
  "durationYears": 3,
  "startDate": "2026-10-18",
  "semanticVersion": "1.0.0",
  "displayOrder": 0,
  "paymentMethod": {
    "name": "default-calculation",
    "config": {
      "ratePerUnitGbp": 5
    },
    "version": "1.0.0"
  },
  "enabled": true,
  "display": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/hef1-maintain-weatherproof-traditional-farm-or-forestry-buildings"
}
```

</details>
