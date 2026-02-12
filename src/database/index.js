import { Sequelize } from "sequelize";
import config from "../config.js";

const sequelize = new Sequelize(config.DB_URL, {
  dialect: "postgres", // change if mysql / mariadb
  logging: false,      // disable SQL logs in prod

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  define: {
    timestamps: true,
    underscored: true, // created_at instead of createdAt (optional)
  },
});

/**
 * Test DB connection
 */
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default sequelize;
