// Curated seeded parcels used when exercising the land-grants-api. Every entry
// exists in the pre-seeded Postgres image (defradigital/land-grants-postgres-seeded)
// and is chosen so the action under test produces a meaningful response. The
// values mirror the parcels the per-version specs in test/specs already use.

export const DEFAULT_PARCEL = { sheetId: 'SD5649', parcelId: '9215' }

export const PARCELS = {
  CLIG3: { sheetId: 'SD6743', parcelId: '8083' },
  CNUM2: { sheetId: 'SD6743', parcelId: '8083' },
  CSAM3: { sheetId: 'SD6743', parcelId: '8083' },
  SCR2: { sheetId: 'SD6743', parcelId: '8083' },
  UPL1: { sheetId: 'SD5649', parcelId: '9215' },
  UPL2: { sheetId: 'SD7247', parcelId: '8028' },
  UPL3: { sheetId: 'SD8743', parcelId: '3264' },
  WBD1: { sheetId: 'SD5649', parcelId: '9215' }
}

export const parcelFor = (code) => PARCELS[code] ?? DEFAULT_PARCEL
