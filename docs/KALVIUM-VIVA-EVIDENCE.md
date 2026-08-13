# Kalvium Master Viva Evidence & Implementation Guide — Hexa

This guide maps all 18 target concepts to exact files, runtime routes, standard code signatures, and viva explanations for the Kalvium Assessor evaluation.

---

## 1. NoSQL Mongo Schema Modeling & Embedding vs Referencing

### Embedding
- **File**: [`server/src/nosql/models/EmbeddedPost.js`](file:///c:/Users/hardi/Hexa/server/src/nosql/models/EmbeddedPost.js)
- **Signature**: `comments: [commentSchema]`
- **Runtime Route**: `GET /api/nosql/embedding`
- **Why**: Storing comments directly inside the parent Post document allows single-query retrieval of post and comments together without JOINs.
- **Trade-off**: Increases document size; subject to MongoDB 16MB document size limit.

### Referencing
- **File**: [`server/src/nosql/models/ReferencedPost.js`](file:///c:/Users/hardi/Hexa/server/src/nosql/models/ReferencedPost.js)
- **Signature**: `author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }`
- **Runtime Route**: `GET /api/nosql/referencing`
- **Why**: Referencing prevents data duplication when multiple posts share the same author or user model.
- **Trade-off**: Requires `$lookup` or `.populate()` queries, adding read latency.

---

## 2. PostgreSQL Transactions

- **File**: [`server/src/db/pool.js`](file:///c:/Users/hardi/Hexa/server/src/db/pool.js#L40-L53)
- **Signature**:
  ```javascript
  await client.query('BEGIN');
  await client.query('COMMIT');
  await client.query('ROLLBACK');
  ```
- **Runtime Route**: `POST /api/projects/with-task` ([`server/src/services/projectService.js`](file:///c:/Users/hardi/Hexa/server/src/services/projectService.js#L166-L204))
- **Why**: Guarantees Atomicity. If initial task creation fails, project insertion is rolled back completely.
- **Trade-off**: Holds connection pool locks during transaction execution.

---

## 3. JWT Issuance & Verification

- **Files**: [`server/src/controllers/authController.js`](file:///c:/Users/hardi/Hexa/server/src/controllers/authController.js), [`server/src/middleware/authMiddleware.js`](file:///c:/Users/hardi/Hexa/server/src/middleware/authMiddleware.js)
- **Signature**:
  ```javascript
  import jwt from 'jsonwebtoken';
  const token = jwt.sign(payload, secret, { expiresIn: '15m' });
  jwt.verify(token, secret, (err, decoded) => { ... });
  ```
- **Runtime Route**: Protected endpoints requiring `Authorization: Bearer <token>`
- **Why**: Stateless authentication. The server verifies tokens cryptographically without database session lookups.

---

## 4. Input Sanitization & Injection Awareness

- **File**: [`server/src/middleware/sanitizeInput.js`](file:///c:/Users/hardi/Hexa/server/src/middleware/sanitizeInput.js)
- **Signature**:
  ```javascript
  import sanitizeHtml from 'sanitize-html';
  req.body[key] = sanitizeHtml(req.body[key], { allowedTags: [] });
  ```
- **SQL Protection**: Parameterized queries `pool.query('SELECT * FROM users WHERE email = $1', [email])`
- **Why**: Prevents Cross-Site Scripting (XSS) and SQL Injection attacks via defense-in-depth sanitization.

---

## 5. Containerization with Docker

- **Files**: [`Dockerfile`](file:///c:/Users/hardi/Hexa/Dockerfile), [`Dockerfile.frontend`](file:///c:/Users/hardi/Hexa/Dockerfile.frontend), [`docker-compose.yml`](file:///c:/Users/hardi/Hexa/docker-compose.yml)
- **Signature**: `FROM node:18-alpine`, `docker-compose.yml` orchestrating `backend`, `frontend`, `postgres`, `redis`, `mongodb`.
- **Why**: Ensures consistent environment behavior across development, testing, and production.

---

## 6. Caching with Redis

- **File**: [`server/src/utils/redis.js`](file:///c:/Users/hardi/Hexa/server/src/utils/redis.js)
- **Signature**:
  ```javascript
  import { createClient } from 'redis';
  await client.get(key);
  await client.set(key, value, { EX: 300 });
  await client.del(key);
  ```
- **Runtime Demo**: `GET /api/projects` caching layer in `projectService.js`.
- **Why**: Cache-aside strategy reduces database CPU load and speeds up response times for hot data.

---

## 7. WebSocket Real-Time Communication

- **File**: [`server/src/websocket.js`](file:///c:/Users/hardi/Hexa/server/src/websocket.js)
- **Signature**:
  ```javascript
  import { WebSocketServer } from 'ws';
  const wss = new WebSocketServer({ server });
  ```
- **Runtime Demo**: `/concepts/websocket` page connecting to `ws://localhost:6001`.
- **Why**: Enables persistent, low-latency, bidirectional real-time task updates without HTTP polling.

---

## 8. Scheduled Jobs / Cron

- **File**: [`server/src/jobs/cronJobs.js`](file:///c:/Users/hardi/Hexa/server/src/jobs/cronJobs.js)
- **Signature**:
  ```javascript
  import cron from 'node-cron';
  cron.schedule('0 * * * *', async () => { ... });
  ```
- **Why**: Offloads repetitive background maintenance tasks (hourly cache cleanup) from user request handlers.

---

## 9. Server-Side Rendering (SSR)

- **File**: [`server/src/ssr.js`](file:///c:/Users/hardi/Hexa/server/src/ssr.js)
- **Signature**:
  ```javascript
  import { renderToString } from 'react-dom/server';
  const html = renderToString(<App />);
  ```
- **Runtime Route**: `GET /ssr-demo`
- **Why**: Returns pre-rendered HTML to the browser for faster initial paint and improved SEO indexability.

---

## 10. Payment Gateway Integration (Stripe)

- **Files**: [`server/src/services/paymentService.js`](file:///c:/Users/hardi/Hexa/server/src/services/paymentService.js), [`server/src/routes/paymentRoutes.js`](file:///c:/Users/hardi/Hexa/server/src/routes/paymentRoutes.js)
- **Signature**:
  ```javascript
  import Stripe from 'stripe';
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  await stripe.paymentIntents.create({ amount, currency: 'usd' });
  ```
- **Runtime Demo**: `/payment-demo`
- **Why**: Uses standard Stripe test-mode SDK for secure payment intent creation.
