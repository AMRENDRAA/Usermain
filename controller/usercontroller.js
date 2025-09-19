const User = require('../Model/User');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    try {
        const { firstname, email, password } = req.body;
        
        // Validate input
        if (!firstname || !email || !password) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                message: "User already exists with this email"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const newuser = await User.create({
            firstname,
            email,
            password: hashedPassword
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newuser.toJSON();

        res.status(201).json({
            status: "Success",
            data: userWithoutPassword
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: "failed",
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid credentials"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid credentials"
            });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.toJSON();

        res.status(200).json({
            status: "Success",
            message: "Login successful",
            data: userWithoutPassword
        });
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        });
    }
};