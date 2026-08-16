# High-Level Design (HLD) — Hexa Architecture

## Vision & System Architecture
**Hexa** is a full-stack engineering platform demonstrating modern architecture, software design patterns, and core computer science concepts. It follows a clean **Three-Tier Architecture**:

```text
  ┌────────────────────────────────────────────────────────┐
  │         Presentation Tier: React 18 SPA                │
  │  - React Router v6 Client-Side Routing                  │
  │  - Reusable Component Hierarchy (Layout, EmptyState)   │
  │  - ProtectedRoute Client Guard Component               │
  └───────────────────────────┬────────────────────────────┘
                              │ HTTP REST / JSON
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │         Application Tier: Express REST Backend         │
  │  - Controllers & Services (auth, project, task)        │
  │  - Bcrypt Password Hashing & JWT Authentication         │
  │  - Centralized Environment Validation (env.js)         │
  └───────────────────────────┬────────────────────────────┘
                              │ SQL via Connection Pool
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │         Data Tier: PostgreSQL Relational Database      │
  │  - Normalized Tables (users, projects, tasks)          │
  │  - PK/FK Referential Integrity & Cascading Deletes     │
  │  - B-Tree Indexing Strategy (idx_tasks_project_id)     │
  └────────────────────────────────────────────────────────┘
```

---

## Component Architecture & Implementation Details

