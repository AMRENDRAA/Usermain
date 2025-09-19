require('dotenv').config();
const express = require('express');
const app = express();
const { connectDB, sequelize } = require('./config/db');
const userrouter = require('./route/userroute');
const postrouter = require('./route/postRoute');
// Import all models and their associations
require('./Model/index');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');



//port define 
const PORT = process.env.PORT || 8000;

//Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

//DB 
connectDB();

//sync the db 
sequelize.sync().then(() => {
    console.log('Synced with db ');
}).catch((error) => {
    console.error('Unable to sync with db:', error);
});

app.use('/api/auth', userrouter);
app.use('/api', postrouter);


app.get('/', (req, res) => {
    res.status(200).json({ 'status': 'Running on port 8000' })




});







app.listen(PORT, () => {

    console.log(`SERVER IS RUNNING ON  ${PORT}`);

})

