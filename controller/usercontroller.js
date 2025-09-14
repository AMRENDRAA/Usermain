const User = require('../Model/User');

exports.signup = async (req, res) => {


    try {


        const { firstname, email, password } = req.body;
        const newuser = await User.create({
            firstname,
            email,
            password

        })
    } catch (err) {

        res.status(500).json({
            status: "failed",
            err: err.err
        })



    }
}