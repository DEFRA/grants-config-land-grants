#!/usr/bin/env node
// Validates that top-level payment rates match paymentMethod.config rates in every action JSON.
// Run via: npm run validate:configs

import { readFile, glob } from 'node:fs/promises'

let errors = 0

for await (const file of glob('configurations/**/*.json')) {
  const config = JSON.parse(await readFile(file, 'utf8'))
  const { payment, paymentMethod } = config

  if (!payment || !paymentMethod?.config) continue

  for (const field of ['ratePerUnitGbp', 'ratePerAgreementPerYearGbp']) {
    const topLevel = payment[field]
    const nested = paymentMethod.config[field]
    if (topLevel === undefined && nested === undefined) continue
    if (topLevel !== nested) {
      console.error(
        `${file}: payment.${field} (${topLevel}) !== paymentMethod.config.${field} (${nested})`
      )
      errors++
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} rate inconsistency(ies) found. Update both locations or consolidate.`)
  process.exit(1)
}

console.log('All config rate fields are consistent.')
