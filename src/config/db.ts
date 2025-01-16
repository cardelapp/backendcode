import { Sequelize } from 'sequelize';
import Log from '../utils/loggers';
import dotenv from 'dotenv';

dotenv.config();  // Ensure environment variables are loaded

// Validate required environment variables
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST,DB_PORT } = process.env;
if (!DB_NAME || !DB_USER  || !DB_HOST) {
  Log.error("Missing required database environment variables.");
  process.exit(1);  // Stop the server if env variables are missing
}

// Initialize Sequelize with enhanced options
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT) || 3306,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,  // Enable query logging in development
  pool: {
    max: 10,       // Max connections
    min: 0,        // Min connections
    acquire: 30000, // Max time (ms) to get a connection
    idle: 10000,    // Max idle time (ms) before releasing a connection
  },
  retry: {
    max: 3,  // Retry failed connections up to 3 times
  },
});

// Authenticate and sync database
(async () => {
  try {
    await sequelize.authenticate();
    Log.success("✅ MySQL connected successfully.");
    await sequelize.sync({ alter: true });  // Sync models with DB (use with caution in production)
  } catch (error: any) {
    Log.error(`❌ Unable to connect to the database: ${error.message}`);
    process.exit(1);  // Gracefully exit if DB connection fails
  }
})();

export default sequelize;
