# Concept 2: Environment Variables & Secrets Management

## Definition
Environment variables are key-value pairs stored outside the application code that configure behavior across different environments (development, staging, production). They separate configuration from code and protect sensitive information.

## Implementation

### Files
- `server/src/config/env.js` - Centralized environment configuration
- `.env.example` - Template for required environment variables
- `.gitignore` - Excludes sensitive files from version control
- `server/package.json` - Dependencies (dotenv)

### Environment Variables Used

```env
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/hexa

# Client Configuration  
CLIENT_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

## Configuration Module

```javascript
// server/src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['DATABASE_URL', 'PORT'];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;
```

## .gitignore Configuration

```
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## How to Demonstrate

1. **Check .env.example** - Shows what variables are needed
2. **Check .gitignore** - Confirms .env is excluded
3. **Start server without .env** - Shows validation error
4. **Import config module** - Shows centralized access

## Best Practices

- Never commit .env files to version control
- Use .env.example as a template
- Validate required variables at startup
- Use different values for dev/prod environments
- Don't expose secrets in error messages

## Viva Questions

**Q: Why should .env never be committed?**
A: It contains sensitive data like database credentials, API keys, and secrets. If committed to a public repository, anyone can access these secrets.

**Q: Why use .env.example?**
A: It documents required environment variables without exposing actual values. Developers can copy it to .env and fill in their own values.

**Q: What happens if DATABASE_URL is missing?**
A: The application fails at startup with a clear error message listing missing variables. This prevents running with misconfiguration.