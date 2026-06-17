#!/bin/bash
set -e

# Usage:
#   Run all per-version config regression tests:
#     ./test/run-all-tests.sh
#
#   To build the seeded postgres image from a local land-grants-api checkout:
#     LAND_GRANTS_API_DIR=/path/to/land-grants-api ./test/run-all-tests.sh

export COMPOSE_EXPERIMENTAL_GIT_REMOTE=true

export ACCEPTANCE_TESTS_HOOK='npm run test:configs'

"$(dirname "$0")/docker-compose-smoke-test.sh"
