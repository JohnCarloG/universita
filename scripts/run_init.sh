#!/usr/bin/env bash
set -euo pipefail

mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASS}" universita < scripts/init_db.sql
