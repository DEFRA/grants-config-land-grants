# Testing approach

## Why this exists

`grants-config-land-grants` ships versioned JSON files (e.g. `configurations/land-grants/actions_config/UPL1/upl1-3.1.0.json`) that drive grant calculations in `land-grants-api`. Each version is immutable once shipped: an application signed against `upl1-3.1.0.json` today must keep validating correctly for its full lifespan, even after `4.0.0` and beyond exist alongside.

The tests in this directory check that the latest version of each action's config is ingested by a real `land-grants-api` instance and served back by its endpoints. They do not test rule behaviour, which belongs in `land-grants-api`.

## What "a test" means here

One spec file per action, for its latest version, in `test/specs/<CODE>/<code>-<version>.spec.js`. A spec:

1. Publishes its single config file to the API through the same S3 + SQS path the production grants-config broker uses.
2. Waits until the API has ingested it (polls Postgres for the `actions_config` row).
3. Calls the relevant REST endpoint(s) and asserts that the API reports that version.

Before any spec runs, `npm run test:configs` publishes `actions/actions_eligibility.csv` once and waits until every code in it has an `actions` row. Only that file creates `actions` rows, and a config can only update a row that already exists.

Specs are intentionally narrow: each one pushes only its own version and checks it was ingested. Don't add assertions on rule outcomes, caveats or the absence of a rule. When a new config version ships, the existing spec is renamed and updated to it, and older versions are left without a spec.

## How config reaches the API

`land-grants-api` does not accept config over REST. In production a grants-config broker uploads action JSONs to S3 and emits SNS/SQS notifications; the API consumes those notifications and ingests the files.

Locally we replicate that path against `floci` (LocalStack-equivalent) which is already wired into `land-grants-api/compose.yml`:

```
test → PutObject configs-bucket/land-grants/test/actions_config/<CODE>/<file>.json
test → SendMessage grants_config_broker_update
       { "grant": "land-grants", "status": "active", "manifest": [<key>] }
       ↓
API (grants-config-update.handler.js)
       → fetches the S3 object
       → inserts into actions_config (code, version, jsonb config, ...)
```

The handler accepts both SNS-wrapped and raw envelopes; tests use the raw form.

## Service topology

The Docker compose stack used for tests is `land-grants-api/compose.yml` (referenced via git remote) plus `test/compose.localoverride.yml`:

| Service                        | Source                                                             | Notes                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `land-grants-backend-postgres` | local override → `defradigital/land-grants-postgres-seeded:latest` | Published seeded image — pre-seeded land data (parcels, covers, SSSI etc); pulled from Docker Hub on first run |
| `land-grants-backend`          | upstream                                                           | API on `localhost:3001`; receives `LAND_GRANTS_AUTH_TOKEN` / `LAND_GRANTS_ENCRYPTION_KEY` from the override    |
| `floci`                        | upstream                                                           | LocalStack-equivalent on `localhost:4566`                                                                      |
| `floci-init`                   | upstream                                                           | Creates `configs-bucket`, SQS queue `grants_config_broker_update`, SNS topic                                   |

The seeded image avoids the long migration + land-data ingest step on every CI run. The API's own migration profile is not used here — the seeded image already has schema applied. Docker pulls `defradigital/land-grants-postgres-seeded:latest` from Docker Hub on first use and caches it locally.

## Authentication

The API requires every non-`/health` request to carry an encrypted bearer token. `test/setup/api-client.js` encrypts the shared test token with AES-256-GCM using the same recipe as `land-grants-api/src/features/common/plugins/auth.js`:

```
ciphertext = AES-256-GCM(key = scrypt(ENCRYPTION_KEY, "salt", 32), iv = random(12), plaintext = AUTH_TOKEN)
triple     = base64(iv) + ":" + base64(authTag) + ":" + base64(ciphertext)
Authorization: Bearer base64(triple)
```

The token and key live in `test/setup/env.js` and are mirrored in `compose.localoverride.yml` — change one, change the other.

## Layout

