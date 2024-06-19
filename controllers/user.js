import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";

// @desc Get logged in user
// @route GET /user
// @access Private
const loggedInUserDetails = asyncHandler(async (req, res, next) => {
    let { user } = req;
    let loggedInUser = await User.findById(user._id);
    if (!loggedInUser) {
        return next(
            new ErrorResponse(`User not found with id of ${user._id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: loggedInUser });
});

// @desc Get any user
// @route GET /user/:id
// @access Private
const anyUserDetails = asyncHandler(async (req, res, next) => {
    let userId = req.params.id;
    let userDetails = await User.findById(userId);
    if (!userDetails) {
        return next(
            new ErrorResponse(`User not found with id of ${userId}`, 404)
        );
    }
    res.status(200).json({ success: true, data: userDetails });
});

export { loggedInUserDetails, anyUserDetails };
