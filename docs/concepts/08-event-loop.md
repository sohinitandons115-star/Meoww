# Concept 8: JavaScript Event Loop

## Definition
The event loop is JavaScript's mechanism for handling asynchronous operations. It continuously checks the call stack and task queues, executing callbacks in a specific order: all microtasks first, then one macrotask.

## Implementation

### Files
- `client/src/demos/eventLoopDemo.js` - Demonstration code
- `client/src/pages/EventLoopDemo.jsx` - Interactive demo page
- `client/src/pages/HoistingDemo.jsx` - Shows related concepts

### Event Loop Demonstration

```javascript
// client/src/demos/eventLoopDemo.js

export function demonstrateEventLoop() {
  const executionOrder = [];
  
  // 1. Sync code - goes directly to call stack
  executionOrder.push('A');
  
  // 2. setTimeout - macrotask, goes to task queue
  setTimeout(() => {
    executionOrder.push('B');
  }, 0);
  
  // 3. Promise.then - microtask, goes to microtask queue
  Promise.resolve().then(() => {
    executionOrder.push('C');
  });
  
  // 4. More sync code
  executionOrder.push('D');
  
  return {
    // After event loop processes: A, D execute first
    // Then microtasks: C
    // Then macrotasks: B
    expectedOrder: 'A -> D -> C -> B'
  };
}
```

## Event Loop Phases

```
┌─────────────────────────────────────────────────────────────┐
│                     JAVASCRIPT RUNTIME                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌─────────────────┐                  │
│  │  CALL STACK  │────>│  EVENT LOOP     │                  │
│  │              │     │                 │                  │
│  │  1. A        │     │ Monitors call   │                  │
│  │  2. D        │     │ stack & queues  │                  │
│  └──────────────┘     └────────┬────────┘                  │
│                                │                           │
│                    ┌───────────┴───────────┐               │
│                    │                       │               │
│          ┌─────────▼─────────┐   ┌────────▼────────┐       │
│          │  MICROTASK QUEUE  │   │  TASK QUEUE     │       │
│          │  (high priority)  │   │ (macrotask)     │       │
│          │                   │   │                 │       │
│          │  • Promise.then   │   │  • setTimeout   │       │
│          │  • queueMicrotask │   │  • setInterval  │       │
│          │  • MutationObserver│  │  • I/O events   │       │
│          └───────────────────┘   └─────────────────┘       │
│                    │                       │               │
│                    └───────────┬───────────┘               │
│                                │                           │
│                    Event loop runs:                         │
│                    1. Execute ALL microtasks               │
│                    2. Execute ONE macrotask                │
│                    3. Repeat                              │
└─────────────────────────────────────────────────────────────┘
```

## Execution Order Example

```javascript
console.log('1');           // Call stack

setTimeout(() => {
  console.log('2');       // Task queue (macrotask)
}, 0);

Promise.resolve().then(() => {
  console.log('3');       // Microtask queue
});

console.log('4');           // Call stack

// Output: 1, 4, 3, 2
```

## Interactive Demo

Navigate to `/concepts/event-loop` to see:
- Code execution in real-time
- Explanation of each phase
- Interactive examples

## How to Demonstrate

1. Visit `/concepts/event-loop` page
2. Click "Run Basic Demo" button
3. See execution order: A → D → C → B
4. Explanation shows call stack → microtasks → macrotasks

## Key Points

1. **Call Stack**: Executes synchronous code immediately
2. **Microtask Queue**: Promise callbacks, queueMicrotask() - HIGH PRIORITY
3. **Task Queue**: setTimeout, setInterval - LOWER PRIORITY
4. **Event Loop**: Runs all microtasks, then ONE task, then repeats

## Viva Questions

**Q: Explain the call stack.**
A: A stack data structure that tracks function execution. Functions are pushed when called, popped when complete. Synchronous code executes immediately.

**Q: Explain the microtask queue.**
A: A queue for Promise callbacks that has higher priority than the task queue. All microtasks are executed before the next macrotask.

**Q: Why does Promise.then execute before setTimeout(..., 0)?**
A: Promise.then is a microtask, setTimeout is a macrotask. The event loop processes all microtasks before processing any macrotasks.

**Q: What is the output of the demo and why?**
A: A, D, C, B. A and D are sync (call stack), C is microtask (runs after sync), B is macrotask (runs after all microtasks).