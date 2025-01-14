require('dotenv').config();
const { DEV_DATABASE_HOST, DEV_DATABASE_USERNAME, DEV_DATABASE_PASSWORD, DEV_DATABASE_PORT, DEV_DATABASE_NAME } = process.env;

module.exports = {
  development: {
    username: DEV_DATABASE_USERNAME,
    password: DEV_DATABASE_PASSWORD,
    database: DEV_DATABASE_NAME,
    port: DEV_DATABASE_PORT,
    host: DEV_DATABASE_HOST,
    dialect: "postgres",
  },
  test: {
    username: DEV_DATABASE_USERNAME,
    password: DEV_DATABASE_PASSWORD,
    database: DEV_DATABASE_NAME,
    port: DEV_DATABASE_PORT,
    host: DEV_DATABASE_HOST,
    dialect: "postgres",
  },
  production: {
    username: DEV_DATABASE_USERNAME,
    password: DEV_DATABASE_PASSWORD,
    database: DEV_DATABASE_NAME,
    port: DEV_DATABASE_PORT,
    host: DEV_DATABASE_HOST,
    dialect: "postgres",
  },
};
