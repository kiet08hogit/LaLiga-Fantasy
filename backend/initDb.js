import { initializeDatabase } from './src/db/schema.js';

console.log('Initializing dream team database tables...');
initializeDatabase()
  .then(success => {
    if (success) {
      console.log('Database initialization completed successfully!');
      process.exit(0);
    } else {
      console.log('Database initialization had errors');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Fatal error during database initialization:', err);
    process.exit(1);
  });
