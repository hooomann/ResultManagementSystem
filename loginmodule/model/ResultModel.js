const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

class Result extends Model { }

Result.init({
    rollno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dateofbirth: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: "results",
    tableName: "results",
});

module.exports = Result;
