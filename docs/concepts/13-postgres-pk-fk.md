# Concept 13: PostgreSQL Relational Schema — PK/FK

## Definition
PostgreSQL is a relational database that uses Primary Keys (PK) to uniquely identify records and Foreign Keys (FK) to establish relationships between tables. This enables referential integrity and enables JOIN queries.

## Implementation

### Files
- `database/schema.sql` - Table definitions with PK/FK
- `database/seed.sql` - Sample data
- `server/src/repositories/taskRepository.js` - JOIN queries
- `server/src/repositories/projectRepository.js` - JOIN queries

### Schema Definition

```sql
-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,           -- Primary Key
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROJECTS TABLE
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,           -- Primary Key
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id),  -- Foreign Key
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASKS TABLE
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,           -- Primary Key
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    project_id INTEGER NOT NULL REFERENCES projects(id),  -- FK to projects
    created_by INTEGER NOT NULL REFERENCES users(id),     -- FK to users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships

```
users (PK: id)
  │
  ├── 1 ───────── N projects (FK: owner_id → users.id)
  │
  └── 1 ───────── N tasks (FK: created_by → users.id)
        │
        └── projects (PK: id)
              │
              └── 1 ───────── N tasks (FK: project_id → projects.id)
```

### JOIN Queries

```sql
-- Get all tasks with project and creator info
SELECT 
    t.id,
    t.title,
    t.status,
    p.name AS project_name,
    u.name AS created_by_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN users u ON t.created_by = u.id;
```

### Repository Implementation

```javascript
// server/src/repositories/taskRepository.js
async findAll() {
  const sql = `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.status,
      t.project_id,
      t.created_by,
      t.created_at,
      t.updated_at,
      p.name AS project_name,      -- From JOIN
      u.name AS created_by_name    -- From JOIN
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    JOIN users u ON t.created_by = u.id
    ORDER BY t.created_at DESC
  `;
  const result = await query(sql);
  return result.rows;
}
```

## Key Concepts

### Primary Key (PK)
- Uniquely identifies each row
- Cannot be null
- Auto-incremented with SERIAL
- Example: `id SERIAL PRIMARY KEY`

### Foreign Key (FK)
- References PK in another table
- Enforces referential integrity
- Prevents orphan records
- Example: `owner_id INTEGER REFERENCES users(id)`

### Referential Integrity
- FK ensures referenced record exists
- CASCADE: Delete related records automatically
- SET NULL: Set FK to NULL if referenced record deleted
- RESTRICT: Prevent deletion of referenced record

### Indexes
```sql
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
```

## How to Demonstrate

1. Check `database/schema.sql` - Shows PK/FK definitions
2. Check `server/src/repositories/taskRepository.js` - Shows JOIN
3. Visit Tasks page - See project_name and created_by_name (from JOINs)
4. Run seed data - See related data populated

## Database Queries in Action

```bash
# Connect to database
psql -d hexa

# Show tables
\dt

# Describe users table
\d users

# Query with JOINs
SELECT t.title, p.name as project, u.name as creator
FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN users u ON t.created_by = u.id
LIMIT 5;
```

## Viva Questions

**Q: What is a primary key?**
A: A column (or set of columns) that uniquely identifies each row in a table. Cannot be null and must be unique.

**Q: What is a foreign key?**
A: A column that references the primary key of another table, establishing a relationship between the two tables.

**Q: Explain users → projects.**
A: A user can own multiple projects. projects.owner_id references users.id (FK). This is a one-to-many relationship.

**Q: Explain projects → tasks.**
A: A project can have multiple tasks. tasks.project_id references projects.id (FK). This is a one-to-many relationship.

**Q: What is referential integrity?**
A: The guarantee that relationships between tables remain valid. Foreign keys ensure that referenced records actually exist.

**Q: Show me your JOIN query.**
A: In `taskRepository.js`, the findAll() method uses JOIN to get project_name and created_by_name along with task data.

**Q: What happens if project_id does not exist?**
A: If you try to insert a task with a non-existent project_id, PostgreSQL will reject the insert due to the foreign key constraint.