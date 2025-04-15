import express from 'express';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
import { assignTraining, createEmployeeTraining, deleteEmployeeTraining, getTrainingById, getTrainings, unassignTraining, updateEmployeeTraining } from '../controllers/training/training';

const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.EMPLOYEE_CREATE]), createEmployeeTraining);
router.patch("/:trainingId", validateRoleAndPermissions([Permission.EMPLOYEE_UPDATE]), updateEmployeeTraining);
router.delete("/", validateRoleAndPermissions([Permission.EMPLOYEE_DELETE]), deleteEmployeeTraining);
router.get("/", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), getTrainings);
router.get("/:trainingId", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), getTrainingById);
router.post("/assign", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), assignTraining);
router.delete("/unassign", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), unassignTraining);

export const trainingRouter = router;