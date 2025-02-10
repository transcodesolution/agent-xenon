import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IOrganization extends Document, ITimestamp {
    _id: string;
    name: string;
    description: string;
    address: string;
    ServiceProviders: {
        Google: {
            AccessToken: string;
            Expiry: Date;
            RefreshToken: string;
            Scope: string[];
        };
        //     slack: {
        //  };
        //     whatsapp: {
        //  };
    };
}