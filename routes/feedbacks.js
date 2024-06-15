import express from "express";
import protectRoute from "../middleware/auth.js";
import {
    getFeedback,
    getFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
} from "../controllers/feedbacks.js";

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

// router
//     .route("/comment/:id")
//     .post(protectRoute, postComment)
//     .put(protectRoute, updateComment)
//     .delete(protectRoute, deleteComment);

// router
//     .route("/reply/:id")
//     .post(protectRoute, postReply)
//     .put(protectRoute, updateReply)
//     .delete(protectRoute, deleteReply);
export default router;
