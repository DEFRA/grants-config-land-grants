# BND1 — Maintain dry stone walls

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/bnd1-maintain-dry-stone-walls)

Configured in `configurations/land-grants/actions_config/BND1/`. 1 version(s) documented, newest first.

## Version 1.0.0

### Configuration

| Field                   | Value                    |
| ----------------------- | ------------------------ |
| Code                    | BND1                     |
| Description             | Maintain dry stone walls |
| Semantic version        | 1.0.0                    |
| Enabled                 | Yes                      |
| Displayed to applicants | No                       |
| Unit of measurement     | m                        |
| Duration (years)        | 3                        |
| Start date              | 2026-10-18               |
| Display order           | 0                        |
| Group ID                | —                        |
| Availability            | partial                  |
| Payment                 | £0.27 per m              |
| Payment method          | default-calculation      |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                                   | Description                                                                    | Configuration                                                                                  | Caveat message                             |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `minimum-length`                                                       | Is the applied for length at least 20 m and no more than the available length? | `minimumLengthM`: 20                                                                           | —                                          |
| `sssi-consent-required<br>(`boundary-intersection-consent-required`)`  | Does the parcel boundary intersect a site of special scientific interest?      | `caveatCode`: ne-consent-required<br>`layerName`: sssi<br>`toleranceMeters`: 0                 | A consent is required from Natural England |
| `hefer-consent-required<br>(`boundary-intersection-consent-required`)` | Does the parcel boundary intersect a historic or archaeological feature?       | `caveatCode`: hefer-consent-required<br>`layerName`: historic_features<br>`toleranceMeters`: 0 | A HEFER is needed from Historic England    |

### Example output

The parcel `SD6855-7704` was used to capture the responses below.

**Payment** — `POST /api/v2/payments/calculate`

Annual payment: **£0.27** (27 pence) for 1 unit.

```json
{
  "code": "BND1",
  "version": "1.0.0",
  "annualPaymentPence": 27
}
```

**Eligibility & explanations** — `POST /api/v2/application/validate`

Overall result: **not passed**.

- `minimum-length` — failed
  - Reason: The length must be at least 20 m
  - Minimum length: The minimum allowable length is (20 m), the available length was (undefined m) and the applicant applied for (1 m)

- `sssi-consent-required` — failed
  - Reason: A boundary intersection with the sssi layer was not provided in the application data
  - sssi boundary check:

- `hefer-consent-required` — failed
  - Reason: A boundary intersection with the historic_features layer was not provided in the application data
  - historic_features boundary check:

<details><summary>Full <code>application/validate</code> action result</summary>

```json
{
  "actionCode": "BND1",
  "sheetId": "SD6855",
  "parcelId": "7704",
  "hasPassed": false,
  "rules": [
    {
      "name": "minimum-length",
      "passed": false,
      "reason": "The length must be at least 20 m",
      "description": "Is the applied for length at least 20 m and no more than the available length?",
      "explanations": [
        {
          "title": "Minimum length",
          "lines": [
            "The minimum allowable length is (20 m), the available length was (undefined m) and the applicant applied for (1 m)"
          ]
        }
      ]
    },
    {
      "name": "sssi-consent-required",
      "passed": false,
      "reason": "A boundary intersection with the sssi layer was not provided in the application data",
      "description": "Does the parcel boundary intersect a site of special scientific interest?",
      "explanations": [
        {
          "title": "sssi boundary check",
          "lines": []
        }
      ]
    },
    {
      "name": "hefer-consent-required",
      "passed": false,
      "reason": "A boundary intersection with the historic_features layer was not provided in the application data",
      "description": "Does the parcel boundary intersect a historic or archaeological feature?",
      "explanations": [
        {
          "title": "historic_features boundary check",
          "lines": []
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
  "applicationUnitOfMeasurement": "m",
  "code": "BND1",
  "description": "Maintain dry stone walls",
  "display": false,
  "displayOrder": 0,
  "displayUnit": "metre",
  "displayUnitPlural": "metres",
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "availability": {
    "type": "partial"
  },
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/bnd1-maintain-dry-stone-walls",
  "payment": {
    "ratePerUnitGbp": 0.27
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 0.27
    },
    "name": "default-calculation",
    "version": "1.0.0"
  },
  "rules": [
    {
      "config": {
        "minimumLengthM": 20
      },
      "description": "Is the applied for length at least 20 m and no more than the available length?",
      "name": "minimum-length"
    },
    {
      "config": {
        "caveatCode": "ne-consent-required",
        "caveatDescription": "A consent is required from Natural England",
        "layerName": "sssi",
        "toleranceMeters": 0
      },
      "description": "Does the parcel boundary intersect a site of special scientific interest?",
      "name": "sssi-consent-required",
      "type": "boundary-intersection-consent-required"
    },
    {
      "config": {
        "caveatCode": "hefer-consent-required",
        "caveatDescription": "A HEFER is needed from Historic England",
        "layerName": "historic_features",
        "toleranceMeters": 0
      },
      "description": "Does the parcel boundary intersect a historic or archaeological feature?",
      "name": "hefer-consent-required",
      "type": "boundary-intersection-consent-required"
    }
  ],
  "semanticVersion": "1.0.0",
  "startDate": "2026-10-18"
}
```

</details>
