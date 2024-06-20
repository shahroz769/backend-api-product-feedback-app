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

// @desc Get Detailed single feedback
// @route GET /feedbacks/details/:id
// @access Private
const getDetailedFeedback = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    let feedback = await Feedback.findById(req.params.id)
        .populate({
            path: "comments",
            populate: [
                {
                    path: "replies",
                    populate: {
                        path: "user",
                        select: "profileImage _id firstName lastName username",
                    },
                },
                {
                    path: "user",
                    select: "profileImage _id firstName lastName username",
                },
            ],
        })
        .populate("user", "profileImage _id firstName lastName username");
    if (!feedback) {
        return next(
            new ErrorResponse(
                `Feedback not found with id of ${req.params.id}`,
                404
            )
        );
    }
    // Transform the feedback data
    const transformedFeedback = {
        _id: feedback._id,
        description: feedback.description,
        title: feedback.title,
        category: feedback.category,
        upvotesCount: feedback.upvotes.length,
        commentsCount: feedback.comments.length,
        comments: feedback.comments.map((comment) => ({
            _id: comment._id,
            content: comment.content,
            user: {
                _id: comment.user._id,
                profileImage: comment.user.profileImage,
                firstName: comment.user.firstName,
                lastName: comment.user.lastName,
                username: comment.user.username,
            },
            owner: comment.user._id.equals(userId),
            replies: comment.replies.map((reply) => ({
                _id: reply._id,
                content: reply.content,
                replyingTo: reply.replyingTo,
                user: {
                    _id: reply.user._id,
                    profileImage: reply.user.profileImage,
                    firstName: reply.user.firstName,
                    lastName: reply.user.lastName,
                    username: reply.user.username,
                },
                owner: reply.user._id.equals(userId),
            })),
        })),
        feedbackOwner: feedback.user._id.equals(userId),
    };
    res.status(200).json({ success: true, data: transformedFeedback });
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
        return next(new ErrorResponse(`No feedbacks found`, 404));
    }
    res.status(200).json({ success: true, data: feedbacks });
});

// @desc Get all Home feedbacks
// @route GET /feedbacks/home
// @access Private
const getHomeFeedbacks = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    // Find all feedbacks with status 'suggestion'
    const feedbacks = await Feedback.find({ status: "suggestion" })
        .populate("upvotes")
        .populate("comments")
        .select("_id title description category upvotes comments");
    if (!feedbacks.length) {
        return next(new ErrorResponse(`No feedbacks found`, 404));
    }
    // Count all feedbacks by status
    const totalCounts = await Feedback.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    // Prepare the total counts for each status
    const counts = totalCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, {});
    // Transform feedbacks to include the counts and upvoted status
    const transformedFeedbacks = feedbacks.map((feedback) => {
        return {
            _id: feedback._id,
            title: feedback.title,
            description: feedback.description,
            category: feedback.category,
            upvotesCount: feedback.upvotes.length,
            commentsCount: feedback.comments.length,
            upvoted: feedback.upvotes.some((upvote) => upvote.equals(userId)),
        };
    });
    res.status(200).json({
        success: true,
        feedbacks: transformedFeedbacks,
        suggestionsCount: counts["suggestion"] || 0,
        plannedCount: counts["planned"] || 0,
        inProgressCount: counts["in-progress"] || 0,
        liveCount: counts["live"] || 0,
    });
});

// @desc Get all Roadmap feedbacks
// @route GET /feedbacks/roadmap
// @access Private
const getRoadmapFeedbacks = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    // Find all feedbacks with status not equal to 'suggestion'
    const feedbacks = await Feedback.find({ status: { $ne: "suggestion" } })
        .populate("upvotes")
        .populate("comments")
        .select("_id title description category status upvotes comments");
    if (!feedbacks.length) {
        return next(new ErrorResponse(`No feedbacks found`, 404));
    }
    // Transform feedbacks to include the counts and upvoted status
    const transformedFeedbacks = feedbacks.map((feedback) => ({
        _id: feedback._id,
        title: feedback.title,
        description: feedback.description,
        category: feedback.category,
        status: feedback.status,
        upvotesCount: feedback.upvotes.length,
        commentsCount: feedback.comments.length,
        upvoted: feedback.upvotes.some((upvote) => upvote.equals(userId)),
    }));
    // Separate feedbacks into three arrays based on their status
    const planned = transformedFeedbacks.filter(
        (feedback) => feedback.status === "planned"
    );
    const inProgress = transformedFeedbacks.filter(
        (feedback) => feedback.status === "in-progress"
    );
    const live = transformedFeedbacks.filter(
        (feedback) => feedback.status === "live"
    );
    // Count the number of feedbacks in each status category
    const plannedCount = planned.length;
    const inProgressCount = inProgress.length;
    const liveCount = live.length;
    res.status(200).json({
        success: true,
        data: {
            planned,
            inProgress,
            live,
            plannedCount,
            inProgressCount,
            liveCount,
        },
    });
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
    await feedback.deleteOne();
    res.status(200).json({ success: true, data: {} });
});

// @desc Add upvote
// @route GET /feedbacks/upvote/:id
// @access Private
const upvoteFeedback = asyncHandler(async (req, res, next) => {
    const { user } = req;
    let feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
        return next(
            new ErrorResponse(
                `Feedback not found with id of ${req.params.id}`,
                404
            )
        );
    }
    const hasUpvoted = feedback.upvotes.find(
        (upvote) => upvote.toString() === user._id.toString()
    );
    console.log(hasUpvoted);
    if (hasUpvoted) {
        return next(
            new ErrorResponse(
                `User has already upvoted the feedback with id of ${req.params.id}`,
                400
            )
        );
    }
    feedback.upvotes.push(user._id);
    await feedback.save();
    res.status(200).json({
        success: true,
        upvotesCount: feedback.upvotes.length,
    });
});

// @desc Remove upvote
// @route GET /feedbacks/removeupvote/:id
// @access Private
const removeUpvoteFeedback = asyncHandler(async (req, res, next) => {
    const { user } = req;
    let feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
        return next(
            new ErrorResponse(
                `Feedback not found with id of ${req.params.id}`,
                404
            )
        );
    }
    feedback.upvotes = feedback.upvotes.filter((upvote) => {
        upvote !== user._id;
    });
    await feedback.save();
    res.status(200).json({
        success: true,
        upvotesCount: feedback.upvotes.length,
    });
});

export {
    addFeedback,
    getFeedback,
    getDetailedFeedback,
    getFeedbacks,
    getHomeFeedbacks,
    getRoadmapFeedbacks,
    updateFeedback,
    deleteFeedback,
    upvoteFeedback,
    removeUpvoteFeedback,
};
