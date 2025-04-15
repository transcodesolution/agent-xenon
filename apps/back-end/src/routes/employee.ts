import express from 'express';
import { validateRoleAndPermissions } from '../helper/middleware';
import { Permission } from '@agent-xenon/constants';
import { createEmployee, deleteEmployee, getAllUnassignedEmployeeByTrainingId, getEmployeeById, getEmployees, updateEmployee } from '../controllers/employee/employee';
import { getJobRoleAndDesignation } from '../controllers/job/job';

const router = express.Router();

router.post("/create", validateRoleAndPermissions([Permission.EMPLOYEE_CREATE]), createEmployee);
router.patch("/:employeeId", validateRoleAndPermissions([Permission.EMPLOYEE_UPDATE]), updateEmployee);
router.delete("/", validateRoleAndPermissions([Permission.EMPLOYEE_DELETE]), deleteEmployee);
router.get("/", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), getEmployees);
router.get("/job-role-and-designation", validateRoleAndPermissions([Permission.EMPLOYEE_UPDATE]), getJobRoleAndDesignation);
router.get("/unassigned-employee-by-trainingId/:trainingId", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), getAllUnassignedEmployeeByTrainingId);
router.get("/:employeeId", validateRoleAndPermissions([Permission.EMPLOYEE_READ]), getEmployeeById);

export const employeeRouter = router;