// Hexa Server Entry Point
// Starts the Express server and establishes database connection

import app from './app.js';
import config from './config/env.js';
import pool from './db/pool.js';

const startServer = async () => {
  try {
    // Test database connection
    console.log('Connecting to PostgreSQL...');
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected:', result.rows[0].now);
    
    // Start server
    app.listen(config.port, () => {
      console.log(`✓ Hexa server running on http://localhost:${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log(`✓ API available at http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

startServer();