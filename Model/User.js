const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");


const User = sequelize.define('User', {

    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,

    }


})


module.exports = User;
