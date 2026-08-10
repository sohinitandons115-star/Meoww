# Concept 5: Client-Side Routing

## Definition
Client-side routing enables Single Page Application (SPA) behavior where navigation between pages happens without full page reloads. The browser URL changes and content updates dynamically using JavaScript.

## Implementation

### Files
- `client/src/App.jsx` - Route definitions
- `client/src/components/Navbar.jsx` - Navigation links
- `client/vite.config.js` - Dev server proxy

### React Router Setup

```javascript
// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import TaskDetails from './pages/TaskDetails.jsx';
import CreateTask from './pages/CreateTask.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import Concepts from './pages/Concepts.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/new" element={<CreateTask />} />
          <Route path="tasks/:id" element={<TaskDetails />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="concepts" element={<Concepts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Navigation Components

```javascript
// client/src/components/Navbar.jsx
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/tasks">Tasks</NavLink>
      <NavLink to="/projects">Projects</NavLink>
      <NavLink to="/concepts">Concepts</NavLink>
    </nav>
  );
}
```

### Using Dynamic Parameters

```javascript
// client/src/pages/TaskDetails.jsx
import { useParams } from 'react-router-dom';

function TaskDetails() {
  const { id } = useParams(); // Gets :id from URL
  
  // Fetch task using id...
  return <div>Task ID: {id}</div>;
}
```

### Using Navigation

```javascript
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const navigate = useNavigate();
  
  const handleSubmit = async (data) => {
    await createTask(data);
    navigate('/tasks'); // Redirect after success
  };
  
  return <TaskForm onSubmit={handleSubmit} />;
}
```

## Routes Defined

| Path | Component | Description |
|------|-----------|-------------|
| / | Dashboard | Main overview |
| /tasks | Tasks | Task list with filtering |
| /tasks/new | CreateTask | Create new task form |
| /tasks/:id | TaskDetails | View/edit task |
| /projects | Projects | Project list |
| /projects/:id | ProjectDetails | View project with tasks |
| /concepts | Concepts | Concept demonstration center |

## How to Demonstrate

1. Click navigation links - Notice no page reload
2. Check URL changes - Updates to /tasks, /projects, etc.
3. Use browser back/forward - Works correctly
4. Open DevTools - No network requests for page navigation

## Viva Questions

**Q: What is client-side routing?**
A: Navigation that happens entirely in the browser using JavaScript, without requesting new HTML pages from the server.

**Q: How does React Router work?**
A: It uses the History API to change the URL and renders different components based on the route definition, all without page reload.

**Q: What is the difference between Link and NavLink?**
A: NavLink automatically gets an "active" class when its path matches the current URL, useful for styling navigation items.