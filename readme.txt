 Código para ejecutar test.
 
 docker run --rm --network specmatickafka_default ^
   -v "%cd%\specmatic.yaml:/usr/src/app/specmatic.yaml" ^
   -v "%cd%\spec:/usr/src/app/spec" ^
   -v "%cd%\spec_overlay.yaml:/usr/src/app/spec_overlay.yaml" ^
   -v "%cd%\examples:/usr/src/app/examples" ^
   specmatic/specmatic-async test ^
   --overlay=/usr/src/app/spec_overlay.yaml ^
   --examples=/usr/src/app/examples




   SPECMATICKAFKA
├─ build/
│  └─ reports/
│     └─ specmatic/
│        └─ async/
│           ├─ test/
│           │  ├─ ctrf/
│           │  │  └─ ctrf-report.json
│           │  └─ html/
│           │     └─ index.html
│           ├─ coverage-report.json
│           ├─ test-data-report.json
│           └─ TEST-junit-jupiter.xml
│
├─ examples/
│  └─ accepted-orders.json
│
├─ order-service/
│  ├─ node_modules/
│  ├─ package-lock.json
│  ├─ package.json
│  └─ server.js
│
├─ spec/
│  └─ asyncapi.yaml
│
├─ docker-compose.yml
├─ spec_overlay.yaml
└─ specmatic.yaml
