# Hexa Viva Cheat Sheet

Quick reference for all 13 mandatory concepts.

---

## 1. HTTP Status Codes
- **Definition**: Three-digit responses indicating request outcomes
- **File**: `server/src/routes/taskRoutes.js`, `server/src/controllers/taskController.js`
- **Demo**: Create task (201), Delete task (204), Invalid request (400), Not found (404)
- **Key Answer**: 201 = new resource created, 204 = no content to return

## 2. Environment Variables
- **Definition**: Key-value pairs for configuration outside code
- **File**: `server/src/config/env.js`, `.env.example`, `.gitignore`
- **Demo**: Check .env.example, see .gitignore
- **Key Answer**: Separates config from code, protects secrets

## 3. Git Workflow
- **Definition**: Structured version control with branches and commits
- **File**: `.git/`, branch structure
- **Demo**: `git log --oneline`, `git branch -a`
- **Key Answer**: Feature branches isolate work, focused commits

## 4. Async API Fetching
- **Definition**: Non-blocking HTTP requests using fetch and async/await
- **File**: `client/src/api/taskApi.js`, `client/src/api/projectApi.js`
- **Demo**: Open Tasks page, check Network tab
- **Key Answer**: React → API → Express → Database → State → UI

## 5. Client-Side Routing
- **Definition**: SPA navigation without page reloads
- **File**: `client/src/App.jsx`
- **Demo**: Navigate between pages, check URL changes
- **Key Answer**: React Router uses History API, no server round-trip

## 6. Async/Await
- **Definition**: Syntax for handling Promises with synchronous appearance
- **File**: `client/src/api/*.js` (all API functions)
- **Demo**: API calls use async/await throughout
- **Key Answer**: async returns Promise, await pauses function (not blocking!)

## 7. Closures
- **Definition**: Function that retains access to outer scope variables
- **File**: `client/src/utils/createTaskFilter.js`
- **Demo**: Filter tasks by status
- **Key Answer**: filterTasks captures 'status' from createTaskFilter

## 8. Event Loop
- **Definition**: JS mechanism handling async via call stack, microtask queue, task queue
- **File**: `client/src/demos/eventLoopDemo.js`
- **Demo**: Visit /concepts/event-loop
- **Key Answer**: Sync → Microtasks (Promise) → Macrotasks (setTimeout)

## 9. Hoisting
- **Definition**: JS moves declarations to top of scope before execution
- **File**: `client/src/demos/hoistingDemo.js`
- **Demo**: Visit /concepts/hoisting
- **Key Answer**: var hoisted as undefined, let/const in TDZ

## 10. Promises vs Callbacks
- **Definition**: Three async patterns: callbacks, Promises, async/await
- **File**: `client/src/demos/promisesVsCallbacks.js`
- **Demo**: Visit /concepts/promises
- **Key Answer**: Callbacks → Promise → async/await (most readable)

## 11. React Composition
- **Definition**: Building UIs by combining smaller components
- **File**: `client/src/components/*.jsx`
- **Demo**: Layout > Navbar > PageContainer > TaskList > TaskCard
- **Key Answer**: Reusable components with children prop

## 12. useState
- **Definition**: React Hook for local component state
- **File**: `client/src/pages/*.jsx`
- **Demo**: Filter tasks, create task
- **Key Answer**: Never mutate directly, use functional updates

## 13. PostgreSQL PK/FK
- **Definition**: Relational design with primary and foreign keys
- **File**: `database/schema.sql`, `server/src/repositories/*.js`
- **Demo**: Tasks page shows project_name, created_by_name (from JOINs)
- **Key Answer**: PK uniquely identifies, FK creates relationships, JOINs combine tables

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Start backend (requires PostgreSQL)
npm run dev:server

# Start frontend
npm run dev:client

# Database setup
psql -c "CREATE DATABASE hexa;"
psql -d hexa -f database/schema.sql
psql -d hexa -f database/seed.sql
```

---

## Common Examiner Questions

| Question | Quick Answer |
|----------|--------------|
| Why 201 not 200? | 201 = new resource created |
| Why 204 for DELETE? | 204 = success, no response body |
| Does await block? | NO - pauses only that function |
| What is a closure? | Function + captured variables |
| Are let/const hoisted? | YES - but in TDZ |
| Show me a JOIN | taskRepository.js findAll() |
| Why not App.jsx everything? | Single responsibility, reusable, testable |