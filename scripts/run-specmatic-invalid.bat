@echo off
echo Running Specmatic Async Contract Tests (Invalid Scenario)...

cd ..

docker run --rm ^
  --network specmatickafka_default ^
  -v "%cd%\specmatic.yaml:/usr/src/app/specmatic.yaml" ^
  -v "%cd%\spec:/usr/src/app/spec" ^
  -v "%cd%\spec_overlay_invalid.yaml:/usr/src/app/spec_overlay_invalid.yaml" ^
  -v "%cd%\examples:/usr/src/app/examples" ^
  specmatic/specmatic-async test ^
  --overlay=/usr/src/app/spec_overlay_invalid.yaml ^
  --examples=/usr/src/app/examples

echo Done.