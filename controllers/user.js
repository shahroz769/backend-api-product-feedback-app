import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

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

// @desc Upload profile image
// @route POST /user/image
// @access Private
const uploadUserImg = asyncHandler(async (req, res) => {
    let { user } = req;
    let loggedInUser = await User.findById(user._id);
    if (!loggedInUser) {
        return next(
            new ErrorResponse(`User not found with id of ${user._id}`, 404)
        );
    }
    const options = {
        public_id: user._id,
        unique_filename: false,
        overwrite: true,
    };
    const result = await cloudinary.uploader.upload(req.file.path, options);
    fs.unlinkSync(req.file.path);
    loggedInUser.profileImage = result.secure_url;
    await loggedInUser.save();
    return res.status(200).json({
        message: "Image has been uploaded",
        name: result.public_id,
        url: result.secure_url,
        status: true,
    });
});

export { loggedInUserDetails, anyUserDetails, uploadUserImg };
