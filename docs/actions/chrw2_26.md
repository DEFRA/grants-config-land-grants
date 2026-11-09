# CHRW2_26 — Manage hedgerows

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/chrw2-manage-hedgerows)

Configured in `configurations/land-grants/actions_config/CHRW2_26/`. 1 version(s) documented, newest first.

## Version 1.0.0

### Configuration

| Field                   | Value               |
| ----------------------- | ------------------- |
| Code                    | CHRW2_26            |
| Description             | Manage hedgerows    |
| Semantic version        | 1.0.0               |
| Enabled                 | Yes                 |
| Displayed to applicants | Yes                 |
| Unit of measurement     | m                   |
| Duration (years)        | 3                   |
| Start date              | 2026-10-18          |
| Display order           | 0                   |
| Group ID                | —                   |
| Availability            | partial             |
| Payment                 | £0.13 per m         |
| Payment method          | default-calculation |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                                   | Description                                                               | Configuration                                                                                  | Caveat message                             |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `minimum-length`                                                       | Is the applied for length at least 20 m?                                  | `minimumLengthM`: 20                                                                           | —                                          |
| `applied-for-total-or-partial-available-length`                        | Is the applied for length no more than the available length?              | —                                                                                              | —                                          |
| `sssi-consent-required<br>(`boundary-intersection-consent-required`)`  | Does the parcel boundary intersect a site of special scientific interest? | `caveatCode`: ne-consent-required<br>`layerName`: sssi<br>`toleranceMeters`: 0                 | A consent is required from Natural England |
| `hefer-consent-required<br>(`boundary-intersection-consent-required`)` | Does the parcel boundary intersect a historic or archaeological feature?  | `caveatCode`: hefer-consent-required<br>`layerName`: historic_features<br>`toleranceMeters`: 0 | A HEFER is needed from Historic England    |

### Example output

> ⚠️ Example output unavailable for 1.0.0: failed to publish config: Timed out waiting for actions_config row code=CHRW2_26 version=1.0.0

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "m",
  "availability": {
    "type": "partial"
  },
  "code": "CHRW2_26",
  "description": "Manage hedgerows",
  "display": true,
  "displayOrder": 0,
  "displayUnit": "metre",
  "displayUnitPlural": "metres",
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/chrw2-manage-hedgerows",
  "payment": {
    "ratePerUnitGbp": 0.13
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 0.13
    },
    "name": "default-calculation",
    "version": "1.0.0"
  },
  "rules": [
    {
      "config": {
        "minimumLengthM": 20
      },
      "description": "Is the applied for length at least 20 m?",
      "name": "minimum-length"
    },
    {
      "description": "Is the applied for length no more than the available length?",
      "name": "applied-for-total-or-partial-available-length"
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
