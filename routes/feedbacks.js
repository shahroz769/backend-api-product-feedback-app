import express from "express";
import {
    getFeedback,
    getDetailedFeedback,
    getFeedbacks,
    getHomeFeedbacks,
    getRoadmapFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    upvoteFeedback,
    removeUpvoteFeedback,
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
    
router.route("/details/:id").get(protectRoute, getDetailedFeedback);

router.route("/home").get(protectRoute, getHomeFeedbacks);

router.route("/roadmap").get(protectRoute, getRoadmapFeedbacks);

router
    .route("/:id")
    .get(protectRoute, getFeedback)
    .put(protectRoute, updateFeedback)
    .delete(protectRoute, deleteFeedback);

router.route("/comment/:id").post(protectRoute, addComment);

router
    .route("/comment/:id")
    .put(protectRoute, updateComment)
    .delete(protectRoute, deleteComment);

router.route("/reply/:id").post(protectRoute, addReply);

router
    .route("/reply/:id")
    .put(protectRoute, updateReply)
    .delete(protectRoute, deleteReply);

router.route("/upvote/:id").get(protectRoute, upvoteFeedback);
router.route("/removeupvote/:id").get(protectRoute, removeUpvoteFeedback);

export default router;
