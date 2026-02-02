const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Generate OTP (6 digits)
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Login controller
exports.login = async (req, res) => {
    try {
        const { emailOrPhone } = req.body;

        if (!emailOrPhone) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number is required'
            });
        }

        // Find or create user
        let user = await User.findOne({ emailOrPhone });

        if (!user) {
            user = await User.create({
                emailOrPhone,
                name: emailOrPhone
            });
        }

        // Generate OTP
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        // In production, send OTP via SMS/Email
        // For development, return OTP in response
        console.log(`OTP for ${emailOrPhone}: ${otp}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp: otp, // Remove this in production
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in login',
            error: error.message
        });
    }
};

// Verify OTP controller
exports.verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({
                success: false,
                message: 'User ID and OTP are required'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check OTP expiry
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
        }

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Clear OTP and mark as verified
        user.otp = null;
        user.otpExpiry = null;
        user.isVerified = true;
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                emailOrPhone: user.emailOrPhone,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in OTP verification',
            error: error.message
        });
    }
};

// Register controller
exports.register = async (req, res) => {
    try {
        const { emailOrPhone, name, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ emailOrPhone });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            emailOrPhone,
            name,
            password,
            isVerified: false
        });

        // Generate OTP
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        console.log(`OTP for ${emailOrPhone}: ${otp}`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. OTP sent.',
            otp: otp, // Remove in production
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in registration',
            error: error.message
        });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};