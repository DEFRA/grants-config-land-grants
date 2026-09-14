#!/bin/bash
set -e

# Generate the action documentation against a live land-grants-api.
#
# Reuses the smoke-test harness: it stands up the docker-compose stack
# (land-grants-api + floci + seeded Postgres), waits for /health, then runs the
# generator hook (which writes docs/actions/** into this repo's working tree) and
# finally tears the stack down.
#
# Usage:
#   ./scripts/generate-docs.sh
#
#   To run against a local land-grants-api checkout instead of the git remote:
#     LAND_GRANTS_API_DIR=/path/to/land-grants-api ./scripts/generate-docs.sh

export COMPOSE_EXPERIMENTAL_GIT_REMOTE=true

export ACCEPTANCE_TESTS_HOOK='npm run docs:generate'

"$(dirname "$0")/../test/docker-compose-smoke-test.sh"
