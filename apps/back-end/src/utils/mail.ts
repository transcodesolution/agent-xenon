import { IMailTemplate } from "../types/mail-template";
import ejs from "ejs";
import { capitalize } from "../utils/capitalize";

export const generateMailBody = ({ template, organizationName, extraData }: { template: string, organizationName: string, extraData: IMailTemplate }) => {
    return ejs.render(
        template,
        { ...extraData, organizationName: capitalize(organizationName) }
    );
}