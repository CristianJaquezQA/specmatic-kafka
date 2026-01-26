# Asynchronous Contract Testing with Kafka and Specmatic

This repository contains a **learning-focused example of asynchronous contract testing** using **Apache Kafka** and **Specmatic**.  
It demonstrates how to define event-driven contracts with **AsyncAPI** and validate Kafka-based message interactions without testing business logic.

## Purpose
The goal of this project is to demonstrate:
- Event-driven contract testing concepts
- Kafka topics and event publishing
- AsyncAPI as a contract definition
- Specmatic Async test execution

## Prerequisites
- Docker
- Docker Compose
- Node.js

## Test Reports
Specmatic generates HTML and JSON reports under:
build/reports/specmatic/async


This repository is intended for **learning and experimentation purposes**.

## Technology Stack
- Apache Kafka
- Specmatic (specmatic-async)
- AsyncAPI
- Docker & docker-compose
- Node.js (sample producer)

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
└─ run-specmatic.bat
```

## How to Run

### 1. Start Kafka Infrastructure
```
docker-compose up -d
```
## 2. Run the Sample Producer
```
cd order-service
node server.js
```
## 3. Run Specmatic Async Contract Tests
```
cd ..
run-specmatic
```
## 4. High-Level Flow (Architecture)
```
+------------------+        +-------------+        +------------------+
| Node.js Producer | -----> | Kafka Topic | -----> | Specmatic Async  |
| (Trigger)        |        | (Broker)    |        | (Contract Check) |
+------------------+        +-------------+        +------------------+
```
## Project Files Overview (What each file is for)

This repository is a learning-focused POC to understand how **Specmatic Async + Kafka + AsyncAPI + Docker compose** can be used for **contract testing** in event-driven systems.

### Core Contract & Specmatic Configuration
- **`asyncapi.yaml`**
  - The **contract** (AsyncAPI). Defines Kafka topics/channels, message schemas, and payload structure.
  - This is the source of truth used by Specmatic for validation.

- **`specmatic.yaml`**
  - Specmatic configuration file.
  - Defines where the AsyncAPI spec is located and how Specmatic connects to Kafka
    (e.g. `kafka:29092` when running inside Docker).

- **`spec_overlay.yaml`**
  - Testing-only overlay configuration.
  - Used to define **triggers** (such as HTTP calls) that allow Specmatic to execute flows
    and observe side effects, without modifying the contract itself.

### Test Data
- **`examples/`**
  - Contains example payloads used during contract testing.
  - Examples must conform to the schemas defined in `asyncapi.yaml`.

- **`examples/accepted-orders.json`**
  - Example payload for the `accepted-orders` Kafka topic.
  - Used by Specmatic during execution to validate producer behavior against the contract.

### Local Test Harness
- **`server.js`**
  - Lightweight **test harness** (not production code).
  - Exposes HTTP endpoints used as triggers and publishes events to Kafka.
  - When running on the host machine, it connects to Kafka via `localhost:9092`.
  - Specmatic runs in Docker and connects to Kafka via `kafka:29092`.

### Infrastructure
- **`docker-compose.yml`**
  - Spins up Kafka locally using Docker for testing purposes.

### Dependency Lock
- **`package-lock.json`**
  - Locks Node.js dependency versions to ensure reproducible installs.

### What Is Covered
- Validation of Kafka events against an AsyncAPI contract
- Topic-level message expectations
- Asynchronous contract testing flow

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

### Disclaimer
This project is **not production-ready** and is intended solely for educational purposes.






