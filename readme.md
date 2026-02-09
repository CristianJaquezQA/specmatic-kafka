# Asynchronous Contract Testing with Kafka and Specmatic

This repository contains a **learning-focused example of asynchronous contract testing** using **Apache Kafka** and **Specmatic**.  
It demonstrates how to define event-driven contracts with **AsyncAPI** and validate Kafka-based message interactions without testing business logic.

## Purpose
The goal of this project is to demonstrate:
- Event-driven contract testing concepts
- Kafka topics and event publishing
- AsyncAPI as a contract definition
- Specmatic Async test execution
- Positive and negative test scenarios

## Prerequisites
- Docker
- Docker Compose
- Node.js

## Technology Stack
- Apache Kafka
- Specmatic (specmatic-async)
- AsyncAPI
- Docker & docker-compose
- Node.js (sample producer)

## Project Structure
```
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
│  ├─ accepted-orders.json
│  └─ accepted-orders-invalid.json
│
├─ order-service/
│  ├─ package-lock.json
│  ├─ package.json
│  └─ server.js
│
├─ scripts/
│  ├─ run-specmatic.bat
│  ├─ run-specmatic.sh
│  ├─ run-specmatic-invalid.bat
│  └─ run-specmatic-invalid.sh
│
├─ spec/
│  └─ asyncapi.yaml
│
├─ .gitignore
├─ docker-compose.yml
├─ spec_overlay.yaml
├─ spec_overlay_invalid.yaml
└─ specmatic.yaml
```

## How to Run

### 1. Start Kafka Infrastructure
```
docker-compose up -d
```

### 2. Run the Sample Producer
```
cd order-service
node server.js
```

### 3. Run Specmatic Async Contract Tests (Positive Scenario)
```
scripts\run-specmatic.bat
```
Linux/Mac:
```
chmod +x scripts/run-specmatic.sh
scripts/run-specmatic.sh
```

### 4. Run Specmatic Async Contract Tests (Negative Scenario)
```
scripts\run-specmatic-invalid.bat
```
Linux/Mac:
```
chmod +x scripts/run-specmatic-invalid.sh
scripts/run-specmatic-invalid.sh
```

## Test Scenarios

### Positive Scenario
Sends a valid message with all required fields (`id`, `status`, `timestamp`) to Kafka. Specmatic validates it against the AsyncAPI contract and the test **passes**.

### Negative Scenario
Sends a message **without the `id` field** to Kafka. Specmatic detects the missing required property and the test **fails** with error `R2001: Missing required property`.

## High-Level Flow (Architecture)
```
+------------------+        +-------------+        +------------------+
| Node.js Producer | -----> | Kafka Topic | -----> | Specmatic Async  |
| (Trigger)        |        | (Broker)    |        | (Contract Check) |
+------------------+        +-------------+        +------------------+
```

## Test Reports
Specmatic generates HTML and JSON reports under:
```
build/reports/specmatic/async
```

## Project Files Overview (What each file is for)

This repository is a learning-focused POC to understand how **Specmatic Async + Kafka + AsyncAPI + Docker compose** can be used for **contract testing** in event-driven systems.

### Core Contract & Specmatic Configuration
- **`asyncapi.yaml`** — The **contract** (AsyncAPI). Defines Kafka topics/channels, message schemas, and payload structure. This is the source of truth used by Specmatic for validation.
- **`specmatic.yaml`** — Specmatic configuration file. Defines where the AsyncAPI spec is located and how Specmatic connects to Kafka (e.g. `kafka:29092` when running inside Docker).
- **`spec_overlay.yaml`** — Testing-only overlay for the positive scenario. Defines the HTTP trigger that sends a valid payload.
- **`spec_overlay_invalid.yaml`** — Testing-only overlay for the negative scenario. Defines the HTTP trigger that sends an invalid payload (missing `id` field).

### Test Data
- **`examples/accepted-orders.json`** — Example payload for the positive scenario.
- **`examples/accepted-orders-invalid.json`** — Example payload for the negative scenario (missing `id` field).

### Scripts
- **`scripts/run-specmatic.bat`** / **`scripts/run-specmatic.sh`** — Runs the positive contract test.
- **`scripts/run-specmatic-invalid.bat`** / **`scripts/run-specmatic-invalid.sh`** — Runs the negative contract test.

### Local Test Harness
- **`server.js`** — Lightweight **test harness** (not production code). Exposes HTTP endpoints used as triggers and publishes events to Kafka. When running on the host machine, it connects to Kafka via `localhost:9092`. Specmatic runs in Docker and connects to Kafka via `kafka:29092`.

### Infrastructure
- **`docker-compose.yml`** — Spins up Kafka locally using Docker for testing purposes.

### What Is Covered
- Validation of Kafka events against an AsyncAPI contract
- Topic-level message expectations
- Asynchronous contract testing flow
- Positive and negative test scenarios

### What Is Not Covered
- Business logic validation
- Data processing rules
- Production-ready configurations

## Learning Scope
This project focuses on understanding asynchronous contract testing concepts,
not on building production-ready Kafka applications.

### For Recruiters
This project demonstrates:
- Understanding of **event-driven architectures**
- Practical usage of **Kafka and AsyncAPI**
- Knowledge of **contract testing beyond REST APIs**
- Ability to isolate and validate **asynchronous system interactions**
- Testing both positive and negative scenarios

### Disclaimer
This project is **not production-ready** and is intended solely for educational purposes.






