import { ITimestamp } from "./timestamp";

export interface IServiceProvider {
    accessToken: string;
    expiry: Date;
    refreshToken: string;
    scope?: string;
    appId: string;
}

export interface IOrganization extends ITimestamp {
    _id: string;
    name: string;
    description: string;
    address: string;
    serviceProviders: IServiceProvider[];
}