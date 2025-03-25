import { IUser } from "./user";

export interface ILoginResponse extends Pick<IUser, "firstName" | "lastName" | "_id" | "email"> {
    token: string;
    userType: string;
}