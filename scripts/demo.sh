#!/usr/bin/env bash
set -euo pipefail

API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3001}

echo "== Lookups studenti =="
curl -s "$API_URL/api/lookups/students" | jq

echo "== Lookups docenti =="
curl -s "$API_URL/api/lookups/teachers" | jq

echo "== Lookups materie =="
curl -s "$API_URL/api/lookups/subjects" | jq

echo "== Inserisci nuovo esame =="
curl -s -X POST "$API_URL/api/exams" \
  -H "Content-Type: application/json" \
  -d '{"matricola":1001,"idMateria":2,"dataEsame":"2024-03-10","voto":30,"lode":true,"idDocente":2}' | jq

echo "== Esami per studente =="
curl -s "$API_URL/api/exams?student=1001" | jq

echo "== Medie studenti =="
curl -s "$API_URL/api/averages/students" | jq

echo "== Media globale =="
curl -s "$API_URL/api/averages/global" | jq
