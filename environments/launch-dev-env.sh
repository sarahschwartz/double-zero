#!/usr/bin/env bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

docker compose -f $SCRIPT_DIR/compose-dev-hyperchain.yaml --env-file=$SCRIPT_DIR/compose-dev-hyperchain.env build
docker compose -f $SCRIPT_DIR/compose-dev-hyperchain.yaml --env-file=$SCRIPT_DIR/compose-dev-hyperchain.env up