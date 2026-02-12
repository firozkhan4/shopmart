import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import configFile from "../config/config.js"

// ESM __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = configFile[env];
const db = {};

// Initialize Sequelize
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Dynamic model loading with improved filtering
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file !== path.basename(__filename) &&
      file.endsWith(".js") &&
      !file.startsWith(".") &&
      !file.endsWith(".test.js")
  );

// Load models
for (const file of modelFiles) {
  try {
    const modulePath = path.join(__dirname, file);
    const { default: defineModel } = await import(modulePath);

    if (typeof defineModel === "function") {
      const model = defineModel(sequelize, DataTypes);
      db[model.name] = model;
    }
  } catch (error) {
    console.error(`Failed to load model ${file}:`, error.message);
  }
}

// Initialize associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// Export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
