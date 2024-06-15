import mongoose from "mongoose";

// Reply schema
const ReplySchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please add a reply"],
            trim: true,
            maxlength: [250, "Reply cannot be more than 250 characters"],
        },
        replyingTo: {
            type: String,
        },
    },
    { timestamps: true }
);

// Comment schema
const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please add a comment"],
            trim: true,
            maxlength: [250, "Comment cannot be more than 250 characters"],
        },
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Reply",
            },
        ],
    },
    { timestamps: true }
);

// Feedback schema
const FeedbackSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add a title"],
            trim: true,
            maxlength: [100, "Title cannot be more than 100 characters"],
        },
        category: {
            type: String,
            required: [true, "Please add a category"],
            enum: ["ui", "ux", "enhancement", "bug", "feature"],
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["suggestion", "planned", "in-progress", "live"],
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Reply = mongoose.model("Reply", ReplySchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Feedback = mongoose.model("Feedback", FeedbackSchema);

export { Feedback, Comment, Reply };
