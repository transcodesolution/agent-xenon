import express from 'express';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
import { addEnrollmentInTraining, createEmployeeTraining, deleteEmployeeTraining, deleteEnrollmentInTraining, getTrainingById, getTrainings, updateEmployeeTraining } from '../controllers/training/training';

const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.EMPLOYEE_CREATE]), createEmployeeTraining);
router.patch("/:trainingId", validateRoleAndPermissions([Permission.EMPLOYEE_UPDATE]), updateEmployeeTraining);
router.delete("/", validateRoleAndPermissions([Permission.EMPLOYEE_DELETE]), deleteEmployeeTraining);
router.get("/", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), getTrainings);
router.get("/:trainingId", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), getTrainingById);
router.post("/enroll-employees", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), addEnrollmentInTraining);
router.delete("/remove-enrolled-employees", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), deleteEnrollmentInTraining);

export const trainingRouter = router;