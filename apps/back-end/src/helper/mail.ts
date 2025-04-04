import nodemailer, { SendMailOptions } from "nodemailer"
import { config } from "../config";
import ejs from "ejs";
import { capitalize } from "../utils/capitalize";
import { IMailTemplate } from "../types/mail-template";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.MAIL,
        pass: config.MAIL_PASSWORD
    },
});

export const sendMail = async (targetMail: string, subject: string, template: string, organizationName: string, extraData: IMailTemplate) => {
    const html = ejs.render(
        template,
        { ...extraData, organizationName: capitalize(organizationName) }
    );

    const mailConfigurations: SendMailOptions = {
        from: config.MAIL,
        to: targetMail,
        subject,
        html,
    };

    return transporter.sendMail(mailConfigurations);
}