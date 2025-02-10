"use strict"
import { Request, Response } from 'express'
import { roleModel, userModel } from '../../database'
import { loginSchema } from "../../validation/auth"
import { ILoginResponse, IRole, IUser } from '@agent-xenon/interfaces'
import { compareHash, generateHash, generateToken } from '../../utils/common_utils'
import Organization from '../../database/models/organization'


// export const signUp = async (req: Request, res: Response) => {
//     reqInfo(req)
//     try {

//         const { error, value } = signUpSchema.validate(req.body)

//         if (error) {
//             return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
//         }

//         let isAlready: any = await userModel.findOne({
//             $or: [
//                 { email: value?.email }
//             ]
//         })

//         if (isAlready) {
//             if (isAlready.email === value?.email) {
//                 return res.status(409).json(new apiResponse(409, responseMessage?.alreadyEmail, {}, {}));
//             }
//         }


//         if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

//         const payload = { ...value }

//         payload.password = await generateHash(payload.password)
//         let response = await new userModel(payload).save()
//         response = {
//             userType: response?.userType,
//             isEmailVerified: response?.isEmailVerified,
//             _id: response?._id,
//             email: response?.email,
//         }

//         const otp = await getUniqueOtp()

//         // let result: any = await email_verification_mail(response, otp);

//         // if (!result) {
//         //     return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
//         // }

//         // letawait userModel.findOneAndUpdate(value, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
//         // return res.status(200).json(new apiResponse(200, `${otp}`, {}, {}));
//         return res.status(200).json(new apiResponse(200, "Signup Successfully", response, {}))
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }

// export const otp_verification = async (req: Request, res: Response) => {
//     reqInfo(req)
//     try {

//         const { error, value } = otpVerifySchema.validate(req.body)

//         if (error) {
//             return res.status(501).json(new apiResponse(501, error?.details[0]?.message, {}, {}));
//         }

//         let data = await userModel.findOne(value);
//         if (!data) return res.status(400).json(new apiResponse(400, responseMessage?.invalidOTP, {}, {}))
//         if (data.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))
//         if (new Date(data.otpExpireTime).getTime() < new Date().getTime()) return res.status(410).json(new apiResponse(410, responseMessage?.expireOTP, {}, {}))
//         if (data) {
//             let response = await userModel.findOneAndUpdate(value, { otp: null, otpExpireTime: null, isEmailVerified: true, isLoggedIn: true }, { new: true });
//             const token = generateToken({
//                 _id: response._id,
//                 status: "Login",
//                 generatedOn: (new Date().getTime())
//             })

//             await new userSessionModel({
//                 createdBy: response._id,
//             }).save()

//             const result = {
//                 isEmailVerified: response?.isEmailVerified,
//                 _id: response?._id,
//                 email: response?.email,
//                 token,
//             }
//             return res.status(200).json(new apiResponse(200, responseMessage?.OTPverified, result, {}))
//         }

//     } catch (error) {
//         return res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, error))
//     }
// }

export const login = async (req: Request, res: Response) => { //email or password // phone or password
    // reqInfo(req)
    // let rootTabs: any;
    try {

        const { error, value } = loginSchema.validate(req.body)

        if (error) {
            return res.badRequest(error?.details[0]?.message, {}, "customMessage")
        }

        const checkOrganizationExist = await Organization.findOne({ name: value.name, deletedAt: null })

        if (!checkOrganizationExist) return res.badRequest("invalid_organization", {})

        const response = await userModel.findOne({ email: value.email }).populate("roleId").lean()

        if (!response) return res.badRequest("userNotFound", {})
        // if (response?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const passwordMatch = await compareHash(value.password, response.password)
        if (!passwordMatch) return res.badRequest("invalidUserPasswordEmail", {})

        let result: ILoginResponse;
        if (typeof response.roleId !== "string") {
            const token = generateToken({
                _id: response._id,
                type: response.roleId.name,
                organizationId: checkOrganizationExist._id,
                status: "Login",
                generatedOn: (new Date().getTime())
            })
            result = {
                // isEmailVerified: response?.isEmailVerified,
                userType: response.roleId.name,
                firstName: response?.firstName,
                lastName: response?.lastName,
                _id: response?._id,
                email: response?.email,
                token,
            }
        }

        // if (response.roleId && typeof response.roleId !== "string") {
        //     const roleId = await roleModel.findOne({ _id: ObjectId(response.roleId?._id), deletedAt: null })
        //     let match: any = {}
        //     match.roleId = ObjectId(roleId._id)

        //     roleDetails = await permissionModel.find({ roleId: ObjectId(roleId._id), deletedAt: null }).populate('moduleId').lean()

        //     const tabMap = new Map();
        //     roleDetails.forEach(roleDetail => {
        //         const tab = roleDetail.moduleId;
        //         const moduleId = tab._id.toString();

        //         if (!tabMap.has(moduleId)) {
        //             tab.childTabs = [];
        //             tabMap.set(moduleId, tab);
        //         }
        //     });

        //     Build the hierarchy by adding child tabs to their respective parent tabs
        //     rootTabs = [];
        //     roleDetails.forEach(roleDetail => {

        //         const tab = roleDetail.moduleId;

        //         const parentId = tab.parentId ? tab.parentId.toString() : null;

        //         const parentTab = tabMap.get(parentId);

        //         if (parentTab) {
        //             parentTab.childTabs.push(roleDetail);
        //         } else {
        //             //if parentId null then and then push
        //             rootTabs.push(roleDetail);
        //         }
        //     });
        //     result.tabs = rootTabs
        // }

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

export const onBoardOrganization = async (req: Request, res: Response) => {
    // reqInfo(req)
    try {
        const body = req.body;
        const isAlready = await userModel.findOne({ email: body?.email, deletedAt: null });
        if (isAlready) return res.badRequest("alreadyEmail", {});

        // if (isAlready?.isBlock == true) return res.status(403).json(new apiResponse(403, responseMessage?.accountBlock, {}, {}))

        const hashPassword = await generateHash(body.password);
        delete body.password
        body.password = hashPassword
        body.userType = 1  //to specify this user is admin
        const response = new Organization(body)
        await response.save()
        body.organizationId = response._id;
        body.roleId = (await roleModel.findOne({ isAdministratorRole: true, deletedAt: null }))._id;
        await new userModel(body).save()

        // const otp = await getUniqueOtp()

        // let result: any = await email_verification_mail(response, otp);
        // if (result) {
        //     await userModel.findOneAndUpdate(body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
        // return res.status(200).json(new apiResponse(200, `${response}`, {}, {}));
        return res.ok("org_onboard_success", response)
        // }
        // return res.status(501).json(new apiResponse(501, responseMessage?.errorMail, {}, `${result}`));
    } catch (error) {
        console.error(error);
        return res.internalServerError(error.message, error.stack, "customMessage")
    }
}