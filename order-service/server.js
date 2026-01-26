// Import Express to expose HTTP endpoints used as triggers / validation points
const express = require("express");

// Import KafkaJS to interact with Kafka as producer and consumer
const { Kafka } = require("kafkajs");

// Create Express application
const app = express();

// Enable JSON body parsing for incoming HTTP requests
app.use(express.json());

// In-memory state store (simulates application state)
// Used ONLY for testing side effects, not production persistence
const orderStatus = new Map();

// Kafka client configuration
// NOTE: "kafka:29092" assumes this service runs inside the Docker network
const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"],
});

// Kafka producer: publishes events to topics
const producer = kafka.producer();

// Kafka consumer: listens to events produced by other services
const consumer = kafka.consumer({ groupId: "order-service-group" });

/**
 * TRIGGER ENDPOINT
 *
 * This endpoint represents the action that starts the flow.
 * In real systems, this could be an API call, UI action, or job.
 *
 * Specmatic will call this endpoint to trigger the side effect:
 * publishing an event to Kafka.
 */
app.put("/orders", async (req, res) => {
  // Payload expected to match the AsyncAPI contract
  // Example: { id, status, timestamp }
  const payload = req.body;

  // Store initial state in memory
  orderStatus.set(String(payload.id), payload.status);

  // Publish the event to Kafka
  // This is the SIDE EFFECT that contract testing validates
  await producer.send({
    topic: "accepted-orders",
    messages: [{ value: JSON.stringify(payload) }],
  });

  // Respond immediately; async systems do not wait for downstream consumers
  return res.status(200).send("Notification triggered.");
});

/**
 * SIDE EFFECT VALIDATION ENDPOINT
 *
 * This endpoint allows validation that an asynchronous effect occurred.
 * Specmatic (or another test) can poll this endpoint to verify state changes.
 *
 * This pattern is common when testing async/event-driven systems.
 */
app.get("/orders/:id", async (req, res) => {
  const id = req.params.id;
  const expectedStatus = req.query.status;

  const start = Date.now();
  const timeoutMs = 5000;

  // Poll until the expected side effect occurs or timeout is reached
  while (Date.now() - start < timeoutMs) {
    const current = orderStatus.get(String(id));
    if (current === expectedStatus) {
      return res.status(200).json({ id: Number(id), status: current });
    }
    // Small delay to avoid busy-waiting
    await new Promise(r => setTimeout(r, 100));
  }

  // Side effect did not occur within the expected time
  return res.status(404).send("Not found");
});

/**
 * KAFKA CONSUMER LOGIC
 *
 * This simulates the system reacting to an incoming Kafka event.
 * When an event is received, the application updates its internal state.
 *
 * This represents a downstream reaction in an event-driven architecture.
 */
async function startKafka() {
  // Connect producer before sending messages
  await producer.connect();

  // Connect consumer and subscribe to the topic
  await consumer.connect();
  await consumer.subscribe({
    topic: "out-for-delivery-orders",
    fromBeginning: false,
  });

  // Process incoming Kafka messages
  await consumer.run({
    eachMessage: async ({ message }) => {
      const text = message.value?.toString("utf8") || "";
      try {
        // Expected payload example:
        // { orderId, deliveryAddress, deliveryDate }
        const evt = JSON.parse(text);

        // Update in-memory state as a side effect
        orderStatus.set(String(evt.orderId), "SHIPPED");

        console.log("Consumed out-for-delivery-orders:", evt);
      } catch (e) {
        // Defensive logging for malformed messages
        console.log("Bad message:", text);
      }
    },
  });
}

/**
 * Application bootstrap
 *
 * Starts Kafka connections and exposes HTTP endpoints.
 * This file acts as a TEST HARNESS, not production code.
 */
async function start() {
  await startKafka();

  app.listen(9000, () =>
    console.log("Order Service running on http://localhost:9000")
  );
}

// Start the application and fail fast on errors
start().catch((e) => {
  console.error(e);
  process.exit(1);
});
