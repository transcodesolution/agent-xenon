import { Request, Response } from "express";
import Organization from "../../database/models/organization";
import { userModel } from "../../database";
import { createUpdateUserSchema, deleteUserSchema, getUserSchema, userByIdSchema } from "../../validation/user";
import { FilterQuery } from "mongoose";
import { IUser } from "@agent-xenon/interfaces";
import { generateHash } from "../../utils/password-hashing";
import { sendMail } from "../../helper/mail";

export const getUserPermissions = async (req: Request, res: Response) => {
    const { user } = req.headers;
    return res.ok('permissions', { permissions: user.role.permissions }, 'getDataSuccess');
};

export const getUserDetails = async (req: Request, res: Response) => {
    const { user: userData } = req.headers;
    try {
        const organizationData = await Organization.findOne({ _id: userData.organizationId }, "name description address");
        return res.ok('user details', { userData, organizationData }, 'getDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { body: userData, headers } = req;
    const { user } = headers;
    try {
        const { error, value } = createUpdateUserSchema.validate(userData);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = user.organizationId;

        const newUser = new userModel(value);
        await newUser.save();

        return res.ok('user', { user: newUser }, 'addDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { body: userData, headers } = req;
    const { user } = headers;
    try {
        Object.assign(userData, req.params);
        const { error, value } = createUpdateUserSchema.validate(userData);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        if (value.email) {
            const existingUser = await userModel.findOne({ id: { $ne: value.id }, email: value.email, deletedAt: null, organizationId: user.organizationId });

            if (existingUser) {
                return res.badRequest('Email already exists', {}, 'customMessage');
            }
        }

        if (value.password) {
            value.password = await generateHash(value.password);
        }

        const oldUserData = await userModel.findOne({ _id: value.id, deletedAt: null });

        const updatedUser = await userModel.findOneAndUpdate({ _id: value.id, deletedAt: null }, { $set: value }, { new: true });

        if (!updatedUser) {
            return res.notFound('User not found', {}, 'getDataNotFound');
        }

        if (!oldUserData.email) {
            const organizationData = await Organization.findOne({ _id: user.organizationId }, "name");
            await sendMail(updatedUser.email, "Account Created", `Congratulations, You were added to ${organizationData.name} organization.`);
        } else if (oldUserData.email !== value.email) {
            await sendMail(updatedUser.email, "Account Updated", `Congratulations, Your account information is updated on ${new Date().toString()}. If you not update this information, please make sure to contact the organization admin.`);
        }

        return res.ok('user', { user: updatedUser }, 'updateDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteUserSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const deletedUser = await userModel.updateMany({ _id: { $in: value.ids }, deletedAt: null }, { deletedAt: Date.now() });

        if (deletedUser.matchedCount !== value.ids.length) {
            return res.notFound('Some users', {}, 'getDataNotFound');
        }

        return res.ok('users', {}, 'deleteDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { error, value } = userByIdSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const user = await userModel.findOne({ _id: value.id, deletedAt: null });

        if (!user) {
            return res.notFound('User not found', {}, 'getDataNotFound');
        }

        return res.ok('user details', { user }, 'getDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const getUser = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getUserSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IUser> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            match.$or = [
                { firstName: new RegExp(value.search, "i") },
                { lastName: new RegExp(value.search, "i") },
            ]
        }

        const [totalData, users] = await Promise.all([
            userModel.countDocuments(match),
            userModel.find(match).sort({ _id: 1 }).populate("role", "name type").skip((value.page - 1) * value.limit).limit(value.limit)
        ]);

        return res.ok('user', { userData: users, totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, 'getDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};