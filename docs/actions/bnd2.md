# BND2 — Maintain earth banks or stone-faced hedgebanks

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/bnd2-maintain-earth-banks-or-stone-faced-hedgebanks)

Configured in `configurations/land-grants/actions_config/BND2/`. 2 version(s) documented, newest first.

## Version 1.1.0

### Configuration

| Field                   | Value                                          |
| ----------------------- | ---------------------------------------------- |
| Code                    | BND2                                           |
| Description             | Maintain earth banks or stone-faced hedgebanks |
| Semantic version        | 1.1.0                                          |
| Enabled                 | Yes                                            |
| Displayed to applicants | No                                             |
| Unit of measurement     | m                                              |
| Duration (years)        | 3                                              |
| Start date              | 2026-10-18                                     |
| Display order           | 0                                              |
| Group ID                | —                                              |
| Availability            | partial                                        |
| Payment                 | £0.11 per m                                    |
| Payment method          | default-calculation                            |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                     | Description                                                                    | Configuration                                           | Caveat message                             |
| ------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------ |
| `available-length`       | Does the parcel have the available length?                                     | —                                                       | —                                          |
| `minimum-length`         | Is the applied-for length at least 20 m and no more than the available length? | `minimumLengthM`: 20                                    | —                                          |
| `hefer-consent-required` | Does the parcel boundary intersect a historic or archaeological feature?       | `layerName`: historic_features<br>`tolerancePercent`: 0 | A hefer is needed from Historic England    |
| `sssi-consent-required`  | Does the parcel boundary intersect a Site of Special Scientific Interest?      | `layerName`: sssi<br>`tolerancePercent`: 1              | A consent is required from Natural England |

### Example output

> ⚠️ Example output unavailable for 1.1.0: failed to publish config: Timed out waiting for actions_config row code=BND2 version=1.1.0

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "m",
  "code": "BND2",
  "description": "Maintain earth banks or stone-faced hedgebanks",
  "display": false,
  "displayOrder": 0,
  "displayUnit": "meter",
  "displayUnitPlural": "meters",
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/bnd2-maintain-earth-banks-or-stone-faced-hedgebanks",
  "payment": {
    "ratePerUnitGbp": 0.11
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 0.11
    },
    "name": "default-calculation",
    "version": "1.0.0"
  },
  "rules": [
    {
      "description": "Does the parcel have the available length?",
      "name": "available-length"
    },
    {
      "config": {
        "minimumLengthM": 20
      },
      "description": "Is the applied-for length at least 20 m and no more than the available length?",
      "name": "minimum-length"
    },
    {
      "config": {
        "caveatDescription": "A hefer is needed from Historic England",
        "layerName": "historic_features",
        "tolerancePercent": 0
      },
      "description": "Does the parcel boundary intersect a historic or archaeological feature?",
      "name": "hefer-consent-required"
    },
    {
      "name": "sssi-consent-required",
      "config": {
        "layerName": "sssi",
        "tolerancePercent": 1,
        "caveatDescription": "A consent is required from Natural England"
      },
      "description": "Does the parcel boundary intersect a Site of Special Scientific Interest?"
    }
  ],
  "semanticVersion": "1.1.0",
  "startDate": "2026-10-18",
  "availability": {
    "type": "partial"
  }
}
```

</details>

## Version 1.0.0

### Configuration

| Field                   | Value                                          |
| ----------------------- | ---------------------------------------------- |
| Code                    | BND2                                           |
| Description             | Maintain earth banks or stone-faced hedgebanks |
| Semantic version        | 1.0.0                                          |
| Enabled                 | Yes                                            |
| Displayed to applicants | Yes                                            |
| Unit of measurement     | m                                              |
| Duration (years)        | 3                                              |
| Start date              | 2026-10-18                                     |
| Display order           | 0                                              |
| Group ID                | —                                              |
| Availability            | partial                                        |
| Payment                 | £0.11 per m                                    |
| Payment method          | default-calculation                            |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                     | Description                                                                    | Configuration                                           | Caveat message                             |
| ------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------ |
| `available-length`       | Does the parcel have the available length?                                     | —                                                       | —                                          |
| `minimum-length`         | Is the applied-for length at least 20 m and no more than the available length? | `minimumLengthM`: 20                                    | —                                          |
| `hefer-consent-required` | Does the parcel boundary intersect a historic or archaeological feature?       | `layerName`: historic_features<br>`tolerancePercent`: 0 | A hefer is needed from Historic England    |
| `sssi-consent-required`  | Does the parcel boundary intersect a Site of Special Scientific Interest?      | `layerName`: sssi<br>`tolerancePercent`: 1              | A consent is required from Natural England |

### Example output

> ⚠️ Example output unavailable for 1.0.0: failed to publish config: Timed out waiting for actions_config row code=BND2 version=1.0.0

<details><summary>Raw config JSON</summary>

```json
{
  "applicationUnitOfMeasurement": "m",
  "code": "BND2",
  "description": "Maintain earth banks or stone-faced hedgebanks",
  "display": true,
  "displayOrder": 0,
  "displayUnit": "meter",
  "displayUnitPlural": "meters",
  "durationYears": 3,
  "enabled": true,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/bnd2-maintain-earth-banks-or-stone-faced-hedgebanks",
  "payment": {
    "ratePerUnitGbp": 0.11
  },
  "paymentMethod": {
    "config": {
      "ratePerUnitGbp": 0.11
    },
    "name": "default-calculation",
    "version": "1.0.0"
  },
  "rules": [
    {
      "description": "Does the parcel have the available length?",
      "name": "available-length"
    },
    {
      "config": {
        "minimumLengthM": 20
      },
      "description": "Is the applied-for length at least 20 m and no more than the available length?",
      "name": "minimum-length"
    },
    {
      "config": {
        "caveatDescription": "A hefer is needed from Historic England",
        "layerName": "historic_features",
        "tolerancePercent": 0
      },
      "description": "Does the parcel boundary intersect a historic or archaeological feature?",
      "name": "hefer-consent-required"
    },
    {
      "name": "sssi-consent-required",
      "config": {
        "layerName": "sssi",
        "tolerancePercent": 1,
        "caveatDescription": "A consent is required from Natural England"
      },
      "description": "Does the parcel boundary intersect a Site of Special Scientific Interest?"
    }
  ],
  "semanticVersion": "1.0.0",
  "startDate": "2026-10-18",
  "availability": {
    "type": "partial"
  }
}
```

</details>
