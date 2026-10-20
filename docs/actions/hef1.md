# HEF1 — Maintain weatherproof traditional farm or forestry buildings

[Guidance on GOV.UK](https://www.gov.uk/find-funding-for-land-or-farms/hef1-maintain-weatherproof-traditional-farm-or-forestry-buildings)

Configured in `configurations/land-grants/actions_config/HEF1/`. 4 version(s) documented, newest first.

## Version 1.3.0

### Configuration

| Field                   | Value                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Code                    | HEF1                                                         |
| Description             | Maintain weatherproof traditional farm or forestry buildings |
| Semantic version        | 1.3.0                                                        |
| Enabled                 | Yes                                                          |
| Displayed to applicants | No                                                           |
| Unit of measurement     | sqm                                                          |
| Duration (years)        | 3                                                            |
| Start date              | 2026-10-18                                                   |
| Display order           | 0                                                            |
| Group ID                | —                                                            |
| Availability            | partial                                                      |
| Payment                 | £5 per sqm                                                   |
| Payment method          | default-calculation                                          |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                   | Description                                                           | Configuration                                           | Caveat message                          |
| ------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------- |
| `hefer-consent-required`                               | Does the site require a Historic Environment Farm Environment Record? | `layerName`: historic_features<br>`tolerancePercent`: 0 | A hefer is needed from Historic England |
| `building-check-required<br>(`manual-check-required`)` | Check that buildings on the land meet the action criteria             | —                                                       | A manual building check is required     |
| `applied-for-total-or-partial-available-area`          | Has the total or partial available area been applied for?             | —                                                       | —                                       |

### Example output

> ⚠️ Example output unavailable for 1.3.0: failed to publish config: Timed out waiting for actions_config row code=HEF1 version=1.3.0

<details><summary>Raw config JSON</summary>

```json
{
  "code": "HEF1",
  "description": "Maintain weatherproof traditional farm or forestry buildings",
  "availability": {
    "type": "partial"
  },
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
    },
    {
      "description": "Has the total or partial available area been applied for?",
      "name": "applied-for-total-or-partial-available-area"
    }
  ],
  "applicationUnitOfMeasurement": "sqm",
  "durationYears": 3,
  "startDate": "2026-10-18",
  "semanticVersion": "1.3.0",
  "displayOrder": 0,
  "paymentMethod": {
    "name": "default-calculation",
    "config": {
      "ratePerUnitGbp": 5
    },
    "version": "1.0.0"
  },
  "enabled": true,
  "display": false,
  "groupId": null,
  "guidanceUrl": "https://www.gov.uk/find-funding-for-land-or-farms/hef1-maintain-weatherproof-traditional-farm-or-forestry-buildings"
}
```

</details>

## Version 1.2.0

### Configuration

| Field                   | Value                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Code                    | HEF1                                                         |
| Description             | Maintain weatherproof traditional farm or forestry buildings |
| Semantic version        | 1.2.0                                                        |
| Enabled                 | Yes                                                          |
| Displayed to applicants | Yes                                                          |
| Unit of measurement     | sqm                                                          |
| Duration (years)        | 3                                                            |
| Start date              | 2026-10-18                                                   |
| Display order           | 0                                                            |
| Group ID                | —                                                            |
| Availability            | partial                                                      |
| Payment                 | £5 per sqm                                                   |
| Payment method          | default-calculation                                          |

See the [configuration reference](./configuration-reference.md) for what each field means.

### Eligibility rules

| Rule                                                   | Description                                                           | Configuration                                           | Caveat message                          |
| ------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------- |
| `hefer-consent-required`                               | Does the site require a Historic Environment Farm Environment Record? | `layerName`: historic_features<br>`tolerancePercent`: 0 | A hefer is needed from Historic England |
| `building-check-required<br>(`manual-check-required`)` | Check that buildings on the land meet the action criteria             | —                                                       | A manual building check is required     |
| `applied-for-total-or-partial-available-area`          | Has the total or partial available area been applied for?             | —                                                       | —                                       |

### Example output

> ⚠️ Example output unavailable for 1.2.0: failed to publish config: Timed out waiting for actions_config row code=HEF1 version=1.2.0

<details><summary>Raw config JSON</summary>

```json
{
  "code": "HEF1",
  "description": "Maintain weatherproof traditional farm or forestry buildings",
  "availability": {
    "type": "partial"
  },
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
    },
    {
      "description": "Has the total or partial available area been applied for?",
      "name": "applied-for-total-or-partial-available-area"
    }
  ],
  "applicationUnitOfMeasurement": "sqm",
  "durationYears": 3,
  "startDate": "2026-10-18",
  "semanticVersion": "1.2.0",
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

> ⚠️ Example output unavailable for 1.1.0: failed to publish config: Timed out waiting for actions_config row code=HEF1 version=1.1.0

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

> ⚠️ Example output unavailable for 1.0.0: failed to publish config: Timed out waiting for actions_config row code=HEF1 version=1.0.0

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
