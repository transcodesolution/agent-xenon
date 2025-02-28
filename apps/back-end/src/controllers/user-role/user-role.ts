import { Request, Response } from "express";
import { roleModel } from '../../database/models/role';
import { createUserRoleSchema, deleteUserRoleSchema, getUserRoleSchema, updateUserRoleSchema } from "../../validation/user-role";
import { IRole } from "@agent-xenon/interfaces";
import { FilterQuery } from "mongoose";
import { RoleTypes } from "@agent-xenon/constants";

export const createRole = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createUserRoleSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const existingRole = await roleModel.findOne({ name: value.name });
        if (existingRole) {
            return res.badRequest('Role already exists', {}, 'dataAlreadyExist');
        }

        value.organizationId = user.organizationId;
        const role = new roleModel(value);
        await role.save();

        return res.ok('role', role, 'addDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const getRoles = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = getUserRoleSchema.validate(req.query);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const match: FilterQuery<IRole> = { deletedAt: null, organizationId: user.organizationId }

        if (value.search) {
            match.name = new RegExp(value.search, "i");
        }

        const [totalData, roles] = await Promise.all([
            roleModel.countDocuments(match),
            roleModel.find(match).sort({ _id: 1 }).skip((value.page - 1) * value.limit).limit(value.limit)
        ]);

        return res.ok('roles', { roleData: roles, totalData, state: { page: value.page, limit: value.limit, page_limit: Math.ceil(totalData / value.limit) || 1 } }, 'getDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const getRoleById = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteUserRoleSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const role = await roleModel.findOne({ _id: value.roleId, deletedAt: null });

        if (!role) {
            return res.badRequest('Role not found', {}, 'getDataNotFound');
        }

        return res.ok('role', role, 'getDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const updateRole = async (req: Request, res: Response) => {
    try {
        Object.assign(req.body, req.params);
        const { error, value } = updateUserRoleSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const Query: FilterQuery<IRole> = { _id: value.roleId, deletedAt: null };

        const roleData = await roleModel.findOne(Query);

        if (roleData?.type === RoleTypes.ADMINISTRATOR) {
            return res.badRequest('You can not update the administrator role', {}, 'customMessage');
        }

        // if (roleData?.type === RoleTypes.CANDIDATE) {
        //     return res.badRequest('You can not update the candidate role', {}, 'customMessage');
        // }

        const role = await roleModel.findOneAndUpdate(Query, { $set: value }, { new: true });

        if (!role) {
            return res.badRequest('Role not found', {}, 'getDataNotFound');
        }

        return res.ok('role', role, 'updateDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteUserRoleSchema.validate(req.params);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const Query: FilterQuery<IRole> = { _id: value.roleId, deletedAt: null };

        const roleData = await roleModel.findOne(Query);

        if (roleData?.type === RoleTypes.ADMINISTRATOR) {
            return res.badRequest('You can not delete the administrator role', {}, 'customMessage');
        }

        if (roleData?.type === RoleTypes.CANDIDATE) {
            return res.badRequest('You can not delete the candidate role', {}, 'customMessage');
        }

        const role = await roleModel.findOneAndUpdate(Query, { $set: { deletedAt: Date.now() } });

        if (!role) {
            return res.badRequest('Role not found', {}, 'getDataNotFound');
        }

        return res.ok('role', role, 'deleteDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};