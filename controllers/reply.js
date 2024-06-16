import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { Comment, Reply } from "../models/Feedback.js";
import User from "../models/User.js";

// @desc Add reply
// @route POST /feedbacks/reply/:id
// @access Private
const addReply = asyncHandler(async (req, res, next) => {
    const { user } = req;
    const replyData = { ...req.body, user: user._id };
    const commentId = req.params.id;
    const replyingTo = req.body.replyingTo;
    const replyingToUser = await User.findOne({ username: replyingTo });
    if (!replyingToUser) {
        return next(
            new ErrorResponse(
                `User not found with username of ${replyingTo}`,
                404
            )
        );
    }
    let comment = await Comment.findById(commentId);
    if (!comment) {
        return next(
            new ErrorResponse(`Comment not found with id of ${commentId}`, 404)
        );
    }
    let reply = await Reply.create(replyData);
    comment.replies.push(reply._id);
    await comment.save();
    res.status(200).json({ success: true, data: reply });
});

// @desc Update reply
// @route PUT /feedbacks/reply/:id
// @access Private
const updateReply = asyncHandler(async (req, res, next) => {
    const replyId = req.params.id;
    let reply = await Reply.findById(replyId);
    if (!reply) {
        return next(
            new ErrorResponse(`Reply not found with id of ${replyId}`, 404)
        );
    }
    reply = await Reply.findByIdAndUpdate(replyId, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: reply });
});

// @desc Delete reply
// @route DELETE /feedbacks/reply/:id
// @access Private
const deleteReply = asyncHandler(async (req, res, next) => {
    const replyId = req.params.id;
    let reply = await Reply.findById(replyId);
    if (!reply) {
        return next(
            new ErrorResponse(`Reply not found with id of ${replyId}`, 404)
        );
    }
    let comment = await Comment.findOne({ replies: replyId });
    if (comment) {
        comment.replies = comment.replies.filter(
            (reply) => reply.toString() !== replyId
        );
    }
    await comment.save();
    await Reply.findByIdAndDelete(replyId);
    res.status(200).json({ success: true, data: {} });
});

export { addReply, updateReply, deleteReply };
