import Joi from "joi";
import { paginationSchema } from "./pagination";

const employeeIdSchema = { employeeId: Joi.string().optional(), }

const employeeSchema = {
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    password: Joi.string().optional(),
    joinDate: Joi.date().iso().optional(),
    "salaryDetail.allowances.coreCompensation": Joi.number().optional(),
    "salaryDetail.allowances.houseLivingBenefits": Joi.number().optional(),
    "salaryDetail.allowances.incentivePerformanceBenefits": Joi.number().optional(),
    "salaryDetail.allowances.retirementBenefits": Joi.number().optional(),
    "salaryDetail.allowances.transportationMobilityBenefits": Joi.number().optional(),
    "salaryDetail.allowances.workRelatedBenefits": Joi.number().optional(),
    "salaryDetail.deductions.mandatory": Joi.number().optional(),
    "salaryDetail.deductions.optional": Joi.number().optional(),
    "salaryDetail.deductions.voluntary": Joi.number().optional(),
    "salaryDetail.grossSalary": Joi.number().optional(),
    "salaryDetail.netSalary": Joi.number().optional(),
    "salaryDetail.totalCostToCompany": Joi.number().optional(),
    jobRoleId: Joi.string().optional(),
    designationId: Joi.string().optional(),
    "contactInfo.address": Joi.string().allow("").optional(),
    "contactInfo.city": Joi.string().allow("").optional(),
    "contactInfo.email": Joi.string().email().optional(),
    "contactInfo.phoneNumber": Joi.string().allow("").optional(),
    "contactInfo.state": Joi.string().allow("").optional(),
};

export const createEmployeeSchema = Joi.object().keys(employeeSchema);

export const updateEmployeeSchema = Joi.object().keys({
    ...employeeSchema,
    ...employeeIdSchema,
})

export const deleteEmployeeSchema = Joi.object().keys({
    employeeIds: Joi.array().items(employeeIdSchema.employeeId).required(),
})

export const getEmployeeSchema = Joi.object().keys({
    search: Joi.string().allow("").optional(),
    jobRoleId: Joi.string().optional(),
    designationId: Joi.string().optional(),
    ...paginationSchema,
})

export const getEmployeeByIdSchema = Joi.object().keys(employeeIdSchema)