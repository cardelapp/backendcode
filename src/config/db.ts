import { Sequelize } from 'sequelize';
import Log from '../utils/loggers';
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    Log.success("MySQL connected successfully.");
  } catch (error:any) {
    Log.error(`Unable to connect to the database:${error.message}`);
  }
})();

export default sequelize;