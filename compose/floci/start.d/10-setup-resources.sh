#!/bin/bash

# S3 buckets
#aws s3 mb s3://my-bucket
# Use localhost because this script runs inside the floci container itself
aws --endpoint-url http://localhost:4566 s3 mb s3://configs-bucket

# SQS queues
#aws sqs create-queue --queue-name my-queue
