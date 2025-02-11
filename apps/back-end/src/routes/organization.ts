import express from 'express';
import { deleteOrganization, getOrganization, onBoardOrganization, updateOrganization } from '../controllers/organization/organization';
const router = express.Router();

router.post("/create", onBoardOrganization);
router.put("/", updateOrganization);
router.delete("/:organizationId", deleteOrganization);
router.get("/", getOrganization);

export const organizationRouter = router;