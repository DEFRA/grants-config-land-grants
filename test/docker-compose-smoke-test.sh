#!/bin/bash
set -e

# Detect and set up container runtime (Docker or Podman)
CONTAINER_RUNTIME=""
if command -v docker &> /dev/null; then
    CONTAINER_RUNTIME="docker"
    echo "Using Docker as container runtime"
    if ! docker --version &> /dev/null; then
        echo "Warning: docker command found but not working properly"
    fi
elif command -v podman &> /dev/null; then
    CONTAINER_RUNTIME="podman"
    echo "Using Podman as container runtime"
    if ! podman --version &> /dev/null; then
        echo "Error: podman command found but not working properly"
        exit 1
    fi
    docker() {
        podman "$@"
    }
else
    echo "Error: Neither docker nor podman is installed or in PATH"
    exit 1
fi

BASE='https://github.com/DEFRA/land-grants-api.git#main:'
BASE_COMPOSE=${BASE}compose.yml

# Allow callers to point at a local land-grants-api checkout instead of git remote.
# Useful for local dev when iterating on the API and tests together.
if [ -n "${LAND_GRANTS_API_DIR:-}" ]; then
  echo "Using local land-grants-api checkout: ${LAND_GRANTS_API_DIR}"
  BASE_COMPOSE="${LAND_GRANTS_API_DIR}/compose.yml"
fi

docker compose version

COMPOSE_COMMAND="docker compose \
  -f ${BASE_COMPOSE} \
  -f $(dirname "$0")/compose.localoverride.yml"

echo "Running pre-emptive volume cleanse..."
docker volume prune -f

echo "Building docker compose containers..."
eval "${COMPOSE_COMMAND} build --quiet  > /dev/null 2>&1"
echo "Starting services with docker compose..."
START_SERVICES="${COMPOSE_COMMAND} up -d --quiet-pull"
if [ "${CI}" = "true" ]; then
  START_SERVICES="yes | ${START_SERVICES}"
fi
eval "${START_SERVICES}"

echo "Waiting for services to be healthy..."
ATTEMPTS=0
MAX_ATTEMPTS=60

echo "Waiting for land-grants-backend service to start..."
until docker compose -f ${BASE_COMPOSE} ps land-grants-backend | grep -q "Up"; do
    if [ ${ATTEMPTS} -eq ${MAX_ATTEMPTS} ]; then
        echo "Error: Timed out waiting for land-grants-backend service to start."
        docker compose -f ${BASE_COMPOSE} ps
        eval "${COMPOSE_COMMAND} down -v"
        exit 1
    fi
    printf '.'
    ATTEMPTS=$(($ATTEMPTS+1))
    sleep 2
done

echo "Service started, now waiting for health check to pass..."

ATTEMPTS=0

until curl -sf http://localhost:3001/health >/dev/null 2>&1; do
    if [ ${ATTEMPTS} -eq ${MAX_ATTEMPTS} ]; then
        echo "Error: Timed out waiting for land-grants-backend to be accessible."
        echo "--- Current Service Status ---"
        docker compose -f ${BASE_COMPOSE} ps
        echo "--- land-grants-backend Logs ---"
        docker compose -f ${BASE_COMPOSE} logs land-grants-backend
        echo "--- floci Logs ---"
        docker compose -f ${BASE_COMPOSE} logs floci
        eval "${COMPOSE_COMMAND} down -v"
        exit 1
    fi
    printf 'h'
    ATTEMPTS=$(($ATTEMPTS+1))
    sleep 3
done

echo "All services are healthy!"
echo "Service Status:"
docker compose -f ${BASE_COMPOSE} ps

if [ -n "${ACCEPTANCE_TESTS_HOOK:-}" ]; then
  echo "Running per-version config tests..."
  eval "${ACCEPTANCE_TESTS_HOOK}"
fi

eval "${COMPOSE_COMMAND} down -v"
echo ""
echo "Tests complete."
