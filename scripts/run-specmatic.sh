#!/bin/bash
echo "Running Specmatic Async Contract Tests..."

cd ..

docker run --rm \
  --network specmatic-network \
  -v "$(pwd)/specmatic.yaml:/usr/src/app/specmatic.yaml" \
  -v "$(pwd)/spec:/usr/src/app/spec" \
  -v "$(pwd)/spec_overlay.yaml:/usr/src/app/spec_overlay.yaml" \
  -v "$(pwd)/examples:/usr/src/app/examples" \
  -v "$(pwd)/build:/usr/src/app/build" \
  specmatic/specmatic-async test \
  --overlay=/usr/src/app/spec_overlay.yaml \
  --examples=/usr/src/app/examples

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
HISTORY_DIR="build/history/$TIMESTAMP"
mkdir -p "$HISTORY_DIR"
cp -r build/reports "$HISTORY_DIR/"
echo "Report saved to $HISTORY_DIR"

echo "Done."

echo "Done."