const express = require('express');
const usercontroller = require('../controller/usercontroller');
const router = express.Router();


router.post('/signup', usercontroller.signup);
module.exports = router;











