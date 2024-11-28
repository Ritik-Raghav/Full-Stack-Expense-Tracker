const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Files = sequelize.define('files', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileURL: {
        type: Sequelize.STRING,
        allowNull: false
    },
    key: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Files;