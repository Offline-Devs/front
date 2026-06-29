#!/usr/bin/env sh
set -eu

cd /opt/ayandesabz
docker load -i images/ayandesabz-images.tar
docker compose up -d
docker compose ps
