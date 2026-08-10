# Hexa VIVA Documentation

Comprehensive guide for answering viva questions about all 13 mandatory concepts.

---

## Concept 1: HTTP Status Codes

### Definition
HTTP status codes are three-digit responses indicating request outcomes (success, client error, server error).

### Implementation Files
- `server/src/routes/taskRoutes.js`
- `server/src/controllers/taskController.js`
- `server/src/middleware/errorHandler.js`

### Key Endpoints

| Endpoint | Code | Why |
|----------|------|-----|
| GET /tasks | 200 | Successfully retrieved |
| POST /tasks | 201 | New resource created |
| PUT /tasks/:id | 200 | Updated successfully |
| DELETE /tasks/:id | 204 | No content to return |
| Invalid request | 400 | Client sent bad data |
| Not found | 404 | Resource doesn't exist |
| Server error | 500 | Unexpected failure |

### How to Demonstrate
1. Create task → 201
2. Delete task → 204
3. Request missing task → 404
4. Send invalid data → 400

### Viva Questions

**Q: Why does POST return 201 instead of 200?**
> 201 Created specifically indicates a new resource was successfully created. While 200 is technically correct, 201 is more semantically precise and follows REST conventions.

**Q: Why does DELETE return 204?**
> 204 No Content indicates successful processing where the server has no response body to return. This is standard REST practice—DELETE operations don't need to return the deleted resource.

---

## Concept 2: Environment Variables

### Definition
Environment variables store configuration outside code, separating settings from implementation and protecting secrets.

### Implementation Files
- `server/src/config/env.js`
- `.env.example`
- `.gitignore`

### How to Demonstrate
1. Show .env.example
2. Show .gitignore (includes .env)
3. Try starting server without DATABASE_URL

### Viva Questions

**Q: Why should .env never be committed?**
> It contains sensitive data like database credentials, API keys, and secrets. If committed to version control, anyone can access these credentials.

**Q: What happens if DATABASE_URL is missing?**
> The application fails at startup with a clear error message listing missing required variables, preventing misconfiguration.

---

## Concept 3: Git Workflow

### Definition
Structured version control with branches, meaningful commits, and code review workflow.

### Implementation
- Feature branches for each major feature
- Descriptive commit messages
- Logical commit structure

### Viva Questions

**Q: Explain your branch workflow.**
> We use feature branches for each major piece of work. main contains production-ready code. Feature branches are created for specific work, committed to, then merged after review.

**Q: What makes a good commit?**
> A single, focused change that can be understood independently. Each commit represents one logical change with a descriptive message in present tense.

---

## Concept 4: Async API Fetching

### Definition
Making HTTP requests to servers without blocking the UI, using JavaScript's async capabilities.

### Implementation Files
- `client/src/api/taskApi.js`
- `client/src/api/projectApi.js`
- `client/src/pages/Dashboard.jsx`

### Request Flow
React → API function → fetch → Express → Controller → Service → Repository → PostgreSQL → Response → State → UI

### Viva Questions

**Q: Explain the browser-to-database request lifecycle.**
> User action triggers API function using async/await. fetch() sends request to Express route. Route maps to controller, which calls service for business logic. Service calls repository for database queries. Response flows back through layers to React component, which updates state and triggers re-render.

---

## Concept 5: Client-Side Routing

### Definition
Single Page Application navigation without full page reloads, using JavaScript and the History API.

### Implementation Files
- `client/src/App.jsx`
- `client/src/components/Navbar.jsx`

### Routes Defined
- `/` → Dashboard
- `/tasks` → Tasks list
- `/tasks/:id` → Task details
- `/projects` → Projects list
- `/concepts` → Concept center

### Viva Questions

**Q: What is client-side routing?**
> Navigation that changes the URL and renders different components without requesting new HTML pages from the server. Uses React Router and the browser's History API.

---

## Concept 6: async/await

### Definition
Modern JavaScript syntax for handling Promises with synchronous-looking code.

### Implementation
All API functions in `client/src/api/*.js` use async/await.

### Viva Questions

