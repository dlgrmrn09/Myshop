const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "@Blad30731",
  host: "localhost",
  port: 5432,
  database: "myshop",
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
