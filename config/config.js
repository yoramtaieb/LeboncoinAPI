require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "leboncoin_db",
    host: "127.0.0.1",
    dialect: "mysql",
    port: "8889",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "leboncoin_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "leboncoin_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
