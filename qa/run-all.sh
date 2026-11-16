#!/bin/sh
# Führt alle Prüfungen aus. Aufruf: sh run-all.sh <label>
# Voraussetzung: beide Testserver laufen (siehe README.md).
L=${1:-run}; cd "$(dirname "$0")"; mkdir -p results
# Vergleichsbasis (Schritt 0)
node shots.js $L > results/log-shots-$L.txt 2>&1
node rsvp.js $L > results/log-rsvp-$L.txt 2>&1
node flows.js $L > results/log-flows-$L.txt 2>&1
node api-tests.js $L > results/log-api-$L.txt 2>&1
node sa.js $L > results/log-sa-$L.txt 2>&1
# Neu seit Schritt 1
node cassis.js $L > results/log-cassis-$L.txt 2>&1
node api-rules.js $L > results/log-api-rules-$L.txt 2>&1
node modules.js $L > results/log-modules-$L.txt 2>&1
node sa-features.js $L > results/log-sa-features-$L.txt 2>&1
echo fertig > results/done-$L
