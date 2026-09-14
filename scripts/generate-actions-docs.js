// Generates browsable markdown documentation for every land-grants action
// config version under configurations/land-grants/actions.
//
// For each version it renders:
//   - the GOV.UK guidance link
//   - how to configure it (a field table + the raw JSON, plus a link to the
//     shared configuration reference)
//   - a *live* example of what the API produces for that version: the payment
//     calculation and the per-rule explanations / caveats returned by
//     /api/v2/application/validate.
//
// The live examples require a running land-grants-api (localhost:3001). This is
// normally driven by scripts/generate-docs.sh, which stands up the same
// docker-compose stack the smoke tests use. For fast local iteration against an
// already-running API just run `npm run docs:generate`.
//
// Output is written to docs/actions/ and is deterministic (no timestamps), so
// re-running with unchanged config produces no diff.

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { publishConfig } from '../test/setup/publish-config.js'
import { apiClient } from '../test/setup/api-client.js'
import { parcelFor } from '../test/setup/parcels.js'

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)
const ACTIONS_DIR = path.join(
  REPO_ROOT,
  'configurations',
  'land-grants',
  'actions'
)
const OUT_DIR = path.join(REPO_ROOT, 'docs', 'actions')

const STRICT = process.argv.includes('--strict')

/** Compare two semantic version strings ascending. */
function compareSemver(a, b) {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0)
  }
  return 0
}

