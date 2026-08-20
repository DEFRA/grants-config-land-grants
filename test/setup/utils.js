import { readdir, glob, readFile } from 'node:fs/promises'
import path from 'node:path'

const folderPath = 'configurations/land-grants/actions'

export async function getActionConfig() {
  const dirs = await readdir(path.join(process.cwd(), folderPath))
  const files = []

  for (const dir of dirs) {
    const dirFiles = []
    for await (const file of glob('**/*.json', {
      cwd: path.join(process.cwd(), folderPath, dir)
    })) {
      dirFiles.push(file)
    }

    if (dirFiles.length === 0) continue

    const latestConfigFile = dirFiles.sort((a, b) => {
      const aVersion = parseVersion(a)
      const bVersion = parseVersion(b)
      if (aVersion > bVersion) return -1
      if (bVersion > aVersion) return 1
      return 0
    })[0]

    const configFile = await parseConfigFile(
      path.join(process.cwd(), folderPath, dir, latestConfigFile)
    )
    files.push(configFile)
  }

  return files
}

export function parseVersion(filename) {
  const vpart = filename.split('-')[1]
  const [major, minor, patch] = vpart.split('.')
  return Number(`${major}${minor}${patch}`)
}

export async function parseConfigFile(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}
