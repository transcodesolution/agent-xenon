import { Document } from "mongoose";
import { ITimestamp } from "./timestamp";

export interface IOrganization extends Document, ITimestamp {
    _id: string;
    name: string | null;
    description: string | null;
    address: string | null;
    serviceProviders: {
        google: {
            AccessToken: string | null;
            Expiry: Date | null;
            RefreshToken: string | null;
            Scope: string[] | null;
        };
        //     slack: {
        //  };
        //     whatsapp: {
        //  };
    };
}