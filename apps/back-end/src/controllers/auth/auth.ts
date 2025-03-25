"use strict"
import { Request, Response } from 'express'
import { userModel } from '../../database'
import { loginSchema } from "../../validation/auth"
import { IApplicant, ILoginResponse, IRole, IUser } from '@agent-xenon/interfaces'
import Organization from '../../database/models/organization'
import { decodeEncodedToken, generateToken } from '../../utils/generate-token'
import { compareHash } from '../../utils/password-hashing'
import Applicant from '../../database/models/applicant'

export const login = async (req: Request, res: Response) => { //email or password // phone or password
    // reqInfo(req)
    // let rootTabs: any;
    try {
        const { error, value } = loginSchema.validate(req.body)

        if (error) {
            return res.badRequest(error?.details[0]?.message, {}, "customMessage")
        }

        if (value.candidateToken) {
            const decodedString = decodeEncodedToken(value.candidateToken);
            value.name = decodedString.orgName;
            value.jobId = decodedString.jobId;
        }

        const checkOrganizationExist = await Organization.findOne({ name: value.name, deletedAt: null })

        if (!checkOrganizationExist) return res.badRequest("invalid_organization", {})

        let response;
        if (value.candidateToken) {
            const applicantData = await Applicant.findOne({ "contactInfo.email": value.email, jobId: value.jobId }, "firstName lastName contactInfo role roleId").populate<{ role: IRole }>("role")
            response = {
                ...applicantData._doc,
                email: applicantData?.contactInfo.email,
                password: applicantData?.contactInfo.password,
                role: applicantData.role,
            } as Pick<IApplicant, "firstName" | "lastName" | "contactInfo" | "role">;
        } else {
            response = await userModel.findOne({ email: value.email, organizationId: checkOrganizationExist._id }).populate<{ role: IRole }>("role")
        }

        if (!response) return res.badRequest("userNotFound", {})
        if (!response.role) return res.badRequest("user have not valid permissions", {}, "customMessage")
        // if (response?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        let passwordMatch: boolean;
        if (value.candidateToken) {
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
                // isEmailVerified: response?.isEmailVerified,
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

//         let data = await userModel.findOne(value);

//         if (!data) {
//             return res.badRequest("invalidEmail", {});
//         }
//         // if (data.isBlock == true) {
//         //     return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}));
//         // }

//         const otp = await getUniqueOtp()

//         let response: any = { sendMail: true }
//         if (response) {
//             await userModel.findOneAndUpdate(value, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
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

//         let response = await userModel.findOneAndUpdate({ email: value?.email }, payload, { new: true })
//         if (response) {
//             return res.status(200).json(new apiResponse(200, responseMessage?.resetPasswordSuccess, response, {}))
//         }
//         else return res.status(501).json(new apiResponse(501, responseMessage?.resetPasswordError, {}, {}))

//     } catch (error) {
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }