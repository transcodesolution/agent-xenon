import nodemailer, { SendMailOptions } from "nodemailer"
import { config } from "../config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.MAIL,
        pass: config.MAIL_PASSWORD
    },
});

export const sendMail = (targetMail: string, subject: string, text: string) => {
    const mailConfigurations: SendMailOptions = {
        from: config.MAIL,
        to: targetMail,
        subject,
        text,
    };

    return transporter.sendMail(mailConfigurations);
}