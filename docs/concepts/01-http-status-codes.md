# Concept 1: HTTP Status Codes

## Definition
HTTP status codes are three-digit responses sent by a server to indicate the outcome of a client's request. They are part of the HTTP specification and provide standardized information about request success or failure.

## Implementation

### Files
- `server/src/routes/taskRoutes.js` - API route definitions
- `server/src/controllers/taskController.js` - HTTP response handling
- `server/src/middleware/errorHandler.js` - Centralized error responses
- `server/src/services/taskService.js` - Business logic throwing appropriate errors

### Status Codes Used

| Endpoint | Method | Success Code | Scenario |
|----------|--------|--------------|----------|
| /api/tasks | GET | 200 OK | Successfully retrieved task list |
| /api/tasks/:id | GET | 200 OK | Successfully retrieved single task |
| /api/tasks | POST | 201 Created | Successfully created new task |
| /api/tasks/:id | PUT | 200 OK | Successfully updated task |
| /api/tasks/:id | DELETE | 204 No Content | Successfully deleted task |
| /api/tasks | POST | 400 Bad Request | Invalid input data |
| /api/tasks/:id | GET | 404 Not Found | Task doesn't exist |
| /api/tasks/:id | PUT | 404 Not Found | Task to update doesn't exist |
| /api/tasks/:id | DELETE | 404 Not Found | Task to delete doesn't exist |
| * | * | 500 Internal Server Error | Unexpected server error |

## Example Responses

### 200 OK
```json
{
  "id": 1,
  "title": "Build API",
  "status": "completed"
}
```

### 201 Created
```json
{
  "id": 6,
  "title": "New Task",
  "status": "todo",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 204 No Content
(No response body - just status code)

### 400 Bad Request
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

## How to Demonstrate

1. **Create a task** - POST to /api/tasks → 201
2. **Delete a task** - DELETE to /api/tasks/1 → 204
3. **Request non-existent task** - GET /api/tasks/99999 → 404
4. **Send invalid data** - POST with empty title → 400

## Why This Approach

- **201**: Communicates that a new resource was created (not just "success")
- **204**: Indicates success with no response body (DELETE)
- **400**: Tells client the request was malformed
- **404**: Clearly indicates resource doesn't exist
- **500**: Generic error without exposing internals

## Viva Questions

**Q: Why does POST return 201 instead of 200?**
A: 201 Created specifically indicates a new resource was created. 200 would be technically correct but less semantically precise.

**Q: Why does DELETE return 204?**
A: 204 No Content indicates successful processing where the server has no response body to return. This is standard REST practice for DELETE operations.