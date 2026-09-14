# WBD1 — Manage ponds

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/wbd1-manage-ponds)

Configured in `configurations/land-grants/actions/WBD1/`. 1 version(s) documented, newest first.

## Version 1.0.0

### Configuration

| Field                   | Value               |
| ----------------------- | ------------------- |
| Code                    | WBD1                |
| Description             | Manage ponds        |
| Semantic version        | 1.0.0               |
| Enabled                 | Yes                 |
| Displayed to applicants | Yes                 |
| Unit of measurement     | count               |
| Duration (years)        | 3                   |
| Start date              | 2026-10-18          |
| Display order           | 0                   |
| Group ID                | —                   |
| Availability            | —                   |
| Payment                 | £257 per count      |
| Payment method          | default-calculation |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                               | Description                                                           | Configuration                                           | Caveat message                          |
| -------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------- |
| `hefer-consent-required`                           | Does the site require a Historic Environment Farm Environment Record? | `layerName`: historic_features<br>`tolerancePercent`: 0 | A hefer is needed from Historic England |
| `pond-check-required<br>(`manual-check-required`)` | Check that ponds on the land meet the action criteria                 | —                                                       | A manual pond check is required         |

### Example output

The parcel `SD5649-9215` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£257.00** (25700 pence) for 1 unit.

```json
{
  "code": "WBD1",
  "version": "1.0.0",
  "annualPaymentPence": 25700
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **passed**.

- `hefer-consent-required` — passed
  - Reason: No hefer is needed from Historic England
  - historic_features check: This parcel has a 0% intersection with the historic_features layer. The tolerance is 0%.

- `pond-check-required` — passed
  - Reason: A manual pond check is required
  - Manual check required: A manual pond check is required
  - Caveat: A manual pond check is required (`pond-check-required`)

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "WBD1",
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
      "name": "pond-check-required",
      "passed": true,
      "reason": "A manual pond check is required",
      "description": "Check that ponds on the land meet the action criteria",
      "explanations": [
        {
          "title": "Manual check required",
          "lines": ["A manual pond check is required"]
        }
      ],
      "caveat": {
        "code": "pond-check-required",
        "description": "A manual pond check is required",
        "metadata": {
          "actionCode": "WBD1",
          "parcelId": "9215",
          "sheetId": "SD5649"
        }
      }
    }
  ],
  "version": "1.0.0"
}
```

</details>

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "count",
  "code": "WBD1",
  "description": "Manage ponds",
  "display": true,
  "displayOrder": 0,
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/wbd1-manage-ponds",
  "payment": {
    "ratePerUnitGbp": 257
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 257
    },
    "name": "default-calculation",
    "version": "1.0.0"
  },
  "rules": [
    {
      "config": {
        "caveatDescription": "A hefer is needed from Historic England",
        "layerName": "historic_features",
        "tolerancePercent": 0
      },
      "description": "Does the site require a Historic Environment Farm Environment Record?",
      "name": "hefer-consent-required"
    },
    {
      "config": {
        "caveatDescription": "A manual pond check is required"
      },
      "description": "Check that ponds on the land meet the action criteria",
      "name": "pond-check-required",
      "type": "manual-check-required"
    }
  ],
  "semanticVersion": "1.0.0",
  "startDate": "2026-10-18"
}
```

</details>
