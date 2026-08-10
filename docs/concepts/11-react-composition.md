# Concept 11: React Component Composition

## Definition
Component composition is the pattern of building complex UIs by combining smaller, reusable components. Components accept props (including children) and render smaller pieces that together form the complete UI.

## Implementation

### Files
- `client/src/components/Layout.jsx` - Container component
- `client/src/components/Navbar.jsx` - Navigation
- `client/src/components/PageContainer.jsx` - Page wrapper with children
- `client/src/components/TaskList.jsx` - List container
- `client/src/components/TaskCard.jsx` - Individual item
- `client/src/App.jsx` - Root composition

### Composition Hierarchy

```
App
 └── Layout
      ├── Navbar
      └── PageContainer
           └── (children from route)
                └── Dashboard
                     ├── StatsGrid
                     │    └── StatCard (×4)
                     ├── QuickActions
                     ├── RecentTasks
                     │    └── TasksTable
                     └── ProjectsGrid
                          └── ProjectCard (×N)
```

### Using children Prop

```javascript
// PageContainer.jsx - wraps children
function PageContainer({ children, title, subtitle }) {
  return (
    <div className="page-container">
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
      <div className="page-content">
        {children}  {/* Content passed from parent */}
      </div>
    </div>
  );
}

// Usage in Dashboard.jsx
function Dashboard() {
  return (
    <PageContainer title="Dashboard" subtitle="Welcome to Hexa">
      <StatsGrid />
      <TaskList />
    </PageContainer>
  );
}
```

### Reusable Components

```javascript
// TaskList.jsx - reusable list component
function TaskList({ tasks, emptyMessage = 'No tasks found' }) {
  if (!tasks || tasks.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

// TaskCard.jsx - individual task display
function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <StatusBadge status={task.status} />
      <p>{task.description}</p>
    </div>
  );
}
```

### Benefits of Composition

1. **Reusability**: Same component used in different places
2. **Separation of concerns**: Each component has single responsibility
3. **Maintainability**: Changes localized to specific components
4. **Testability**: Test components in isolation
5. **Readability**: Clear structure shows UI hierarchy

## Why Not Put Everything in App.jsx?

- Hard to understand
- Difficult to maintain
- Can't reuse logic or UI
- Testing becomes complex
- Violates single responsibility principle

## How to Demonstrate

1. Check `client/src/components/` - all reusable components
2. Check `App.jsx` - route composition
3. See Layout > Navbar + PageContainer structure
4. See TaskList > TaskCard structure

## Viva Questions

**Q: What is component composition?**
A: Building UIs by combining smaller, focused components together, passing data through props and using children for content.

**Q: Why not put everything inside App.jsx?**
A: It becomes hard to understand, maintain, test, and reuse. Components should have single responsibilities.

**Q: What is children?**
A: A special prop that contains the content passed between component opening and closing tags, like `<PageContainer><Content /></PageContainer>`.