const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

class InvalidToken extends Model { }

InvalidToken.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
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
    modelName: "invalidtoken",
    tableName: "invalidtoken",
});

module.exports = InvalidToken;
