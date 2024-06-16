import express from "express";
import {
    getFeedback,
    getFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
} from "../controllers/feedbacks.js";
import {
    addComment,
    updateComment,
    deleteComment,
} from "../controllers/comment.js";
import { addReply, updateReply, deleteReply } from "../controllers/reply.js";
import protectRoute from "../middleware/auth.js";

const router = express.Router();

router
    .route("/")
    .get(protectRoute, getFeedbacks)
    .post(protectRoute, addFeedback);

router
    .route("/:id")
    .get(protectRoute, getFeedback)
    .put(protectRoute, updateFeedback)
    .delete(protectRoute, deleteFeedback);

// Params: Feedback id
router.route("/comment/:id").post(protectRoute, addComment);

// Params: Comment id
router
    .route("/comment/:id")
    .put(protectRoute, updateComment)
    .delete(protectRoute, deleteComment);

// Params: Comment id
router.route("/reply/:id").post(protectRoute, addReply);

// Params: Reply id
router
    .route("/reply/:id")
    .put(protectRoute, updateReply)
    .delete(protectRoute, deleteReply);

export default router;
