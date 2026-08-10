# Concept 6: JavaScript async/await

## Definition
async/await is syntactic sugar over Promises that allows writing asynchronous code in a more synchronous, readable style. An async function automatically returns a Promise, and await pauses execution until the Promise resolves.

## Implementation

### Files
- `client/src/api/taskApi.js` - All API functions
- `client/src/api/projectApi.js` - Project API
- `client/src/pages/*.jsx` - Used throughout

### Basic async/await

```javascript
// Async function to fetch tasks
export async function getTasks() {
  const response = await fetch('/api/tasks');
  
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  
  return response.json();
}

// Using the async function
async function loadTasks() {
  try {
    const tasks = await getTasks();
    console.log(tasks);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Parallel Requests

```javascript
// Using Promise.all for parallel execution
async function loadDashboard() {
  const [tasks, projects] = await Promise.all([
    getTasks(),
    getProjects()
  ]);
  
  return { tasks, projects };
}
```

### Sequential Execution

```javascript
// Await each request sequentially
async function fetchTaskDetails(taskId) {
  const task = await getTask(taskId);
  const project = await getProject(task.project_id);
  return { task, project };
}
```

## Key Concepts

### async Function
- Always returns a Promise
- Enables use of await keyword
- Can be used with .then() if needed

### await Keyword
- Pauses execution of async function
- Waits for Promise to resolve
- Does NOT block JavaScript runtime
- Can only be used inside async functions

### Error Handling
```javascript
// Try/catch for error handling
async function safeGetTasks() {
  try {
    const tasks = await getTasks();
    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Common Misconception

**Myth**: "await blocks JavaScript"
**Reality**: await only pauses the async function's execution. The JavaScript runtime can execute other code while waiting.

```javascript
async function demo() {
  console.log('1. Start');
  
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('2. After await'); // Runs after 1 second
  
  console.log('3. This also runs'); // Immediately after
}
```

## How to Demonstrate

1. Check `client/src/api/taskApi.js` - All functions use async/await
2. Create a task - See async flow
3. Check Network tab - Requests are async

## Viva Questions

**Q: What does async do?**
A: It marks a function as asynchronous, making it return a Promise automatically.

**Q: What does await do?**
A: It pauses execution of the async function until the awaited Promise resolves, without blocking the JavaScript runtime.

**Q: Does await block JavaScript?**
A: No! await only pauses the async function. Other JavaScript code can execute while waiting. The event loop continues processing.