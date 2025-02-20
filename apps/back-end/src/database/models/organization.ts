import mongoose, { Schema } from 'mongoose';
import { IOrganization } from "@agent-xenon/interfaces";

const OrganizationSchema: Schema = new Schema({
    name: { type: String, unique: true },
    description: { type: String },
    address: { type: String },
    serviceProviders: {
        type: {
            google: {
                accessToken: { type: String },
                expiry: { type: Date },
                refreshToken: { type: String },
                scope: { type: String, },
                email: { type: String },
            },
            // Slack: {

            // },
            // Whatsapp: {
            // },
        }
    },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization;