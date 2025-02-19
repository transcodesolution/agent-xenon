import { ITimestamp } from "./timestamp";

export interface IOrganization extends ITimestamp {
    _id: string;
    name: string;
    description: string;
    address: string;
    serviceProviders: {
        google: {
            accessToken: string;
            expiry: Date;
            refreshToken: string;
            scope: string;
            email: string,
        };
        //     slack: {
        //  };
        //     whatsapp: {
        //  };
    };
}