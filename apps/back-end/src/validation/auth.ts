import Joi from "joi";

export const paginationSchema = {
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
};

export const signUpSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const loginSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
});

// export const resetPasswordSchema = Joi.object().keys({
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).max(15).required(),
// });

// export const otpVerifySchema = Joi.object().keys({
//     otp: Joi.string().pattern(/^\d{6}$/).required(),
// });

// export const forgotPasswordSchema = Joi.object().keys({
//     email: Joi.string().email().required(),
// });