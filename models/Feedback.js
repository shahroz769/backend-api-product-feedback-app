import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Please add a reply"],
        trim: true,
        maxlength: [500, "Reply can not be more than 500 characters"],
    },
    replyingTo: {
        type: String,
    },
});

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Please add a comment"],
        trim: true,
        maxlength: [500, "Comment can not be more than 500 characters"],
    },
    replies: [ReplySchema],
});

const FeedbackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
        trim: true,
        maxlength: [100, "Title can not be more than 100 characters"],
    },
    category: {
        type: String,
        required: [true, "Please add a category"],
        enum: ["ui", "ux", "enhancement", "bug", "feature"],
    },
    upvotes: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["suggestion", "planned", "in-progress", "live"],
    },
    description: {
        type: String,
        required: [true, "Please add description"],
        maxlength: [500, "Description can not be more than 500 characters"],
    },
    comments: [CommentSchema],
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
