import Joi from "joi";
import { paginationSchema } from "./pagination";

const employeeIdSchema = { employeeId: Joi.string().optional(), }

const employeeSchema = {
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    password: Joi.string().optional(),
    joinDate: Joi.date().iso().optional(),
    salaryDetail: Joi.object().keys({
        allowances: Joi.object().keys({
            coreCompensation: Joi.number().optional(),
            houseLivingBenefits: Joi.number().optional(),
            incentivePerformanceBenefits: Joi.number().optional(),
            retirementBenefits: Joi.number().optional(),
            transportationMobilityBenefits: Joi.number().optional(),
            workRelatedBenefits: Joi.number().optional(),
        }).optional(),
        deductions: Joi.object().keys({
            mandatory: Joi.number().optional(),
            optional: Joi.number().optional(),
            voluntary: Joi.number().optional(),
        }).optional(),
        grossSalary: Joi.number().optional(),
        netSalary: Joi.number().optional(),
        totalCostToCompany: Joi.number().optional(),
    }).optional(),
    jobRoleId: Joi.string().optional(),
    designationId: Joi.string().optional(),
    contactInfo: Joi.object().keys({
        address: Joi.string().allow("").optional(),
        city: Joi.string().allow("").optional(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string().allow("").optional(),
        state: Joi.string().allow("").optional(),
    }).optional(),
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

export const getAllUnassignedTrainingEmployeeSchema = Joi.object().keys({
    trainingId: Joi.string().optional(),
})

export const getEmployeeByIdSchema = Joi.object().keys(employeeIdSchema)