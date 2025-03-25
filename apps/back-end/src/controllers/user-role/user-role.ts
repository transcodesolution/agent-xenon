import { Request, Response } from "express";
import { roleModel } from '../../database/models/role';
import { createUserRoleSchema, deleteUserRoleSchema, getUserRoleSchema, updateUserRoleSchema } from "../../validation/user-role";
import { IRole } from "@agent-xenon/interfaces";
import { FilterQuery } from "mongoose";
import { RoleType } from "@agent-xenon/constants";
import { checkSystemRoles } from "../../utils/user-role";

export const createRole = async (req: Request, res: Response) => {
    const { user } = req.headers;
    try {
        const { error, value } = createUserRoleSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        value.organizationId = user.organizationId;
        const role = new roleModel(value);
        role.type = RoleType.CUSTOM;
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

        if (roleData?.type === RoleType.ADMINISTRATOR) {
            return res.badRequest('You can not update the administrator role', {}, 'customMessage');
        }

        if (roleData?.type === RoleType.CANDIDATE) {
            return res.badRequest('You can not update the candidate role', {}, 'customMessage');
        }

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
        const { error, value } = deleteUserRoleSchema.validate(req.body);

        if (error) {
            return res.badRequest(error.details[0].message, {}, "customMessage");
        }

        const Query: FilterQuery<IRole> = { _id: { $in: value.roleIds }, deletedAt: null };

        const roles = await roleModel.find(Query);

        if (roles.length !== value.roleIds.length) {
            return res.badRequest('Some roles', {}, 'getDataNotFound');
        }

        if (checkSystemRoles(roles, true)) {
            return res.badRequest('You can not delete the administrator role', {}, 'customMessage');
        }

        if (checkSystemRoles(roles, false)) {
            return res.badRequest('You can not delete the candidate role', {}, 'customMessage');
        }

        await roleModel.updateMany(Query, { $set: { deletedAt: Date.now() } });

        return res.ok('roles', {}, 'deleteDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};