/** Discover every action config file, grouped by code, versions ascending. */
async function discoverActions() {
  const codes = (await readdir(ACTIONS_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  const actions = []
  for (const code of codes) {
    const dir = path.join(ACTIONS_DIR, code)
    const files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort()
    const versions = []
    for (const file of files) {
      const raw = await readFile(path.join(dir, file), 'utf8')
      const config = JSON.parse(raw)
      versions.push({
        version: config.semanticVersion,
        file,
        raw: raw.trimEnd(),
        config
      })
    }
    versions.sort((a, b) => compareSemver(a.version, b.version))
    actions.push({ code, versions })
  }
  return actions
}

const yesNo = (v) => (v ? 'Yes' : 'No')
const cell = (v) => (v === undefined || v === null ? '—' : String(v))

/** Short human summary of an action's payment model, for the index table. */
function paymentSummary(config) {
  const rate = config.payment?.ratePerUnitGbp
  if (typeof rate === 'number') {
    return `£${rate} per ${config.applicationUnitOfMeasurement ?? 'unit'}`
  }
  if (config.paymentMethod?.config?.tiers) return 'Tiered'
  return '—'
}

function renderConfigTable(config) {
  const rows = [
    ['Code', config.code],
    ['Description', config.description],
    ['Semantic version', config.semanticVersion],
    ['Enabled', yesNo(config.enabled)],
    ['Displayed to applicants', yesNo(config.display)],
    ['Unit of measurement', config.applicationUnitOfMeasurement],
    ['Duration (years)', config.durationYears],
    ['Start date', config.startDate],
    ['Display order', config.displayOrder],
    ['Group ID', config.groupId],
    ['Availability', config.availability?.type],
    ['Payment', paymentSummary(config)],
    ['Payment method', config.paymentMethod?.name]
  ]
  const lines = ['| Field | Value |', '| --- | --- |']
  for (const [k, v] of rows) lines.push(`| ${k} | ${cell(v)} |`)
  return lines.join('\n')
}

function renderPaymentTiers(config) {
  const tiers = config.paymentMethod?.config?.tiers
  if (!tiers) return null
  const lines = [
    '**Payment tiers**',
    '',
    '| Lower limit (ha) | Upper limit (ha) | Flat rate (£) | Rate per unit (£) |',
    '| --- | --- | --- | --- |'
  ]
  for (const t of tiers) {
    lines.push(
      `| ${cell(t.lowerLimitHa)} | ${cell(t.upperLimitHa)} | ${cell(t.flatRateGbp)} | ${cell(t.ratePerUnitGbp)} |`
    )
  }
  return lines.join('\n')
}

function renderRulesSection(config) {
  const rules = config.rules ?? []
  if (rules.length === 0) return '_No eligibility rules configured._'
  const lines = [
    '| Rule | Description | Configuration | Caveat message |',
    '| --- | --- | --- | --- |'
  ]
  for (const rule of rules) {
    const conf = { ...(rule.config ?? {}) }
    const caveat = conf.caveatDescription ?? '—'
    delete conf.caveatDescription
    const confText = Object.keys(conf).length
      ? Object.entries(conf)
          .map(([k, v]) => `\`${k}\`: ${v}`)
          .join('<br>')
      : '—'
    const name = rule.type ? `${rule.name}<br>(\`${rule.type}\`)` : rule.name
    lines.push(
      `| \`${name}\` | ${cell(rule.description)} | ${confText} | ${caveat} |`
    )
  }
  return lines.join('\n')
}

/** Hit the live API and return the raw pieces we want to show, best-effort. */
async function captureExamples({ code, version }) {
  const parcel = parcelFor(code)
  const parcelId = `${parcel.sheetId}-${parcel.parcelId}`
  const action = { code, quantity: 1, version }
  const result = {
    parcel,
    error: null,
    payment: null,
    validate: null,
    parcels: null
  }

  try {
    const parcelsResp = await apiClient.post('/api/v2/parcels', {
      sbi: '123456789',
      parcelIds: [parcelId],
      fields: ['actions']
    })
    const found = (parcelsResp.body?.parcels?.[0]?.actions ?? []).find(
      (a) => a.code === code
    )
    if (found) {
      result.parcels = {
        code: found.code,
        guidanceUrl: found.guidanceUrl,
        availability: found.availability
      }
    }

    const paymentResp = await apiClient.post('/api/v2/payments/calculate', {
      startDate: '2025-09-15',
      parcel: [{ ...parcel, actions: [action] }]
    })
    const item = Object.values(
      paymentResp.body?.payment?.parcelItems ?? {}
    ).find((i) => i.code === code && i.version === version)
    if (item) {
      result.payment = {
        code: item.code,
        version: item.version,
        annualPaymentPence: item.annualPaymentPence
      }
    }

    const validateResp = await apiClient.post('/api/v2/application/validate', {
      applicationId: `docs-gen-${code}-${version}`,
      requester: 'docs-generator',
      applicantCrn: '1234567890',
      sbi: '123456789',
      landActions: [{ ...parcel, actions: [action] }]
    })
    const matched = (validateResp.body?.actions ?? []).find(
      (a) => a.actionCode === code && a.version === version
    )
    if (matched) result.validate = matched
  } catch (err) {
    result.error = err.message
  }
  return result
}

function jsonBlock(value) {
  return ['```json', JSON.stringify(value, null, 2), '```'].join('\n')
}

function renderExampleSection(captured, version) {
  if (captured.error) {
    return `> ⚠️ Example output unavailable for ${version}: ${captured.error}`
  }
  const parts = []

  parts.push(
    `The parcel \`${captured.parcel.sheetId}-${captured.parcel.parcelId}\` was used to capture the responses below.`
  )

  if (captured.payment) {
    const pounds = (captured.payment.annualPaymentPence / 100).toFixed(2)
    parts.push('')
    parts.push('**Payment** — `POST /api/v2/payments/calculate`')
    parts.push('')
    parts.push(
      `Annual payment: **£${pounds}** (${captured.payment.annualPaymentPence} pence) for 1 unit.`
    )
    parts.push('')
    parts.push(jsonBlock(captured.payment))
  } else {
    parts.push('')
    parts.push('_No payment example was returned for this parcel._')
  }

  if (captured.validate) {
    const v = captured.validate
    parts.push('')
    parts.push(
      '**Eligibility & explanations** — `POST /api/v2/application/validate`'
    )
    parts.push('')
    parts.push(`Overall result: **${v.hasPassed ? 'passed' : 'not passed'}**.`)

    for (const rule of v.rules ?? []) {
      parts.push('')
      parts.push(`- \`${rule.name}\` — ${rule.passed ? 'passed' : 'failed'}`)
      if (rule.reason) parts.push(`  - Reason: ${rule.reason}`)
      for (const ex of rule.explanations ?? []) {
        const lines = (ex.lines ?? []).join(' ')
        parts.push(`  - ${ex.title}: ${lines}`)
      }
      if (rule.caveat) {
        parts.push(
          `  - Caveat: ${rule.caveat.description} (\`${rule.caveat.code}\`)`
        )
      }
    }

    parts.push('')
    parts.push(
      '<details><summary>Full <code>application/validate</code> action result</summary>'
    )
    parts.push('')
    parts.push(jsonBlock(v))
    parts.push('')
    parts.push('</details>')
  } else {
    parts.push('')
    parts.push('_No validation example was returned for this parcel._')
  }

  return parts.join('\n')
}

function renderVersionSection({ version, raw, config }, captured) {
  const parts = [`## Version ${version}`, '']
  parts.push('### Configuration', '')
  parts.push(renderConfigTable(config))
  const tiers = renderPaymentTiers(config)
  if (tiers) parts.push('', tiers)
  parts.push(
    '',
    'See the [configuration reference](./configuration-reference.md) for what each field means.'
  )

  parts.push('', '### Eligibility rules', '')
  parts.push(renderRulesSection(config))

  parts.push('', '### Example output', '')
  parts.push(renderExampleSection(captured, version))

  parts.push('', '<details><summary>Raw config JSON</summary>', '')
  parts.push('```json', raw, '```', '', '</details>')
  return parts.join('\n')
}

function renderActionPage(action, capturesByVersion) {
  const latest = action.versions[action.versions.length - 1].config
  const parts = [`# ${action.code} — ${latest.description}`, '']
  if (latest.guidanceUrl) {
    parts.push(`[Guidance on GOV.UK](${latest.guidanceUrl})`, '')
  }
  parts.push(
    `Configured in \`configurations/land-grants/actions/${action.code}/\`. ${action.versions.length} version(s) documented, newest first.`,
    ''
  )

  const descending = [...action.versions].reverse()
  for (const v of descending) {
    parts.push(renderVersionSection(v, capturesByVersion.get(v.version)))
    parts.push('')
  }
  return parts.join('\n').trimEnd() + '\n'
}

function renderIndex(actions) {
  const parts = [
    '# Land grants actions',
    '',
    'Auto-generated reference for every land-grants action and config version.',
    '',
    '> Do not edit these files by hand — they are regenerated from',
    '> `configurations/land-grants/actions/` by `npm run docs:generate` and',
    '> committed automatically on merge to `main`. See',
    '> [configuration-reference.md](./configuration-reference.md) for how to configure an action.',
    '',
    '| Action | Description | Latest version | Unit | Payment | Guidance |',
    '| --- | --- | --- | --- | --- | --- |'
  ]
  for (const action of actions) {
    const latest = action.versions[action.versions.length - 1].config
    const guidance = latest.guidanceUrl
      ? `[GOV.UK](${latest.guidanceUrl})`
      : '—'
    parts.push(
      `| [${action.code}](./${action.code.toLowerCase()}.md) | ${cell(latest.description)} | ${latest.semanticVersion} | ${cell(latest.applicationUnitOfMeasurement)} | ${paymentSummary(latest)} | ${guidance} |`
    )
  }
  return parts.join('\n') + '\n'
}

function renderConfigurationReference() {
  return `# Action configuration reference

Each land-grants action is defined by a JSON file at
\`configurations/land-grants/actions/<CODE>/<code>-<version>.json\`. Files are
**immutable once published** — changes ship as a new \`semanticVersion\`. The
land-grants-api validates each file against
\`src/features/grants-config/schema/action-config.schema.js\` and additional
fields are permitted (\`allowUnknown\`).

## Top-level fields

| Field | Type | Notes |
| --- | --- | --- |
| \`code\` | string (required) | Stable action identifier, e.g. \`CLIG3\`. |
| \`semanticVersion\` | string (required) | \`MAJOR.MINOR.PATCH\`. Immutable per file. |
| \`description\` | string | User-facing action name. |
| \`applicationUnitOfMeasurement\` | string | e.g. \`ha\`, \`count\`. |
| \`durationYears\` | number | Agreement length. |
| \`startDate\` | ISO date | When the action becomes available. |
| \`displayOrder\` | number | Sort order in the UI. |
| \`groupId\` | integer \\| null | Action grouping. |
| \`enabled\` | boolean | Whether the API serves the action. |
| \`display\` | boolean | Whether applicants see it. |
| \`guidanceUrl\` | URI | Link to the GOV.UK guidance. |
| \`availability\` | \`{ type: 'total' \\| 'partial' }\` \\| null | Whether the whole parcel or a subset can be applied for. |
| \`payment\` | object \\| null | Legacy flat-rate field (\`ratePerUnitGbp\`). |
| \`paymentMethod\` | object | Calculation strategy, e.g. \`default-calculation\` or \`wmp-calculation\` (with \`tiers\`). |
| \`landCoverClassCodes\` | string[] | Land cover classes the action applies to. |
| \`rules\` | object[] | Eligibility rules — see below. |

## Rules

Each entry in \`rules\` names a rule executor implemented in the land-grants-api
rules engine (\`src/features/rules-engine/rules/<version>/\`). The executor is
resolved as \`\${rule.type ?? rule.name}-\${version}\`, so a generic executor (e.g.
\`manual-check-required\`) can be reused under an action-specific \`name\` (e.g.
\`pond-check-required\`) via the \`type\` field.

| Rule field | Notes |
| --- | --- |
| \`name\` | Rule name (also the executor key unless \`type\` is set). |
| \`type\` | Optional executor override. |
| \`description\` | Human-readable purpose. |
| \`config.layerName\` | Spatial layer to test against (e.g. \`moorland\`, \`sssi\`). |
| \`config.tolerancePercent\` / \`minimumIntersectionPercent\` / \`maximumIntersectionPercent\` | Intersection thresholds. |
| \`config.caveatDescription\` | Text attached as a caveat when a manual check / consent is required. |

The **explanations and caveat messages** shown on each action page are captured
live from \`POST /api/v2/application/validate\`; they are produced by the rules
engine at runtime, not stored in the config.

## Extending the examples

Live examples currently exercise the happy path using a curated seeded parcel
per action (\`test/setup/parcels.js\`). To document a rule *failing* (its error
explanation), add a parcel that trips that rule to the capture step in
\`scripts/generate-actions-docs.js\`.
`
}

async function main() {
  const actions = await discoverActions()

  // Publish every version (ascending) so all are ingested and retrievable by
  // version pin, then capture per-version output.
  const capturesByAction = new Map()
  for (const action of actions) {
    const capturesByVersion = new Map()
    for (const { version } of action.versions) {
      try {
        await publishConfig({ code: action.code, semanticVersion: version })
      } catch (err) {
        capturesByVersion.set(version, {
          parcel: parcelFor(action.code),
          error: `failed to publish config: ${err.message}`
        })
        if (STRICT) throw err
        continue
      }
      const captured = await captureExamples({ code: action.code, version })
      if (STRICT && captured.error) throw new Error(captured.error)
      capturesByVersion.set(version, captured)
    }
    capturesByAction.set(action.code, capturesByVersion)
  }

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(path.join(OUT_DIR, 'README.md'), renderIndex(actions))
  await writeFile(
    path.join(OUT_DIR, 'configuration-reference.md'),
    renderConfigurationReference()
  )
  for (const action of actions) {
    const md = renderActionPage(action, capturesByAction.get(action.code))
    await writeFile(path.join(OUT_DIR, `${action.code.toLowerCase()}.md`), md)
  }

  console.log(
    `Generated docs for ${actions.length} actions in ${path.relative(REPO_ROOT, OUT_DIR)}`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
