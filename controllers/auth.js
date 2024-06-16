import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// @desc      Register user
// @route     POST /auth/register
// @access    Public
const register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({
        email,
    }).select("+password");

    if (existingUser) {
        return next(new ErrorResponse("Email already in use", 400));
    }

    // hashing the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
    });

    user.password = undefined;
    sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /auth/login
// @access    Public
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(
            new ErrorResponse("Please provide an email and password", 400)
        );
    }

    // Check for user
    const user = await User.findOne({
        email,
    }).select("+password");

    // Wrong credentials
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check password if user exists
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    user.password = undefined;
    sendTokenResponse(user, 200, res);
});

// Get token from User model, create cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    // Cookie options
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

export { register, login };
