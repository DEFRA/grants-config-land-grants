import pg from 'pg'
import { POSTGRES } from './env.js'

const { Client } = pg

export async function waitForActionConfig({ code, semanticVersion, timeoutMs = 30000, intervalMs = 500 }) {
  const deadline = Date.now() + timeoutMs
  const [major, minor, patch] = semanticVersion.split('.').map(Number)

  while (Date.now() < deadline) {
    const client = new Client(POSTGRES)
    try {
      await client.connect()
      const { rows } = await client.query(
        `SELECT 1 FROM actions_config
         WHERE code = $1 AND major_version = $2 AND minor_version = $3 AND patch_version = $4
         LIMIT 1`,
        [code, major, minor, patch]
      )
      if (rows.length > 0) return
    } finally {
      await client.end().catch(() => {})
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }

  throw new Error(`Timed out waiting for actions_config row code=${code} version=${semanticVersion}`)
}