### 1. Presentation Layer (Frontend - React SPA)
- **Routing & Route Guards**: [`client/src/App.jsx`](file:///c:/Users/hardi/Hexa/client/src/App.jsx) configures SPA routing. [`client/src/components/ProtectedRoute.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/ProtectedRoute.jsx) guards protected client paths (`/tasks/new`), redirecting unauthenticated users.
- **Component Composition**: UI follows a clear hierarchical composition tree (`App` → `Layout` → `Page` → `TaskList` → `TaskCard`). Presentation components like [`client/src/components/EmptyState.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/EmptyState.jsx) accept configurable props (`message`, `icon`) to remain DRY across pages.
- **Form State Management (`useState`)**: [`client/src/components/TaskForm.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/TaskForm.jsx) manages form state using a single `formData` object. Supports Create mode (`initialData = {}`) and Edit mode (pre-populated) with functional immutable updates (`setFormData(prev => ({ ...prev, [name]: value }))`).
- **Async API Fetching Layer**: Dedicated modules ([`client/src/api/projectApi.js`](file:///c:/Users/hardi/Hexa/client/src/api/projectApi.js) and `taskApi.js`) wrap `fetch()` calls in `async/await`, status checks (`response.ok`), and error handling (`error.status = 404`).
- **Interactive Concept Demonstrations**: Dedicated pages for Event Loop (`EventLoopDemo.jsx`), Hoisting (`HoistingDemo.jsx`), Promises vs Callbacks (`PromisesDemo.jsx`), and Closures (`createTaskFilter.js`).

### 2. Application Layer (Backend - Express API)
- **Authentication & Security**: [`server/src/controllers/authController.js`](file:///c:/Users/hardi/Hexa/server/src/controllers/authController.js) hashes passwords using `bcryptjs` (`saltRounds = 10`) during registration and verifies hashes on login. Issues JWT access tokens and sets HTTP-only refresh cookies.
- **Environment & Secrets Management**: [`server/src/config/env.js`](file:///c:/Users/hardi/Hexa/server/src/config/env.js) validates mandatory environment variables (`DATABASE_URL`, `PORT`, `JWT_SECRET`) on boot. Real secrets remain isolated in `.env` (gitignored), while [`.env.example`](file:///c:/Users/hardi/Hexa/.env.example) supplies safe developer templates.
- **Semantic HTTP Responses**: Controllers explicitly return semantic status codes: `200 OK` (retrievals/updates), `201 Created` (registrations/creations), `204 No Content` (deletions), `400 Bad Request` (validations), `401 Unauthorized` (auth errors), `404 Not Found` (missing records), `409 Conflict` (duplicate emails), `500 Server Error` (global error middleware).

### 3. Data Tier (PostgreSQL Database)
- **Relational Schema**: Defined in [`database/schema.sql`](file:///c:/Users/hardi/Hexa/database/schema.sql) with strict data types and constraints.
- **Primary & Foreign Key Integrity**: `users.id`, `projects.id`, and `tasks.id` serve as primary keys. Foreign keys (`projects.owner_id REFERENCES users(id)`, `tasks.project_id REFERENCES projects(id)`, `tasks.created_by REFERENCES users(id)`) enforce referential integrity.
- **SQL B-Tree Indexing Strategy**:
  - `idx_users_email ON users(email)`: Optimizes user login lookups.
  - `idx_projects_owner_id ON projects(owner_id)`: Speeds up project queries by owner.
  - `idx_tasks_project_id ON tasks(project_id)`: Converts task retrieval by project into a $O(\log N)$ B-Tree index scan.
  - `idx_tasks_status ON tasks(status)`: Optimizes dashboard status filtering.

### 4. Development Workflow & Automated Testing
- **Git Feature Branch Workflow**: Standardized workflow using feature branches (`feature/viva-hardening`), atomic commits, and Pull Requests.
- **PR Template**: Enforces Pull Request metadata via [`.github/pull_request_template.md`](file:///c:/Users/hardi/Hexa/.github/pull_request_template.md).
- **Automated Testing Suite**: [`server/test/api.test.js`](file:///c:/Users/hardi/Hexa/server/test/api.test.js) uses Node's native test runner (`node:test`) to verify JWT token generation/validation and environment loading.

### Real-Time Communication — WebSocket

In addition to the REST API, Hexa contains a WebSocket communication channel for real-time server-to-client communication.

```text
React Client
     │
     ├──────── HTTP/REST ────────► Express API
     │
     └────── WebSocket Connection ──────► WebSocket Server
                                             │
                                             └── Real-time Events

                                             The REST API remains responsible for normal request/response operations, while WebSockets are used when the server needs to communicate with connected clients in real time.

Implementation: server/src/websocket.js

Payment Gateway Integration

Payment processing is isolated behind a dedicated backend service.

React Client
     │
     │ HTTP request
     ▼
Express Backend
     │
     ▼
Payment Service
     │
     ▼
External Payment Gateway

The frontend does not directly manage payment-provider credentials. The backend payment service acts as the integration boundary between Hexa and the external payment system.

Implementation: server/src/services/paymentService.js


---

## 100% Concept Mapping Matrix across HLD

1. **HTTP Status Codes**: Handled in `authController.js`, `taskController.js`, `projectController.js`.
2. **Environment Variables**: Isolated in `server/src/config/env.js` and `.env`.
3. **Git Workflow**: Defined via `feature/viva-hardening` branch and `.github/pull_request_template.md`.
4. **Async API Fetching**: Implemented in `projectApi.js` and `taskApi.js`.
5. **Client-Side Routing**: Configured in `App.jsx` and guarded by `ProtectedRoute.jsx`.
6. **async/await**: Used across all API functions, controllers, repositories, and `Dashboard.jsx` (`Promise.all`).
7. **Closures**: Encapsulated in `client/src/utils/createTaskFilter.js`.
8. **Event Loop**: Demonstrated in `EventLoopDemo.jsx` (Call stack vs Microtasks vs Macrotasks).
9. **Hoisting & TDZ**: Demonstrated in `HoistingDemo.jsx` (`var` vs `let`/`const` Temporal Dead Zone).
10. **Promises vs Callbacks**: Demonstrated in `PromisesDemo.jsx`.
11. **React Composition**: Structured via `App` → `Layout` → `Page` → `TaskList` → `TaskCard` and `EmptyState.jsx`.
12. **useState**: Implemented in `TaskForm.jsx` (single object `formData` state, Create/Edit modes, `...prev` updates).
13. **PostgreSQL PK/FK**: Schema defined in `database/schema.sql` and queried via JOINs in `taskRepository.js`.
14. **SQL Indexing**: B-Tree indexes created in `database/schema.sql` (`idx_tasks_project_id`, `idx_users_email`).