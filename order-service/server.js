const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
app.use(express.json());

// “DB” en memoria: status por orderId
const orderStatus = new Map();

// Kafka client
const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["kafka:29092"],
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-service-group" });


/**
 * TRIGGER endpoint:
 * Specmatic hará un PUT aquí.
 * Nuestro “side effect” inmediato será publicar a Kafka topic "accepted-orders".
 */
app.put("/orders", async (req, res) => {
  const payload = req.body; // {id, status, timestamp}

  // Guardamos estado inicial
  orderStatus.set(String(payload.id), payload.status);

  // Publicamos evento a Kafka
  await producer.send({
    topic: "accepted-orders",
    messages: [{ value: JSON.stringify(payload) }],
  });

  return res.status(200).send("Notification triggered.");
});

/**
 * SIDE EFFECT validation endpoint:
 * Specmatic hará GET aquí para validar que el status cambió a SHIPPED.
 */
app.get("/orders/:id", async (req, res) => {
  const id = req.params.id;
  const expectedStatus = req.query.status;

  const start = Date.now();
  const timeoutMs = 5000;

  while (Date.now() - start < timeoutMs) {
    const current = orderStatus.get(String(id));
    if (current === expectedStatus) {
      return res.status(200).json({ id: Number(id), status: current });
    }
    await new Promise(r => setTimeout(r, 100));
  }

  return res.status(404).send("Not found");
});

// Este consumer representa “tu sistema reaccionando” a un evento Kafka.
// Cuando recibe un mensaje en "out-for-delivery-orders", marca el pedido como SHIPPED.
async function startKafka() {
  await producer.connect();

  await consumer.connect();
  await consumer.subscribe({ topic: "out-for-delivery-orders", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const text = message.value?.toString("utf8") || "";
      try {
        const evt = JSON.parse(text); // {orderId, deliveryAddress, deliveryDate}
        orderStatus.set(String(evt.orderId), "SHIPPED");
        console.log("Consumed out-for-delivery-orders:", evt);
      } catch (e) {
        console.log("Bad message:", text);
      }
    },
  });
}

async function start() {
  await startKafka();
  app.listen(9000, () => console.log("Order Service on http://localhost:9000"));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
