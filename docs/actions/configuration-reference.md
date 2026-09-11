# Action configuration reference

Each land-grants action is defined by a JSON file at
`configurations/land-grants/actions/<CODE>/<code>-<version>.json`. Files are
**immutable once published** — changes ship as a new `semanticVersion`. The
land-grants-api validates each file against
`src/features/grants-config/schema/action-config.schema.js` and additional
fields are permitted (`allowUnknown`).

## Top-level fields

| Field                          | Type                                     | Notes                                                                                 |
| ------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `code`                         | string (required)                        | Stable action identifier, e.g. `CLIG3`.                                               |
| `semanticVersion`              | string (required)                        | `MAJOR.MINOR.PATCH`. Immutable per file.                                              |
| `description`                  | string                                   | User-facing action name.                                                              |
| `applicationUnitOfMeasurement` | string                                   | e.g. `ha`, `count`.                                                                   |
| `durationYears`                | number                                   | Agreement length.                                                                     |
| `startDate`                    | ISO date                                 | When the action becomes available.                                                    |
| `displayOrder`                 | number                                   | Sort order in the UI.                                                                 |
| `groupId`                      | integer \| null                          | Action grouping.                                                                      |
| `enabled`                      | boolean                                  | Whether the API serves the action.                                                    |
| `display`                      | boolean                                  | Whether applicants see it.                                                            |
| `guidanceUrl`                  | URI                                      | Link to the GOV.UK guidance.                                                          |
| `availability`                 | `{ type: 'total' \| 'partial' }` \| null | Whether the whole parcel or a subset can be applied for.                              |
| `payment`                      | object \| null                           | Legacy flat-rate field (`ratePerUnitGbp`).                                            |
| `paymentMethod`                | object                                   | Calculation strategy, e.g. `default-calculation` or `wmp-calculation` (with `tiers`). |
| `landCoverClassCodes`          | string[]                                 | Land cover classes the action applies to.                                             |
| `rules`                        | object[]                                 | Eligibility rules — see below.                                                        |

## Rules

Each entry in `rules` names a rule executor implemented in the land-grants-api
rules engine (`src/features/rules-engine/rules/<version>/`). The executor is
resolved as `${rule.type ?? rule.name}-${version}`, so a generic executor (e.g.
`manual-check-required`) can be reused under an action-specific `name` (e.g.
`pond-check-required`) via the `type` field.

| Rule field                                                                              | Notes                                                                |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `name`                                                                                  | Rule name (also the executor key unless `type` is set).              |
| `type`                                                                                  | Optional executor override.                                          |
| `description`                                                                           | Human-readable purpose.                                              |
| `config.layerName`                                                                      | Spatial layer to test against (e.g. `moorland`, `sssi`).             |
| `config.tolerancePercent` / `minimumIntersectionPercent` / `maximumIntersectionPercent` | Intersection thresholds.                                             |
| `config.caveatDescription`                                                              | Text attached as a caveat when a manual check / consent is required. |

The **explanations and caveat messages** shown on each action page are captured
live from `POST /api/v2/application/validate`; they are produced by the rules
engine at runtime, not stored in the config.

## Extending the examples

Live examples currently exercise the happy path using a curated seeded parcel
per action (`test/setup/parcels.js`). To document a rule _failing_ (its error
explanation), add a parcel that trips that rule to the capture step in
`scripts/generate-actions-docs.js`.
