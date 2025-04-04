import nodemailer, { SendMailOptions } from "nodemailer"
import { config } from "../config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.MAIL,
        pass: config.MAIL_PASSWORD
    },
});

export const sendMail = async (targetMail: string, subject: string, html: string) => {
    const mailConfigurations: SendMailOptions = {
        from: config.MAIL,
        to: targetMail,
        subject,
        html,
    };

    return transporter.sendMail(mailConfigurations);
}