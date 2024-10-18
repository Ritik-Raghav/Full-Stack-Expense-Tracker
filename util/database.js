const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'pass', {
    dialect: "mysql",
    host: "localhost"
});

module.exports = sequelize;