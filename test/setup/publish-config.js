import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import {
  AWS_ACCESS_KEY_ID,
  AWS_ENDPOINT,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  CONFIGS_BUCKET,
  CONFIG_QUEUE_URL
} from './env.js'
import { waitForActionConfig } from './wait-for.js'

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
)

const awsClientConfig = {
  endpoint: AWS_ENDPOINT,
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
}

const s3 = new S3Client(awsClientConfig)
const sqs = new SQSClient(awsClientConfig)

export async function publishConfig({ code, semanticVersion }) {
  const fileName = `${code.toLowerCase()}-${semanticVersion}.json`
  const localPath = path.join(
    REPO_ROOT,
    'configurations',
    'land-grants',
    'actions',
    code,
    fileName
  )
  const body = await readFile(localPath, 'utf8')

  const key = `land-grants/test/actions/${code}/${fileName}`

  await s3.send(
    new PutObjectCommand({
      Bucket: CONFIGS_BUCKET,
      Key: key,
      Body: body,
      ContentType: 'application/json'
    })
  )

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: CONFIG_QUEUE_URL,
      MessageBody: JSON.stringify([key]),
      MessageAttributes: {
        grant: { DataType: 'String', StringValue: 'land-grants' },
        status: { DataType: 'String', StringValue: 'active' },
        version: { DataType: 'String', StringValue: semanticVersion }
      }
    })
  )

  await waitForActionConfig({ code, semanticVersion })
}