```
test/
├── compose.localoverride.yml        # swap Postgres for seeded image; inject auth env
├── docker-compose-smoke-test.sh     # build + up + health-wait + hook + down
├── run-all-tests.sh                 # entry point: sets hook to `npm run test:configs`
├── vitest.config.js                 # serial runner (singleFork), 60s timeout, no fetch-mock setup
├── setup/
│   ├── env.js                       # shared constants (URLs, creds, bucket, queue)
│   ├── api-client.js                # supertest wrapper + AES-GCM bearer
│   ├── publish-actions-eligibility.js # run by test:configs before the specs
│   ├── publish-config.js            # S3 PutObject + SQS SendMessage + wait
│   └── wait-for.js                  # poll actions_config or actions rows
└── specs/
    └── CLIG3/
        └── clig3-1.0.0.spec.js
```

The integration suite has its own `test/vitest.config.js` so it does not inherit the root `vitest.config.js`'s `.vite/setup-files.js`, which monkey-patches `global.fetch` via `vitest-fetch-mock` and would break the AWS SDK clients.

## Running the tests

### Full end-to-end

Brings up the stack, runs every spec, tears down:

```bash
npm run test:smoke
```

By default the stack uses `land-grants-api/compose.yml` via git remote and pulls `defradigital/land-grants-postgres-seeded:latest` from Docker Hub. If you're iterating on the API alongside the tests, point at a local checkout with `LAND_GRANTS_API_DIR=/path/to/land-grants-api npm run test:smoke` to use that repo's `compose.yml` instead.

### Vitest only (compose already up)

If the stack is running (from a previous `test:smoke` run that you halted before teardown, or from `docker compose up` manually):

```bash
npm run test:configs
```

### A single spec

```bash
npx vitest run --config test/vitest.config.js test/specs/CLIG3/clig3-1.0.0.spec.js
```

### Pre-pull the seeded Postgres image

The image is multi-hundred-megabyte; pull it once if you want the first `test:smoke` run to be quick:

```bash
docker pull defradigital/land-grants-postgres-seeded:latest
```

## Updating the spec for a new config version

1. Drop the new JSON into `configurations/land-grants/actions_config/<CODE>/<code>-<semver>.json`.
2. Rename the action's existing spec to the new version, e.g. `git mv test/specs/CLIG3/clig3-1.2.0.spec.js test/specs/CLIG3/clig3-1.3.0.spec.js`. For a new action, copy any sibling spec and update `CODE`.
3. Update `VERSION`, and the expected rate if it changed. Give each `application/validate` call an `applicationId` that names the action and version, because the API pins an application to the config versions used in its first validation run.
4. Run `npm run test:configs` to confirm it passes.

Don't add an `it(...)` block for a new rule or a changed rule outcome, even when the new version changes behaviour. Rule behaviour is tested in `land-grants-api`, and this suite only proves the config is ingested.

## Debugging a failure

When a spec fails:

1. **Timed out waiting for actions rows**: the API never applied `actions_eligibility.csv`, so no spec ran. Check `docker compose logs land-grants-backend` for ingest errors, and that the `land-grants-api` under test reads that file name.
2. **`publishConfig` timed out** — the API never ingested the config. Check `docker compose logs land-grants-backend` for ingest errors and `docker compose logs floci-init` to confirm the bucket/queue exist.
3. **`401 Unauthorized`** — the token/key in `test/setup/env.js` no longer matches `test/compose.localoverride.yml`. Realign them.
4. **Unexpected response shape** — the API contract may have changed. While the stack is up, hit the endpoint with `curl` and the encrypted bearer to inspect the full response.
5. **Inspect ingested rows** — `psql -h localhost -U land_grants_api -d land_grants_api -c "SELECT code, major_version, minor_version, patch_version FROM actions_config;"` (password `land_grants_api`).

## CI

`.github/workflows/check-pull-request.yml` runs `./test/run-all-tests.sh` on every PR that touches `configurations/**`, `test/**`, or the package files. It also enforces the existing changeset rule.

## Known gaps / follow-ups

- **Git-remote compose** falls back to `LAND_GRANTS_API_DIR` until `land-grants-api/compose.yml` is reliably consumable via `https://github.com/...#main:compose.yml`.
