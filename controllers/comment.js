import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { Feedback, Comment } from "../models/Feedback.js";

// @desc Add comment
// @route POST /feedbacks/comment/:id
// @access Private
const addComment = asyncHandler(async (req, res, next) => {
    const { user } = req;
    const commentData = { ...req.body, user: user._id };
    const feedbackId = req.params.id;
    let feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
        return next(
            new ErrorResponse(
                `Feedback not found with id of ${feedbackId}`,
                404
            )
        );
    }
    let comment = await Comment.create(commentData);
    feedback.comments.push(comment._id);
    await feedback.save();
    res.status(200).json({ success: true, data: comment });
});

// @desc Update comment
// @route PUT /feedbacks/comment/:id
// @access Private
const updateComment = asyncHandler(async (req, res, next) => {
    const commentId = req.params.id;
    let comment = await Comment.findById(commentId);
    if (!comment) {
        return next(
            new ErrorResponse(`Comment not found with id of ${commentId}`, 404)
        );
    }
    comment = await Comment.findByIdAndUpdate(commentId, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: comment });
});

// @desc Delete comment
// @route DELETE /feedbacks/comment/:id
// @access Private
const deleteComment = asyncHandler(async (req, res, next) => {
    const commentId = req.params.id;
    let comment = await Comment.findById(commentId);
    if (!comment) {
        return next(
            new ErrorResponse(`Comment not found with id of ${commentId}`, 404)
        );
    }
    let feedback = await Feedback.findOne({ comments: commentId });
    if (feedback) {
        feedback.comments = feedback.comments.filter(
            (comment) => comment.toString() !== commentId
        );
    }
    await feedback.save();
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ success: true, data: {} });
});

export { addComment, updateComment, deleteComment };
