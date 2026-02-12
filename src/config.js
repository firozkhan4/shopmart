import "dotenv/config"


export default {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: "1d",
}
