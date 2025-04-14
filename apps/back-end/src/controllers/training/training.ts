import { Request, Response } from "express";
import { FilterQuery, QuerySelector } from "mongoose";
import { IApplicant, ITraining } from "@agent-xenon/interfaces";
import { addEditEmployeeTrainingSchema, addEnrollmentInTrainingSchema, deleteEmployeeTrainingSchema, deleteEnrollmentInTrainingSchema, getEmployeeTrainingByIdSchema, getEmployeeTrainingSchema } from "../../validation/training";
import Training from "../../database/models/training";
import TrainingEnrollment from "../../database/models/training-enrollment";

export const createEmployeeTraining = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = addEditEmployeeTrainingSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = user.organizationId;
        const training = await Training.create(value);

        return res.ok("employee training", training, "addDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const updateEmployeeTraining = async (req: Request, res: Response) => {
    try {
        req.body.trainingId = req.params.trainingId;
        const { error, value } = addEditEmployeeTrainingSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTrainingExist = await Training.findOne({ _id: value.trainingId, deletedAt: null });

        if (!checkTrainingExist) return res.badRequest("employee training", {}, "getDataNotFound");

        const training = await Training.findByIdAndUpdate(value.trainingId, { $set: value }, { new: true });

        return res.ok("employee training", training, "updateDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteEmployeeTraining = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = deleteEmployeeTrainingSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const condition: QuerySelector<IApplicant> = { $in: value.trainingIds };

        const match: FilterQuery<IApplicant> = { _id: condition, organizationId: user.organizationId, deletedAt: null };

        const checkTrainingsExist = await Training.find(match);

        if (checkTrainingsExist.length !== value.trainingIds.length) return res.badRequest("employee training", {}, "getDataNotFound");

        await Training.updateMany({ _id: condition, deletedAt: null }, { $set: { deletedAt: new Date() } });

        return res.ok("employee trainings", {}, "deleteDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getTrainings = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getEmployeeTrainingSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<ITraining> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            const search = new RegExp(value.search, "i");
            match.$or = [
                { name: search },
                { description: search },
            ]
        }

        const [totalData, trainings] = await Promise.all([
            Training.countDocuments(match),
            Training.find(match).sort({ _id: -1 }).skip((value.page - 1) * value.limit).limit(value.limit)
        ]);

        return res.ok("trainings", { trainings, totalData: totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, "getDataSuccess")
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const getTrainingById = async (req: Request, res: Response) => {
    try {
        const { error, value } = getEmployeeTrainingByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<ITraining> = { deletedAt: null, _id: value.trainingId };

        const trainingData = await Training.findOne<ITraining>(match, "name description").populate("enrollments").lean();

        return res.ok("training", trainingData ?? {}, "getDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const addEnrollmentInTraining = async (req: Request, res: Response) => {
    try {
        const { error, value } = addEnrollmentInTrainingSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTrainingExist = await Training.findOne({ _id: value.trainingId, deletedAt: null });

        if (!checkTrainingExist) return res.badRequest("employee training", {}, "getDataNotFound");

        const Query = { trainingId: value.trainingId, deletedAt: null, employeeId: { $in: value.employeeIds } };

        const enrollments = await TrainingEnrollment.find(Query);

        if (enrollments.length > 0) {
            return res.badRequest("employees already enroll in training", {}, "customMessage")
        }

        const enrollmentObject = { trainingId: value.trainingId };

        await TrainingEnrollment.insertMany(value.employeeIds.map((i) => ({ employeeId: i, ...enrollmentObject })));

        return res.ok("employees enrolled in training", {}, "customMessage");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

export const deleteEnrollmentInTraining = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteEnrollmentInTrainingSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const checkTrainingExist = await Training.findOne({ _id: value.trainingId, deletedAt: null });

        if (!checkTrainingExist) return res.badRequest("employee training", {}, "getDataNotFound");

        const Query = { trainingId: value.trainingId, deletedAt: null, employeeId: { $in: value.employeeIds } };

        const enrollments = await TrainingEnrollment.find(Query);

        if (enrollments.length !== value.employeeIds.length) {
            return res.badRequest("employees enrollment is not found in training", {}, "getDataNotFound")
        }

        await TrainingEnrollment.updateMany(Query, { $set: { deletedAt: Date.now() } });

        return res.ok("enrolled employees", {}, "deleteDataSuccess");
    } catch (error) {
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}