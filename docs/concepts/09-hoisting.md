# Concept 9: JavaScript Hoisting

## Definition
Hoisting is JavaScript's behavior where variable and function declarations are moved to the top of their scope during the compilation phase. However, different declarations behave differently—some are fully hoisted, others are in the Temporal Dead Zone (TDZ).

## Implementation

### Files
- `client/src/demos/hoistingDemo.js` - Demonstration code
- `client/src/pages/HoistingDemo.jsx` - Interactive demo page

### var Hoisting

```javascript
// Before declaration
console.log(typeof hoistedVar); // 'undefined' - not error!
// This is because 'var hoistedVar' is hoisted with value undefined

var hoistedVar = 'Hexa';
console.log(hoistedVar); // 'Hexa'
```

### Function Declaration Hoisting

```javascript
// Can call function before declaration - fully hoisted!
console.log(declaredFunction()); // 'works!'

function declaredFunction() {
  return 'Function declaration works!';
}
```

### let and const - Temporal Dead Zone

```javascript
// IMPORTANT: let and const ARE hoisted
// They exist in lexical environment but cannot be accessed

// console.log(typeof tdzVar); // ReferenceError! In TDZ

let tdzVar = 'Now accessible';
console.log(tdzVar); // Works - after TDZ

// const also has TDZ
const tdzConst = 'Const value';
console.log(tdzConst); // Works - after TDZ
```

## Summary Table

| Type | Hoisted? | Initial Value | Use Before Declaration? |
|------|----------|---------------|------------------------|
| var | ✓ | undefined | ✓ (returns undefined) |
| function declaration | ✓ | entire function | ✓ |
| function expression | ✓ | undefined | ✗ (TypeError) |
| let | ✓ | uninitialized (TDZ) | ✗ (ReferenceError) |
| const | ✓ | uninitialized (TDZ) | ✗ (ReferenceError) |

## Important Clarification

**let and const ARE hoisted**—they're just in the Temporal Dead Zone (TDZ) until the declaration is reached. The TDZ exists to prevent bugs from accessing variables before they're initialized.

```javascript
// This is what happens conceptually:
{
  // TDZ starts for 'x'
  // x exists but cannot be accessed
  console.log(x); // ReferenceError
  
  let x = 10; // TDZ ends here
  console.log(x); // 10
}
```

## Interactive Demo

Navigate to `/concepts/hoisting` to see:
- var hoisting in action
- Function declaration hoisting
- Temporal Dead Zone behavior
- Summary comparison table

## How to Demonstrate

1. Visit `/concepts/hoisting` page
2. Click "Run var Demo" - shows typeof returns undefined
3. Click "Run Function Demo" - shows function works before declaration
4. Click "Show Summary Table" - shows all types compared

## Common Misconception

**Myth**: "let and const are not hoisted"
**Reality**: They ARE hoisted but remain uninitialized in the TDZ. Accessing them before declaration throws ReferenceError, not "variable doesn't exist."

## Viva Questions

**Q: What is hoisting?**
A: JavaScript's behavior of moving declarations to the top of their scope during compilation.

**Q: How does var behave?**
A: var declarations are hoisted with initial value undefined. Function-scoped.

**Q: How do function declarations behave?**
A: Fully hoisted—both the name and the function body are available throughout the scope.

**Q: What is the temporal dead zone?**
A: The period from the start of a block until the let/const declaration where the variable exists but cannot be accessed.

**Q: Are let and const hoisted?**
A: Yes, they are hoisted into their lexical environment but remain uninitialized (in TDZ) until the declaration is reached.