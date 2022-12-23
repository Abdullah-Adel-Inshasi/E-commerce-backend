const { Sequelize } = require("sequelize");
// test
const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "node-course",
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
