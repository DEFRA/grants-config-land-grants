export const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3001'

export const AWS_ENDPOINT = process.env.AWS_ENDPOINT ?? 'http://localhost:4566'
export const AWS_REGION = process.env.AWS_REGION ?? 'eu-west-2'
export const AWS_ACCESS_KEY_ID = 'test'
export const AWS_SECRET_ACCESS_KEY = 'test'

export const CONFIGS_BUCKET = 'configs-bucket'
export const CONFIG_QUEUE_URL = `${AWS_ENDPOINT}/000000000000/grants_config_broker_update`

// Must match compose.localoverride.yml
export const AUTH_TOKEN = 'land-grants-config-test-token'
export const ENCRYPTION_KEY = 'land-grants-config-test-encryption-key-1234567890'

export const POSTGRES = {
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  database: process.env.POSTGRES_DB ?? 'land_grants_api',
  user: process.env.POSTGRES_USER ?? 'land_grants_api',
  password: process.env.POSTGRES_PASSWORD ?? 'land_grants_api'
}
