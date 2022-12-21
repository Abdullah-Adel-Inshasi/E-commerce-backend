const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  username: "root",
  password: "Gg123!@#",
  database: "node-course",
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize

