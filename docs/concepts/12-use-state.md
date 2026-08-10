# Concept 12: React State Management with useState

## Definition
useState is a React Hook that allows functional components to have local state. It returns a stateful value and a function to update it, triggering re-renders when the state changes.

## Implementation

### Files
- `client/src/pages/Dashboard.jsx` - Multiple state variables
- `client/src/pages/Tasks.jsx` - Filter state + functional updates
- `client/src/pages/TaskDetails.jsx` - Form state
- `client/src/components/TaskForm.jsx` - Controlled inputs

### Basic useState

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Multiple State Variables

```javascript
// client/src/pages/Dashboard.jsx
function Dashboard() {
  const [tasks, setTasks] = useState([]);       // Data
  const [projects, setProjects] = useState([]); // Data
  const [loading, setLoading] = useState(true); // UI state
  const [error, setError] = useState(null);     // Error state
  
  // ... fetch and update
}
```

### Functional Updates

```javascript
// Important: use functional update when prev state matters
function Tasks() {
  const [tasks, setTasks] = useState([]);
  
  // WRONG: tasks.push() mutates directly
  // setTasks([...tasks, newTask]);
  
  // CORRECT: functional update
  const addTask = (newTask) => {
    setTasks(prev => [...prev, newTask]); // prev is current state
  };
  
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
}
```

### Controlled Inputs

```javascript
// TaskForm.jsx - controlled inputs with useState
function TaskForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'todo'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="title" 
        value={formData.title} 
        onChange={handleChange} 
      />
      <textarea 
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
      />
    </form>
  );
}
```

### State with Filtering

```javascript
// client/src/pages/Tasks.jsx
function Tasks() {
  const [tasks, setTasks] = useState([]);      // All tasks
  const [filteredTasks, setFilteredTasks] = useState([]); // Displayed
  const [statusFilter, setStatusFilter] = useState('all'); // Filter
  
  // Apply filter when status changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(t => t.status === statusFilter));
    }
  }, [statusFilter, tasks]);
  
  return (
    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
      <option value="all">All</option>
      <option value="completed">Completed</option>
    </select>
  );
}
```

## Key Points

1. **Never mutate state directly** - Use setState functions
2. **Use functional updates** - When previous state is needed
3. **Controlled inputs** - Value from state, onChange updates state
4. **Trigger re-renders** - setState triggers component re-render

## Common Mistakes

❌ Wrong:
```javascript
tasks.push(newTask);
setTasks(tasks);
```

✅ Correct:
```javascript
setTasks(prev => [...prev, newTask]);
```

## How to Demonstrate

1. Go to Tasks page
2. Change filter - state updates, UI re-renders
3. Create task - new task appears (state update)
4. Delete task - task removed (state update)

## Viva Questions

**Q: What is state?**
A: Data that changes over time in a component, stored with useState, that triggers re-renders when updated.

**Q: What does the setter do?**
A: It updates the state value and triggers React to re-render the component with the new state.

**Q: Why should state not be mutated directly?**
A: React relies on state changes to detect updates and trigger re-renders. Direct mutation won't trigger re-renders and breaks React's internal tracking.

**Q: When would you use a functional state update?**
A: When the new state depends on the previous state. Using the functional form ensures you're working with the most current state value.