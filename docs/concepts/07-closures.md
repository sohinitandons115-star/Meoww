# Concept 7: JavaScript Closures

## Definition
A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has finished executing. The inner function "closes over" the variables it needs from its lexical environment.

## Implementation

### Files
- `client/src/utils/createTaskFilter.js` - Real closure usage
- `client/src/pages/Tasks.jsx` - Uses closure-based filtering

### Closure Example

```javascript
// client/src/utils/createTaskFilter.js

// Outer function creates and returns a closure
export function createTaskFilter(status) {
  // 'status' is captured in the closure's lexical environment
  // This variable remains accessible even after createTaskFilter returns
  
  return function filterTasks(tasks) {
    // This inner function is the closure
    // It has access to 'status' from its outer scope
    return tasks.filter(task => task.status === status);
  };
}

// Usage demonstrating closure
const completedFilter = createTaskFilter('completed');
const todoFilter = createTaskFilter('todo');

const tasks = [
  { id: 1, title: 'Task 1', status: 'completed' },
  { id: 2, title: 'Task 2', status: 'todo' },
  { id: 3, title: 'Task 3', status: 'completed' }
];

completedFilter(tasks);  // Returns tasks with status 'completed'
todoFilter(tasks);       // Returns tasks with status 'todo'

// Each filter function has its OWN captured 'status' variable
```

### More Complex Closure

```javascript
// Closure with multiple captured variables
export function createAdvancedFilter(options) {
  const { status, projectId, searchTerm } = options;
  
  // This function closes over status, projectId, and searchTerm
  return function advancedFilter(tasks) {
    return tasks.filter(task => {
      let matches = true;
      
      if (status && task.status !== status) matches = false;
      if (projectId && task.project_id !== projectId) matches = false;
      if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        matches = false;
      }
      
      return matches;
    });
  };
}
```

### Used in React Component

```javascript
// client/src/pages/Tasks.jsx
import { createTaskFilter } from '../utils/createTaskFilter.js';

function Tasks() {
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Apply filter - closure captures statusFilter
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      // createTaskFilter returns a closure that captures statusFilter
      const filter = createTaskFilter(statusFilter);
      setFilteredTasks(filter(tasks));
    }
  }, [statusFilter, tasks]);
}
```

## How Closures Work

```
1. createTaskFilter('completed') is called
2. Outer function creates local variable: status = 'completed'
3. Inner function (filterTasks) is defined and returned
4. createTaskFilter finishes and returns
5. BUT the returned function still has access to 'status'
6. When filterTasks(tasks) is called later, it can still access 'status'
```

## Why Closures Matter

1. **Data privacy** - Create private variables
2. **Function factories** - Generate specialized functions
3. **Event handlers** - Retain state at definition time
4. **Callbacks** - Maintain context

## How to Demonstrate

1. Navigate to Tasks page
2. Filter by status (To Do, In Progress, Completed)
3. The filter function uses a closure that captures the status value
4. Check `client/src/utils/createTaskFilter.js`

## Viva Questions

**Q: What is a closure?**
A: A function that has access to variables from its outer scope even after the outer function has returned.

**Q: Show me the closure in your repository.**
A: In `client/src/utils/createTaskFilter.js`, the `filterTasks` function is a closure that captures the `status` variable from `createTaskFilter`.

**Q: What variable is captured?**
A: The `status` parameter is captured. Even after `createTaskFilter` finishes executing, the returned function can still access `status`.

**Q: Why is the captured variable still accessible?**
A: Because the closure maintains a reference to its lexical environment where `status` exists. It doesn't copy the value—it keeps the scope alive.