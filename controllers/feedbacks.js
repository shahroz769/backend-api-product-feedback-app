import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { Feedback } from "../models/Feedback.js";

// @desc Get single feedback
// @route GET /feedbacks/:id
// @access Private
const getFeedback = asyncHandler(async (req, res, next) => {
    let feedback = await Feedback.findById(req.params.id)
        .populate({
            path: "comments",
            populate: [
                {
                    path: "replies",
                    populate: {
                        path: "user",
                    },
                },
                {
                    path: "user",
                },
            ],
        })
        .populate("user");
    if (!feedback) {
        return next(
            new ErrorResponse(
                `Feedback not found with id of ${req.params.id}`,
                404
            )
        );
    }
    res.status(200).json({ success: true, data: feedback });
});

// @desc Get all feedbacks
// @route GET /feedbacks
// @access Private
const getFeedbacks = asyncHandler(async (req, res, next) => {
    let feedbacks = await Feedback.find()
        .populate({
            path: "comments",
            populate: [
                {
                    path: "replies",
                    populate: {
                        path: "user",
                    },
                },
                {
                    path: "user",
                },
            ],
        })
        .populate("user");
    if (!feedbacks) {
        return next(new ErrorResponse(`Feedbacks not found`, 404));
    }
    res.status(200).json({ success: true, data: feedbacks });
});

// @desc Add feedback
// @route POST /feedbacks
// @access Private
const addFeedback = asyncHandler(async (req, res, next) => {
    const { user } = req;
    const feedbackData = { ...req.body, user: user._id };
    let feedback = await Feedback.create(feedbackData);
    res.status(200).json({ success: true, data: feedback });
});

// @desc Update feedback
// @route PUT /feedbacks/:id
// @access Private
const updateFeedback = asyncHandler(async (req, res, next) => {
    const { user } = req;
    let feedback = await Feedback.findById(req.params.id);
    if (user._id.toString() !== feedback.user.toString()) {
        return next(
            new ErrorResponse(
                `Not authorized to edit feedback with id of ${req.params.id}`,
                403
            )
        );
    }
    if (!feedback) {
        return next(
            new ErrorResponse(
                `Feedback not found with id of ${req.params.id}`,
                404
            )
        );
    }
    feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: { feedback } });
});

// @desc Delete feedback
// @route DELETE /feedbacks/:id
// @access Private
const deleteFeedback = asyncHandler(async (req, res, next) => {
    const { user } = req;
    let feedback = await Feedback.findById(req.params.id);
    if (user._id.toString() !== feedback.user.toString()) {
        return next(
            new ErrorResponse(
                `Not authorized to delete feedback with id of ${req.params.id}`,
                403
            )
        );
    }
    if (!feedback) {
        return next(
            new ErrorResponse(
                `Feedback not found with id of ${req.params.id}`,
                404
            )
        );
    }
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
});

export {
    addFeedback,
    getFeedback,
    getFeedbacks,
    updateFeedback,
    deleteFeedback,
};
