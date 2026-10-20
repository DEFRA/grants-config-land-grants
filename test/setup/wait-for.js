import pg from 'pg'
import { POSTGRES } from './env.js'

const { Client } = pg

async function pollUntil(
  isDone,
  timeoutMessage,
  { timeoutMs = 30000, intervalMs = 500 } = {}
) {
  const deadline = Date.now() + timeoutMs
  const client = new Client(POSTGRES)
  await client.connect()
  try {
    while (Date.now() < deadline) {
      if (await isDone(client)) return
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  } finally {
    await client.end().catch(() => {})
  }

  throw new Error(timeoutMessage)
}

export async function waitForActionConfig({
  code,
  semanticVersion,
  timeoutMs,
  intervalMs
}) {
  const [major, minor, patch] = semanticVersion.split('.').map(Number)

  await pollUntil(
    async (client) => {
      const { rows } = await client.query(
        `SELECT 1 FROM actions_config
         WHERE code = $1 AND major_version = $2 AND minor_version = $3 AND patch_version = $4
         LIMIT 1`,
        [code, major, minor, patch]
      )
      return rows.length > 0
    },
    `Timed out waiting for actions_config row code=${code} version=${semanticVersion}`,
    { timeoutMs, intervalMs }
  )
}

export async function waitForActions(codes) {
  await pollUntil(async (client) => {
    const { rows } = await client.query(
      'SELECT count(*)::int AS found FROM actions WHERE code = ANY($1)',
      [codes]
    )
    return rows[0].found === codes.length
  }, `Timed out waiting for actions rows for ${codes.length} codes`)
}
