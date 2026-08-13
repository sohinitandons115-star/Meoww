# Product Requirements Document (PRD) — Hexa Platform

## Overview
This document outlines the product requirements for **Hexa** (`hardikkaurani/Hexa`), a full-stack engineering platform built with React and Node.js. It features robust RESTful API interactions, client-side routing with route guards, PostgreSQL relational database management with PK/FK constraints and performance B-Tree indexing, secure authentication via bcryptjs, and comprehensive viva-ready concept demonstrations.

---

## 100% Implemented Product Features & Architecture

### 1. User Authentication & Security
- **Bcrypt Password Hashing**: Password values are hashed using `bcryptjs` (`saltRounds = 10`) during registration in [`server/src/controllers/authController.js`](file:///c:/Users/hardi/Hexa/server/src/controllers/authController.js#L41) and verified on login.
- **JWT Session Tokens**: Issues short-lived access tokens and sets HTTP-only refresh cookies.
- **Environment Secrets Isolation**: Externalizes secrets into `.env` (gitignored), verified on server boot via [`server/src/config/env.js`](file:///c:/Users/hardi/Hexa/server/src/config/env.js). `.env.example` provides safe developer defaults.

### 2. API Integration & Asynchronous Operations
- **Async API Fetching**: React components consume backend APIs via `fetch()` and `async/await` in [`client/src/api/projectApi.js`](file:///c:/Users/hardi/Hexa/client/src/api/projectApi.js) and `taskApi.js`.
- **Semantic HTTP Status Codes**: Explicit error and success handling for `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `409 Conflict`, and `500 Server Error`. Fixed `error.status = 404` status assignment.
- **Parallel vs Sequential Execution**: Uses `Promise.all()` for concurrent dashboard fetching in [`Dashboard.jsx`](file:///c:/Users/hardi/Hexa/client/src/pages/Dashboard.jsx) vs sequential `await` for dependent queries.

### 3. Frontend Experience & Routing
- **Client-Side Routing & Guards**: React Router v6 handles navigation in [`client/src/App.jsx`](file:///c:/Users/hardi/Hexa/client/src/App.jsx). Protected routes (`/tasks/new`) are secured using [`client/src/components/ProtectedRoute.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/ProtectedRoute.jsx).
- **Component Composition**: UI hierarchy (`App` → `Layout` → `Page` → `TaskList` → `TaskCard`) with reusable presentation components like [`client/src/components/EmptyState.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/EmptyState.jsx) accepting configurable `message` and `icon` props.
- **Form State Management (`useState`)**: Controlled form inputs in [`client/src/components/TaskForm.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/TaskForm.jsx) using a unified `formData` object supporting Create mode (`initialData = {}`) and Edit mode (pre-populated data) with immutable updates (`setFormData(prev => ({ ...prev, [name]: value }))`).
- **JavaScript Core Concepts**: Interactive pages demonstrating Closures ([`createTaskFilter.js`](file:///c:/Users/hardi/Hexa/client/src/utils/createTaskFilter.js)), Event Loop ([`EventLoopDemo.jsx`](file:///c:/Users/hardi/Hexa/client/src/pages/EventLoopDemo.jsx)), Hoisting & TDZ ([`HoistingDemo.jsx`](file:///c:/Users/hardi/Hexa/client/src/pages/HoistingDemo.jsx)), and Promises vs Callbacks ([`PromisesDemo.jsx`](file:///c:/Users/hardi/Hexa/client/src/pages/PromisesDemo.jsx)).

### 4. Database Management & Indexing Strategy
- **PostgreSQL Relational Schema**: Normalized tables in [`database/schema.sql`](file:///c:/Users/hardi/Hexa/database/schema.sql) (`users`, `projects`, `tasks`).
- **Primary & Foreign Key Constraints**: Enforces data integrity via `projects.owner_id REFERENCES users(id) ON DELETE CASCADE` and `tasks.project_id REFERENCES projects(id) ON DELETE CASCADE`.
- **B-Tree SQL Indexing**: Explicit B-Tree indexes (`idx_users_email`, `idx_projects_owner_id`, `idx_tasks_project_id`, `idx_tasks_status`) optimizing frequent SQL lookup and JOIN queries.
- **Relational JOIN Queries**: Implemented in [`server/src/repositories/taskRepository.js`](file:///c:/Users/hardi/Hexa/server/src/repositories/taskRepository.js#L17-L33).

### 5. Development Workflow & Automated Testing
- **Standardized Git Workflow**: Uses feature branches (`feature/viva-hardening`), atomic commits, and Pull Requests.
- **PR Documentation**: Enforces PR descriptions using [`.github/pull_request_template.md`](file:///c:/Users/hardi/Hexa/.github/pull_request_template.md).
- **Automated Testing**: Backend unit test suite in [`server/test/api.test.js`](file:///c:/Users/hardi/Hexa/server/test/api.test.js) verifying JWT generation/validation and environment loading.

---

## User Stories & Implementation Mapping

1. **User Authentication**: As a user, I can register and log in securely with bcryptjs hashed passwords.
2. **Client-Side Routing**: As a user, I can navigate between views seamlessly with SPA routing and route protection guards.
3. **Form Management**: As a user, I can create and edit tasks using controlled forms initialized with defaults or pre-populated data.
4. **Data Integrity**: As a developer, I can rely on PostgreSQL PK/FK constraints and B-Tree indexes for fast, consistent query execution.
5. **Viva Preparedness**: As an examiner/student, I can verify all 14 mandatory concepts against exact repository files and runnable demo pages.

---

## Technical Concept Coverage Matrix (All 14 Mandatory Concepts)

1. **HTTP Status Codes** (`200`, `201`, `204`, `400`, `401`, `404`, `409`, `500` in controllers)
2. **Environment Variables & Secrets** (`server/src/config/env.js`, `.env.example`, `.gitignore`)
3. **Git Workflow & PR Evidence** (`feature/viva-hardening`, `.github/pull_request_template.md`)
4. **Async API Fetching** (`client/src/api/projectApi.js`, `taskApi.js`)
5. **Client-Side Routing & Guard** (`client/src/App.jsx`, `ProtectedRoute.jsx`)
6. **JavaScript async/await & Promise.all** (`Dashboard.jsx`, API services)
7. **JavaScript Closures** (`client/src/utils/createTaskFilter.js`)
8. **JavaScript Event Loop** (`client/src/pages/EventLoopDemo.jsx`)
9. **JavaScript Hoisting & TDZ** (`client/src/pages/HoistingDemo.jsx`)
10. **Promises vs Callbacks** (`client/src/pages/PromisesDemo.jsx`)
11. **React Component Composition** (`client/src/components/EmptyState.jsx`)
12. **State Management (useState)** (`client/src/components/TaskForm.jsx`)
13. **PostgreSQL PK/FK Schema** (`database/schema.sql`, `taskRepository.js`)
14. **SQL Indexing Performance** (`database/schema.sql`, B-Tree indexes)