import crypto from 'node:crypto'
import { promisify } from 'node:util'
import request from 'supertest'
import { API_BASE_URL, AUTH_TOKEN, ENCRYPTION_KEY } from './env.js'

const scrypt = promisify(crypto.scrypt)

// AES-256-GCM encryption matching land-grants-api/src/features/common/plugins/auth.js
async function encryptedBearer() {
  const iv = crypto.randomBytes(12)
  const key = await scrypt(ENCRYPTION_KEY, 'salt', 32)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  let encrypted = cipher.update(AUTH_TOKEN, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  const authTag = cipher.getAuthTag()

  const tripleColon = `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`
  return Buffer.from(tripleColon, 'utf8').toString('base64')
}

export async function authHeader() {
  return `Bearer ${await encryptedBearer()}`
}

export const apiClient = {
  async post(path, body) {
    return request(API_BASE_URL)
      .post(path)
      .set('Authorization', await authHeader())
      .set('X-Forwarded-Authorization', 'dummy')
      .set('Accept', 'application/json')
      .send(body)
  },
  async get(path) {
    return request(API_BASE_URL)
      .get(path)
      .set('Authorization', await authHeader())
      .set('Accept', 'application/json')
  }
}
