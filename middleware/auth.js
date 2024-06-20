import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";

const protectRoute = asyncHandler(async (req, res, next) => {
    let token;

    // Check whether the token exists or not
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(" ")[1];
    }
    // Else set token from cookie if exists in cookie
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    // Return if token does not exist
    if (!token) {
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({ _id: decoded.userId });
        if (!req.user) {
            return next(
                new ErrorResponse("Not authorized to access this route", 401)
            );
        }
        next();
    } catch (err) {
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    }
});

export default protectRoute;
