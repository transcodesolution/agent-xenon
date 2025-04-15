import express from 'express';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
import { createTopic, deleteTopicById, getTopicById, getTopicsByTrainingId, updateTopic } from '../controllers/topic/topic';
import { createSection, deleteSectionBySectionAndTopicId, getSectionBySectionIdAndTopicId, getSectionsByTopicId, updateSectionBySectionAndTopicId } from '../controllers/section/section';
import { getAllQuestionList } from '../controllers/question-answers/interview-question';

const router = express.Router();

const commonPermissions = [Permission.TRAINING_READ];

// topic routes
router.post("/topic/create", validateRoleAndPermissions(commonPermissions), createTopic);
router.patch("/topic/:id", validateRoleAndPermissions(commonPermissions), updateTopic);
router.delete("/topic/:id", validateRoleAndPermissions(commonPermissions), deleteTopicById);
router.get("/:trainingId/topics", validateRoleAndPermissions(commonPermissions), getTopicsByTrainingId);
router.get("/topic/:id", validateRoleAndPermissions(commonPermissions), getTopicById);

// section routes
router.post("/topic/section/create", validateRoleAndPermissions(commonPermissions), createSection);
router.patch("/topic/:topicId/section/:sectionId", validateRoleAndPermissions(commonPermissions), updateSectionBySectionAndTopicId);
router.delete("/topic/:topicId/section/:sectionId", validateRoleAndPermissions(commonPermissions), deleteSectionBySectionAndTopicId);
router.get("/topic/:topicId/sections", validateRoleAndPermissions(commonPermissions), getSectionsByTopicId);
router.get("/topic/:topicId/section/:sectionId", validateRoleAndPermissions(commonPermissions), getSectionBySectionIdAndTopicId);
router.get("/topic/practical-section/questions", validateRoleAndPermissions(commonPermissions), getAllQuestionList);

export const topicRouter = router;