# Concept 4: Async Data Fetching from API

## Definition
Async data fetching is the process of requesting data from a server without blocking the user interface. The frontend makes HTTP requests to the backend API and handles responses asynchronously using JavaScript's async capabilities.

## Implementation

### Files
- `client/src/api/taskApi.js` - Task API functions
- `client/src/api/projectApi.js` - Project API functions
- `client/src/pages/Tasks.jsx` - Using async data
- `server/src/routes/taskRoutes.js` - Backend routes

### API Layer (Client)

```javascript
// client/src/api/taskApi.js

// Get all tasks - async/await pattern
export async function getTasks() {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    const error = new Error('Failed to fetch tasks');
    error.status = response.status;
    throw error;
  }
  return response.json();
}

// Create task - POST returns 201
export async function createTask(taskData) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  
  if (!response.ok) {
    if (response.status === 400) {
      const errorData = await response.json();
      const error = new Error(errorData.error?.message || 'Validation error');
      error.status = 400;
      throw error;
    }
  }
  return response.json();
}
```

### Using in React Components

```javascript
// client/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { getTasks } from '../api/taskApi.js';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Render based on state
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  return <TaskList tasks={tasks} />;
}
```

## Request Lifecycle

```
React Component
      │
      ▼
API Function (taskApi.js)
      │
      ▼
fetch('/api/tasks')
      │
      ▼
Express Route (taskRoutes.js)
      │
      ▼
Controller (taskController.js)
      │
      ▼
Service (taskService.js)
      │
      ▼
Repository (taskRepository.js)
      │
      ▼
PostgreSQL Database
      │
      ▼
Response flows back
      │
      ▼
React State (useState)
      │
      ▼
UI Update
```

## Error Handling

The implementation handles:
- **Loading state**: While fetch is in progress
- **Success state**: Data received successfully
- **Error state**: Network or server errors
- **HTTP errors**: 400, 404, 500 responses

## How to Demonstrate

1. Open browser DevTools → Network tab
2. Navigate to Tasks page
3. Observe: GET /api/tasks request
4. See: 200 OK response with JSON data
5. Create a task: POST /api/tasks → 201
6. Delete a task: DELETE → 204

## Viva Questions

**Q: Why is fetch asynchronous?**
A: Network requests take variable time. Async allows the UI to remain responsive while waiting for the server response.

**Q: How do you handle API failure?**
A: Check response.ok, throw errors with meaningful messages, catch in components, update error state to show user-friendly message.

**Q: Where is loading state stored?**
A: In React state using useState hook (e.g., `const [loading, setLoading] = useState(true)`)