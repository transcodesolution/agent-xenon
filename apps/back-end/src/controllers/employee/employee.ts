import { Request, Response } from "express";
import Employee from "../../database/models/employee";
import { createEmployeeSchema, deleteEmployeeSchema, getAllEmployeeNameSchema, getEmployeeByIdSchema, getEmployeeSchema, updateEmployeeSchema } from "../../validation/employee";
import { FilterQuery, QuerySelector } from "mongoose";
import { IEmployee } from "@agent-xenon/interfaces";
import TrainingEnrollment from "../../database/models/training-enrollment";

export const createEmployee = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createEmployeeSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = user.organizationId;
        const employee = await Employee.create(value);

        return res.ok("employee", employee, "addDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        req.body.employeeId = req.params.employeeId;
        const { error, value } = updateEmployeeSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkEmployeeExist = await Employee.findOne({ _id: value.employeeId, deletedAt: null });

        if (!checkEmployeeExist) return res.badRequest("employee", {}, "getDataNotFound");

        const checkEmployeeEmailExist = await Employee.findOne({ _id: { $ne: value.employeeId }, deletedAt: null, "contactInfo.email": value?.contactInfo?.email });

        if (checkEmployeeEmailExist) return res.badRequest("alreadyEmail", {});

        const employee = await Employee.findByIdAndUpdate(value.employeeId, { $set: value }, { new: true });

        return res.ok("employee", employee, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteEmployee = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = deleteEmployeeSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const condition: QuerySelector<IEmployee> = { $in: value.employeeIds };

        const match: FilterQuery<IEmployee> = { _id: condition, organizationId: user.organizationId, deletedAt: null };

        const checkEmployeesExist = await Employee.find(match);

        if (checkEmployeesExist.length !== value.employeeIds.length) return res.badRequest("employee", {}, "getDataNotFound");

        await Employee.updateMany(match, { $set: { deletedAt: new Date() } }, { new: true });

        return res.ok("employees", {}, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getEmployees = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getEmployeeSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IEmployee> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            const search = new RegExp(value.search, "i");
            match.$or = [
                { firstName: search },
                { lastName: search },
            ]
        }

        if (value.jobRoleId) {
            match.jobRoleId = value.jobRoleId;
        }

        if (value.designationId) {
            match.designationId = value.designationId;
        }

        const [totalData, employees] = await Promise.all([
            Employee.countDocuments(match),
            Employee.find(match).populate("jobRole", "name").populate("designation", "name").sort({ _id: -1 }).skip((value.page - 1) * value.limit).limit(value.limit)
        ]);

        return res.ok("employee", { employees, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getAllEmployeeNames = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getAllEmployeeNameSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IEmployee> = { deletedAt: null, organizationId: user.organizationId }

        const unEnrolledEmployeeIds = await TrainingEnrollment.distinct("employeeId", { deletedAt: null, trainingId: value.trainingId });

        match._id = { $nin: unEnrolledEmployeeIds };

        const employees = await Employee.find(match, "firstName lastName");

        return res.ok("employee", { employees }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getEmployeeById = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getEmployeeByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IEmployee> = { deletedAt: null, organizationId: user.organizationId, _id: value.employeeId };

        const employee = await Employee.findOne<IEmployee>(match).populate("jobRole", "name").populate("designation", "name").lean();

        return res.ok("employee", employee ?? {}, "getDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}