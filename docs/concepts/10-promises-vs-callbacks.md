# Concept 10: JavaScript Promises vs Callbacks

## Definition
Callbacks were the original pattern for handling async operations. Promises wrap callbacks in an object with better composability. async/await is syntactic sugar over Promises that looks like synchronous code.

## Implementation

### Files
- `client/src/demos/promisesVsCallbacks.js` - Demonstration code
- `client/src/pages/PromisesDemo.jsx` - Interactive demo page

### Callback Pattern

```javascript
// Error-first callback convention
function loadDataWithCallback(callback) {
  setTimeout(() => {
    const data = { id: 1, title: 'Task' };
    callback(null, data); // callback(error, data)
  }, 100);
}

// Usage - callback hell with nesting
loadDataWithCallback((error, data) => {
  if (error) {
    handleError(error);
    return;
  }
  loadMoreData((error2, moreData) => {
    if (error2) {
      handleError(error2);
      return;
    }
    // Nested further...
  });
});
```

### Promise Pattern

```javascript
// Wrap callback in Promise
function loadDataWithPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, title: 'Task' };
      resolve(data);
      // or reject(new Error('Failed'))
    }, 100);
  });
}

// Usage - chainable
loadDataWithPromise()
  .then(data => {
    console.log(data);
    return loadMoreData();
  })
  .then(moreData => {
    console.log(moreData);
  })
  .catch(error => {
    handleError(error);
  });
```

### async/await Pattern

```javascript
// Async/await - most readable
async function loadData() {
  try {
    const data = await loadDataWithPromise();
    const moreData = await loadMoreData();
    return { data, moreData };
  } catch (error) {
    handleError(error);
  }
}
```

## Comparison

| Aspect | Callbacks | Promises | async/await |
|--------|-----------|----------|-------------|
| Pattern | error-first | .then().catch() | try/catch |
| Error handling | Scattered in each callback | Centralized with .catch() | try/catch blocks |
| Chaining | Nested callbacks (hell) | Chainable .then() | Sequential await |
| Readability | Decreases with nesting | Better | Like sync code |
| Parallel execution | Manual | Promise.all() | Promise.all() + await |

## Interactive Demo

Navigate to `/concepts/promises` to see:
- Live callback vs Promise vs async/await demos
- Chaining comparison
- Comparison table

## How to Demonstrate

1. Visit `/concepts/promises` page
2. Click each demo button to see patterns
3. See "Chaining Demos" shows callback hell vs Promise vs async
4. Compare patterns in table

## Key Takeaways

1. **Callbacks**: Original pattern, error-first, leads to callback hell
2. **Promises**: Better composability, chainable, unified error handling
3. **async/await**: Most readable, synchronous-looking, built on Promises

## Viva Questions

**Q: What is a callback?**
A: A function passed as an argument to another function, to be executed later when an async operation completes.

**Q: What is a Promise?**
A: An object representing the eventual completion or failure of an async operation, with states: pending, fulfilled, rejected.

**Q: What are Promise states?**
A: pending (initial), fulfilled (success), rejected (failure). Once settled, a Promise cannot change state.

**Q: Why are Promises easier to compose?**
A: They have chainable .then() and .catch() methods, plus utilities like Promise.all() for parallel operations.

**Q: How does async/await relate to Promises?**
A: async/await is syntactic sugar over Promises. await pauses execution until a Promise resolves, making async code look synchronous.