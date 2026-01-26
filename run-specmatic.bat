@echo off
echo Running Specmatic Async Contract Tests...

docker run --rm ^
  --network specmatickafka_default ^
  -v "%cd%\specmatic.yaml:/usr/src/app/specmatic.yaml" ^
  -v "%cd%\spec:/usr/src/app/spec" ^
  -v "%cd%\spec_overlay.yaml:/usr/src/app/spec_overlay.yaml" ^
  -v "%cd%\examples:/usr/src/app/examples" ^
  specmatic/specmatic-async test ^
  --overlay=/usr/src/app/spec_overlay.yaml ^
  --examples=/usr/src/app/examples

echo Done.
