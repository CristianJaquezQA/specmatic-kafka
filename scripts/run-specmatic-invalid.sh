#!/bin/bash
echo "Running Specmatic Async Contract Tests (Invalid Scenario)..."

cd ..

docker run --rm \
  --network specmatickafka_default \
  -v "$(pwd)/specmatic.yaml:/usr/src/app/specmatic.yaml" \
  -v "$(pwd)/spec:/usr/src/app/spec" \
  -v "$(pwd)/spec_overlay_invalid.yaml:/usr/src/app/spec_overlay_invalid.yaml" \
  -v "$(pwd)/examples:/usr/src/app/examples" \
  specmatic/specmatic-async test \
  --overlay=/usr/src/app/spec_overlay_invalid.yaml \
  --examples=/usr/src/app/examples

echo "Done."