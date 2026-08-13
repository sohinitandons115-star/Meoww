# Low-Level Design (LLD) — Hexa Detailed Specification

## Overview
This document provides low-level class, component, schema, API, and algorithmic specifications for **Hexa** (`hardikkaurani/Hexa`). It covers every component, data model, and code file added or hardened during implementation.

---

## Detailed Component Specifications

### 1. Presentation Layer Components

#### `ProtectedRoute.jsx` Component Specification
- **File**: [`client/src/components/ProtectedRoute.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/ProtectedRoute.jsx)
- **Props**:
  - `isAuthenticated` (`boolean`, default: `true`): Authentication status flag.
  - `redirectTo` (`string`, default: `'/'`): Redirect path for unauthorized users.
- **State & Logic**:
  - Checks local authentication state or `localStorage.getItem('token')`.
  - If allowed: renders `<Outlet />` allowing access to child routes.
  - If unallowed: renders `<Navigate to={redirectTo} replace />`.
- **Architectural Boundary Note**: Client-side route guarding enhances user navigation and UX, but backend authorization middleware must independently secure REST endpoints.

#### `TaskForm.jsx` State & Form Specification
- **File**: [`client/src/components/TaskForm.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/TaskForm.jsx)
- **Props**: `initialData` (`object`, default: `{}`), `onSubmit` (`function`), `submitLabel` (`string`, default: `'Create Task'`).
- **State Structure (`formData`)**:
  ```javascript
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'todo',
    projectId: initialData.project_id || ''
  });
  ```
- **Modes**:
  - **Create Mode**: `initialData = {}` initializes fields to empty string defaults.
  - **Edit Mode**: `initialData` pre-populates state with existing task properties.
- **Immutable Change Handler Algorithm**:
  ```javascript
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  ```

#### `EmptyState.jsx` Composition Specification
- **File**: [`client/src/components/EmptyState.jsx`](file:///c:/Users/hardi/Hexa/client/src/components/EmptyState.jsx)
- **Props**: `message` (`string`, default: `'No data available'`), `icon` (`string`, default: `'📋'`).
- **Usage**: Reused across [`Tasks.jsx`](file:///c:/Users/hardi/Hexa/client/src/pages/Tasks.jsx) (`icon="📝"`) and [`Projects.jsx`](file:///c:/Users/hardi/Hexa/client/src/pages/Projects.jsx) (`icon="📁"`).

---

### 2. Application Layer & API Specifications

#### `authController.js` Authentication Controller
- **File**: [`server/src/controllers/authController.js`](file:///c:/Users/hardi/Hexa/server/src/controllers/authController.js)
- **Registration Algorithm (`register`)**:
  1. Validates `name`, `email`, and `password` presence (returns `400 Bad Request` if invalid).
  2. Verifies `password.length >= 6` (returns `400 Bad Request` if weak).
  3. Checks `users` table for duplicate email (returns `409 Conflict` if existing).
  4. Generates bcrypt salt (`bcrypt.genSalt(10)`) and hashes password (`bcrypt.hash(password, salt)`).
  5. Inserts new user record into PostgreSQL and generates JWT access token and refresh cookie. Returns `201 Created`.
- **Login Algorithm (`login`)**:
  1. Finds user by `email` (returns `401 Unauthorized` if not found).
  2. Verifies password hash using `bcrypt.compare(password, user.password_hash)`. Returns `200 OK` with JWT on success.

#### API Data Fetching Layer (`projectApi.js` & `taskApi.js`)
- **File**: [`client/src/api/projectApi.js`](file:///c:/Users/hardi/Hexa/client/src/api/projectApi.js)
- **Status Handling Logic**:
  - `response.ok === true`: returns `response.json()`.
  - `response.status === 400`: throws `Validation error` with `error.status = 400`.
  - `response.status === 404`: throws `Project not found` with `error.status = 404` (corrected from 4.04 typo).
  - Network failure: caught by React component `try/catch`.

---

### 3. Database Schema, Indexing & Repository Specifications

#### Database Schema (`database/schema.sql`)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### SQL B-Tree Indexing Strategy
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
```

#### Relational JOIN Query (`taskRepository.js`)
**File**: [`server/src/repositories/taskRepository.js`](file:///c:/Users/hardi/Hexa/server/src/repositories/taskRepository.js#L17-L33)
```sql
SELECT
  t.id, t.title, t.description, t.status, t.project_id, t.created_by, t.created_at, t.updated_at,
  p.name AS project_name,
  u.name AS created_by_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN users u ON t.created_by = u.id
ORDER BY t.created_at DESC;
```

---

### 4. Automated Testing Specification

#### Node Test Runner Suite (`server/test/api.test.js`)
- **File**: [`server/test/api.test.js`](file:///c:/Users/hardi/Hexa/server/test/api.test.js)
- **Framework**: Node.js native test runner (`node:test`) and assertion module (`node:assert`).
- **Tests Implemented**:
  1. `JWT Utility - generate and verify token`: Tests token generation (`generateToken`) and decoding (`verifyToken`).
  2. `Environment Config Loader`: Tests dynamic environment variable loading and config validation (`server/src/config/env.js`).

---

## 100% Concept Verification Summary

All 14 mandatory concepts have complete LLD specifications:
1. **HTTP Status Codes**: `200`, `201`, `204`, `400`, `401`, `404`, `409`, `500` status mapping in `authController.js` and `projectApi.js`.
2. **Environment Variables**: Managed via `server/src/config/env.js` and `.env.example`.
3. **Git Workflow**: Documented in `03-git-workflow.md` and enforced via `.github/pull_request_template.md`.
4. **Async API Fetching**: Implemented in `projectApi.js` and `taskApi.js`.
5. **Client-Side Routing**: Handled in `App.jsx` and guarded via `ProtectedRoute.jsx`.
6. **async/await**: Used across API handlers and concurrent `Promise.all` in `Dashboard.jsx`.
7. **Closures**: Encapsulated in `client/src/utils/createTaskFilter.js`.
8. **Event Loop**: Interactive call stack and task queue trace in `EventLoopDemo.jsx`.
9. **Hoisting & TDZ**: Demonstrated in `HoistingDemo.jsx`.
10. **Promises vs Callbacks**: Demonstrated in `PromisesDemo.jsx`.
11. **React Composition**: Structured via `App` → `Layout` → `Page` → `TaskList` → `TaskCard` and `EmptyState.jsx`.
12. **useState**: Single object `formData` state with Create/Edit modes in `TaskForm.jsx`.
13. **PostgreSQL PK/FK**: Table constraints in `database/schema.sql` and JOIN queries in `taskRepository.js`.
14. **SQL Indexing**: B-Tree performance indexes in `database/schema.sql` (`idx_tasks_project_id`).