# Low-Level Design (LLD)

## System Architecture
The application follows a three-tier architecture:
1. **Presentation Layer**: React-based frontend with client-side routing
2. **Application Layer**: Node.js/Express backend with RESTful API
3. **Data Layer**: PostgreSQL relational database

## Component Design

### Frontend Components
#### App Component
- Responsibilities:
  - Root component initializing React Router
  - Global state management (authentication state)
  - Layout structure (header, footer, main content)
- Interfaces:
  - Receives auth context via React Context API
  - Provides routing configuration to child components
- Data Models:
  - User object: {id, username, email, role, token}
  - Route configuration: {path, element, protected}
- Algorithms:
  - Route protection logic based on authentication status
  - Token refresh mechanism

#### API Service Layer
- Responsibilities:
  - Centralized HTTP request handling
  - Error handling based on HTTP status codes
  - Request/response interception
  - Async data fetching using async/await
- Interfaces:
  - Uses fetch API or axios for HTTP requests
  - Exposes methods: get, post, put, delete
- Data Models:
  - API response format: {data, status, error}
  - Request configuration: {url, method, headers, body}
- Algorithms:
  - Automatic JSON parsing/stringification
  - Status code handling (2xx success, 4xx client errors, 5xx server errors)
  - Retry logic for transient failures
  - Timeout handling
  - Promise vs callbacks implementation examples

#### State Management (useState & useContext)
- Responsibilities:
  - Managing local component state
  - Sharing global state across components
- Interfaces:
  - React useState hook for component-local state ([tasks, setTasks], [loading], [error] patterns)
  - React useContext for global state (auth, theme, etc.)
  - Custom hooks for reusable state logic
- Data Models:
  - Auth state: {user, token, isAuthenticated, loading}
  - Form state: {fieldValues, errors, isSubmitting}
  - UI state: {loading, modalOpen, sidebarCollapsed}
- Algorithms:
  - State update immutability patterns
  - Derived state computation
  - Performance optimization with useMemo/useCallback
  - Closures implementation (createTaskFilter.js)

### Backend Components
#### Express Server
- Responsibilities:
  - HTTP request routing
  - Middleware configuration (cors, helmet, body-parser)
  - Error handling middleware
- Interfaces:
  - RESTful API endpoints
  - Database connection pooling
  - Environment variable configuration
- Data Models:
  - Request objects: params, query, body, headers
  - Response objects: status, json, send
- Algorithms:
  - Middleware execution chain
  - Route parameter validation
  - Async error handling with try/catch or express-async-handler
  - HTTP status code usage (200, 201, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504)

#### Controller Layer
- Responsibilities:
  - Handling HTTP requests and responses
  - Business logic orchestration
  - Input validation and sanitization
- Interfaces:
  - Receives requests from routes
  - Calls service layer for business logic
  - Returns formatted responses
- Data Models:
  - Request DTOs (Data Transfer Objects)
  - Response DTOs
  - Validation schemas
- Algorithms:
  - Request validation (Joi, Yup, or custom)
  - Data transformation between layers
  - Error mapping and formatting

#### Service Layer
- Responsibilities:
  - Implementing business logic
  - Data access orchestration
  - Transaction management
- Interfaces:
  - Receives requests from controllers
  - Calls repository layer for data operations
  - Integrates with external services/APIs
- Data Models:
  - Business entities (User, Product, Order, etc.)
  - Domain-specific value objects
- Algorithms:
  - Complex business rule implementation
  - Data validation and enrichment
  - Transaction boundary management
  - External API integration with circuit breaker pattern

#### Repository Layer
- Responsibilities:
  - Database operations abstraction
  - SQL query execution
  - Connection management
- Interfaces:
  - Uses pg (PostgreSQL) library or ORM (Sequelize/TypeORM)
  - Provides CRUD operations
  - Handles database connections and pooling
- Data Models:
  - Database entity mappings
  - Query parameters and options
- Algorithms:
  - SQL query generation and execution
  - Connection pooling management
  - Transaction handling
  - Result mapping to domain objects
  - JOIN queries demonstrating PK/FK relationships

### Database Design
#### PostgreSQL Schema
- **Users Table**
  - id (SERIAL PRIMARY KEY)
  - username (VARCHAR(50) UNIQUE NOT NULL)
  - email (VARCHAR(100) UNIQUE NOT NULL)
  - password_hash (VARCHAR(255) NOT NULL)
  - role (VARCHAR(20) NOT NULL)
  - created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

- **Sessions Table** (for JWT refresh tokens or session tracking)
  - id (SERIAL PRIMARY KEY)
  - user_id (INTEGER REFERENCES users(id) ON DELETE CASCADE)
  - token (VARCHAR(255) UNIQUE NOT NULL)
  - expires_at (TIMESTAMP NOT NULL)
  - created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

- **Tasks Table** (example demonstrating PK/FK)
  - id (SERIAL PRIMARY KEY)
  - title (VARCHAR(200) NOT NULL)
  - description (TEXT)
  - user_id (INTEGER REFERENCES users(id) ON DELETE CASCADE)
  - project_id (INTEGER REFERENCES projects(id) ON DELETE SET NULL)
  - status (VARCHAR(50) DEFAULT 'todo')
  - priority (VARCHAR(20) DEFAULT 'medium')
  - created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

- **Projects Table** (example demonstrating PK/FK)
  - id (SERIAL PRIMARY KEY)
  - name (VARCHAR(100) NOT NULL)
  - description (TEXT)
  - user_id (INTEGER REFERENCES users(id) ON DELETE CASCADE)
  - created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  - updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

