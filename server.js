
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const morgan = require('morgan');
const cors = require('cors');
app.use(morgan('dev'));
app.use(cors());

const { connectDB, sequelize } = require('./config/db');

connectDB();

//sync the db 
sequelize.sync().then(() => {
    console.log('Synced with db ');

})







app.get('/', (req, res) => {
    res.status(200).json({ 'status': 'Running on port 8000' })




});







app.listen(PORT, () => {

    console.log(`SERVER IS RUNNING ON  ${PORT}`);

})