**Q: What does async do?**
> It marks a function as asynchronous, automatically returning a Promise.

**Q: Does await block JavaScript?**
> No! await only pauses the async function's execution. The JavaScript runtime continues processing other code while waiting for the Promise to resolve.

---

## Concept 7: Closures

### Definition
A function that retains access to variables from its outer scope even after the outer function has finished.

### Implementation Files
- `client/src/utils/createTaskFilter.js`
- `client/src/pages/Tasks.jsx`

### Closure in Action
```javascript
const filter = createTaskFilter('completed'); // 'completed' captured
filter(tasks); // Returns completed tasks
```

### Viva Questions

**Q: Show me the closure in your repository.**
> In `createTaskFilter.js`, the returned `filterTasks` function is a closure that captures the `status` parameter from its outer scope.

---

## Concept 8: Event Loop

### Definition
JavaScript's mechanism for handling async operations through call stack, microtask queue, and task queue.

### Implementation Files
- `client/src/demos/eventLoopDemo.js`
- `client/src/pages/EventLoopDemo.jsx`

### Execution Order
A (sync) → D (sync) → C (microtask) → B (macrotask)

### Viva Questions

**Q: Why does Promise.then execute before setTimeout(..., 0)?**
> Promise.then is a microtask, setTimeout is a macrotask. The event loop executes ALL microtasks before processing ANY macrotasks.

---

## Concept 9: Hoisting

### Definition
JavaScript's behavior of processing declarations before executing code, with different behavior for var, let, const, and functions.

### Implementation Files
- `client/src/demos/hoistingDemo.js`
- `client/src/pages/HoistingDemo.jsx`

### Key Points
- var: hoisted with undefined
- let/const: hoisted but in TDZ (Temporal Dead Zone)
- Function declarations: fully hoisted
- Function expressions: only variable hoisted

### Viva Questions

**Q: Are let and const hoisted?**
> Yes, they are hoisted but remain uninitialized in the Temporal Dead Zone until the declaration is reached. Accessing them before that throws ReferenceError.

---

## Concept 10: Promises vs Callbacks

### Definition
Three patterns for handling async operations: callbacks (original), Promises (improved), async/await (sugar).

### Implementation Files
- `client/src/demos/promisesVsCallbacks.js`
- `client/src/pages/PromisesDemo.jsx`

### Viva Questions

**Q: Why are Promises easier to compose?**
> They have chainable .then() and .catch() methods, plus utilities like Promise.all() for parallel operations. This avoids callback hell.

---

## Concept 11: React Component Composition

### Definition
Building UIs by combining smaller, focused components using children props and composition.

### Implementation Files
- `client/src/components/*.jsx`
- Hierarchy: Layout > Navbar + PageContainer > TaskList > TaskCard

### Viva Questions

**Q: What is component composition?**
> Building complex UIs by combining smaller, reusable components. Using children props to pass content between components.

---

## Concept 12: useState

### Definition
React Hook for managing local component state, triggering re-renders on changes.

### Implementation
Used throughout all page components for tasks, loading, error, filters.

### Key Points
- Never mutate state directly
- Use functional updates when previous state needed
- Controlled inputs use state

### Viva Questions

**Q: Why should state not be mutated directly?**
> React relies on state changes to detect updates and trigger re-renders. Direct mutation won't trigger re-renders and breaks React's internal tracking.

---

## Concept 13: PostgreSQL PK/FK

### Definition
Relational database design with Primary Keys (unique identifiers) and Foreign Keys (table relationships).

### Implementation Files
- `database/schema.sql`
- `server/src/repositories/taskRepository.js`

### Relationships
- users (PK) → projects (FK: owner_id)
- projects (PK) → tasks (FK: project_id)
- users (PK) → tasks (FK: created_by)

### Viva Questions

**Q: Show me your JOIN query.**
> In taskRepository.js, findAll() uses JOIN to get project_name and created_by_name with task data.

**Q: What happens if project_id does not exist?**
> PostgreSQL rejects the insert due to foreign key constraint—referential integrity prevents orphaned records.