#### Indexes
- Primary keys on id columns
- Unique indexes on username, email
- Foreign key indexes for join performance
- Composite indexes for common query patterns

#### Constraints
- NOT NULL constraints on required fields
- CHECK constraints for data validation (e.g., role values, status values)
- Referential integrity through foreign keys
- Cascade rules for related data deletion

## API Specifications
### Authentication Endpoints
- POST /api/auth/login
  - Request: {username, password}
  - Success Response (200): {token, user}
  - Error Responses:
    - 400: Invalid request format
    - 401: Invalid credentials
    - 500: Server error

- POST /api/auth/logout
  - Request: {token} (in Authorization header)
  - Success Response (200): {message}
  - Error Responses:
    - 401: Invalid/missing token
    - 500: Server error

### Resource Endpoints (example: /api/tasks)
- GET /api/tasks
  - Success Response (200): [Task array with user and project data]
  - Error Responses:
    - 401: Unauthorized
    - 403: Forbidden (insufficient permissions)
    - 500: Server error

- GET /api/tasks/:id
  - Success Response (200): Task object with populated user and project
  - Error Responses:
    - 400: Invalid ID format
    - 401: Unauthorized
    - 403: Forbidden
    - 404: Task not found
    - 500: Server error

- POST /api/tasks
  - Request: Task creation object
  - Success Response (201): Created task object
  - Error Responses:
    - 400: Validation errors
    - 401: Unauthorized
    - 403: Forbidden
    - 409: Conflict (duplicate constraints)
    - 500: Server error

- PUT /api/tasks/:id
  - Request: Task update object
  - Success Response (200): Updated task object
  - Error Responses:
    - 400: Validation errors or invalid ID
    - 401: Unauthorized
    - 403: Forbidden
    - 404: Task not found
    - 500: Server error

- DELETE /api/tasks/:id
  - Success Response (200): {message}
  - Error Responses:
    - 400: Invalid ID format
    - 401: Unauthorized
    - 403: Forbidden
    - 404: Task not found
    - 500: Server error

#### HTTP Status Code Usage
- 200: Successful GET, PUT, PATCH requests
- 201: Successful POST request (resource created)
- 204: Successful DELETE request (no content)
- 400: Bad request (client error - validation, malformed data)
- 401: Unauthorized (missing or invalid authentication)
- 403: Forbidden (authenticated but insufficient permissions)
- 404: Not found (resource doesn't exist)
- 409: Conflict (resource conflict - duplicate unique values)
- 422: Unprocessable Entity (semantic errors)
- 429: Too Many Requests (rate limiting)
- 500: Internal server error
- 502: Bad gateway (external service error)
- 503: Service unavailable (temporary overload/maintenance)
- 504: Gateway timeout (external service timeout)

## Security Considerations
### Authentication & Authorization
- JWT-based authentication with HttpOnly cookies for refresh tokens
- Password hashing using bcrypt (salt rounds ≥12)
- Role-based access control (RBAC) implementation
- Session expiration and refresh token rotation
- Account lockout after failed login attempts

### Data Protection
- Environment variables for secrets (DB credentials, JWT secrets, API keys)
- Never commit secrets to version control (.gitignore protection)
- HTTPS enforcement in production
- Input validation and sanitization (XSS, SQL injection prevention)
- CORS policy configuration
- Security headers (Helmet.js: XSS, CSP, HSTS, etc.)
- Rate limiting to prevent brute force attacks

### Database Security
- Parameterized queries to prevent SQL injection
- Principle of least privilege database user
- Regular backups and point-in-time recovery
- Connection pooling with proper timeout settings
- SSL/TLS for database connections in production

## Performance Requirements
### Frontend Performance
- Code splitting and lazy loading of routes
- Bundle optimization (tree shaking, minification)
- Efficient state updates to prevent unnecessary renders
- Memoization of expensive computations (useMemo, useCallback)
- Virtual scrolling for large lists
- Image optimization and lazy loading

### Backend Performance
- Database connection pooling
- Query optimization and indexing
- Caching layer (Redis) for frequently accessed data
- Pagination for large dataset endpoints
- Response compression (gzip)
- CDN for static assets
- Load balancing and horizontal scaling

### API Performance
- Target response time: <200ms for 95% of requests
- Throughput: Minimum 100 requests/second per instance
- Concurrent users: Support for 1000+ simultaneous users
- Database connection pool sizing based on expected load

## Monitoring & Logging
- Structured logging with correlation IDs
- Error tracking and alerting (Sentry, LogRocket)
- Performance monitoring (APM tools)
- Health check endpoints
- Metrics collection (request latency, error rates, throughput)

## Concept Implementation Mapping
This LLD implements the following concepts:
1. **HTTP Status Codes**: Comprehensive usage in API endpoints and error handling
2. **Environment Variables**: Configuration management through .env files
3. **Git Workflow**: Standard branching, PR process, and collaboration patterns
4. **Async API Fetching**: axios/fetch with async/await in service layer
5. **Client-Side Routing**: React Router v6 in App component
6. **async/await**: Used throughout API service layer and repository methods
7. **Closures**: Implemented in custom hooks like createTaskFilter.js
8. **Event Loop**: Understood in Node.js non-blocking I/O operations
9. **Hoisting**: Awareness in JavaScript variable/function declarations
10. **Promises vs Callbacks**: Examples in API service layer demonstrating both patterns
11. **React Composition**: Component hierarchy Layout > Navbar > PageContainer > TaskList > TaskCard
12. **useState**: State management pattern [tasks, setTasks], [loading], [error]
13. **PostgreSQL PK/FK**: Schema design with proper primary/foreign key relationships and JOIN queries