const { Sequelize } = require('sequelize');

const dbConfig = require('./db.config');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect
    }

)

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB CONNECTED ');

    } catch (error) {
        console.log('Unable to connect with db ');

    }
}



module.exports = { sequelize, connectDB };