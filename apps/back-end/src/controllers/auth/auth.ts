"use strict"
import { Request, Response } from 'express'
import { User } from '../../database'
import { loginSchema } from "../../validation/auth"
import { IApplicant, IEmployee, ILoginResponse, IRole, IUser } from '@agent-xenon/interfaces'
import Organization from '../../database/models/organization'
import { generateToken } from '../../utils/generate-token'
import { compareHash } from '../../utils/password-hashing'
import Applicant from '../../database/models/applicant'
import { UserType } from '@agent-xenon/constants'
import { RootFilterQuery } from 'mongoose'
import Employee from '../../database/models/employee'

export const login = async (req: Request, res: Response) => {
    try {
        const { error, value } = loginSchema.validate(req.body)

        if (error) {
            return res.badRequest(error?.details[0]?.message, {}, "customMessage")
        }

        const checkOrganizationExist = await Organization.findOne({ name: value.name, deletedAt: null })

        if (!checkOrganizationExist) return res.badRequest("invalid_organization", {})

        const isApplicantLogin = value.userType === UserType.APPLICANT;

        const isEmployeeLogin = value.userType === UserType.EMPLOYEE;

        const loginQuery: RootFilterQuery<IApplicant | IUser> = { organizationId: checkOrganizationExist._id, deletedAt: null };

        let response;
        if (isApplicantLogin) {
            loginQuery["contactInfo.email"] = value.email;
            const applicantData = await Applicant.findOne(loginQuery, "firstName lastName contactInfo password role roleId").populate<{ role: IRole }>("role")
            response = {
                ...applicantData?._doc,
                email: applicantData?.contactInfo.email,
                password: applicantData?.password,
                role: applicantData?.role,
            } as Pick<IApplicant, "firstName" | "lastName" | "password" | "contactInfo" | "role">;
        } else if (isEmployeeLogin) {
            loginQuery["contactInfo.email"] = value.email;
            const employeeData = await Employee.findOne(loginQuery, "firstName lastName contactInfo password role roleId").populate<{ role: IRole }>("role")
            response = {
                ...employeeData?._doc,
                email: employeeData?.contactInfo.email,
                password: employeeData?.password,
                role: employeeData?.role,
            } as Pick<IEmployee, "firstName" | "lastName" | "password" | "contactInfo" | "role">;
        } else {
            loginQuery.email = value.email;
            response = await User.findOne(loginQuery).populate<{ role: IRole }>("role")
        }

        if (!response) return res.badRequest("userNotFound", {})
        if (!response.role) return res.badRequest("user have not valid permissions", {}, "customMessage")

        let passwordMatch: boolean;
        if (isApplicantLogin || isEmployeeLogin) {
            passwordMatch = value.password === response.password;
        } else {
            passwordMatch = await compareHash(value.password, response.password);
        }

        if (!passwordMatch) return res.badRequest("invalidUserPasswordEmail", {})

        let result: ILoginResponse;
        if (typeof response.role !== "string") {
            const token = generateToken({
                _id: response._id,
                type: response.role.type,
                organizationId: checkOrganizationExist._id,
                status: "Login",
                generatedOn: (new Date().getTime())
            })
            result = {
                userType: response.role.type,
                firstName: response?.firstName,
                lastName: response?.lastName,
                _id: response?._id,
                email: response?.email,
                token,
            }
        }

        return res.ok("loginSuccess", result)

    } catch (error) {
        console.log("error", error);
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}

// export const forgot_password = async (req: Request, res: Response) => {
//     reqInfo(req);
//     try {

//         const { error, value } = forgotPasswordSchema.validate(req.body)

//         if (error) {
//             return res.badRequest(error?.details[0]?.message, {}, "customMessage")
//         }

//         let data = await User.findOne(value);

//         if (!data) {
//             return res.badRequest("invalidEmail", {});
//         }
//         // if (data.isBlock == true) {
//         //     return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));
//         // }

//         const otp = await getUniqueOtp()

//         let response: any = { sendMail: true }
//         if (response) {
//             await User.findOneAndUpdate(value, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
//             return res.status(200).json(new apiResponse(200, `${response}`, {}, {}));
//         }
//         else return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${response}`));
//     } catch (error) {
//         return res.internalServerError(error.message, error.stack, "customMessage")
//     }
// };

// export const reset_password = async (req: Request, res: Response) => {
//     reqInfo(req)

//     try {

//         const { error, value } = resetPasswordSchema.validate(req.body)

//         if (error) {
//             return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
//         }

//         const hashPassword = await generateHash(value.password)

//         const payload = { password: hashPassword }

//         let response = await User.findOneAndUpdate({ email: value?.email }, payload, { new: true })
//         if (response) {
//             return res.status(200).json(new apiResponse(200, responseMessage?.resetPasswordSuccess, response, {}))
//         }
//         else return res.status(501).json(new apiResponse(501, responseMessage?.resetPasswordError, {}, {}))

//     } catch (error) {
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }