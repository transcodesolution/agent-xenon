import { Request, Response } from "express";
import Organization from "../../database/models/organization";

export const getUserPermissions = async (req: Request, res: Response) => {
    const { user } = req.headers;
    return res.ok('permissions', { permissions: user.roleId.permissions }, 'getDataSuccess');
};

export const getUserDetails = async (req: Request, res: Response) => {
    const { user: userData } = req.headers;
    try {
        const organizationData = await Organization.findOne({ _id: userData.organizationId });
        return res.ok('user details', { userData, organizationData }, 'getDataSuccess');
    } catch (error) {
        return res.internalServerError(error.message, error.stack, 'customMessage');
    }
};