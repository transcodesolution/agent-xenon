import mongoose, { Schema } from 'mongoose';
import { IOrganization } from "@agent-xenon/interfaces";

const OrganizationSchema: Schema = new Schema({
    name: { type: String, unique: true },
    description: { type: String },
    address: { type: String },
    ServiceProviders: {
        type: {
            Google: {
                AccessToken: { type: String },
                Expiry: { type: Date },
                RefreshToken: { type: String },
                Scope: [{ type: String, }],
            },
            // Slack: {

            // },
            // Whatsapp: {
            // },
        }
    },
}, { timestamps: true, versionKey: false });

const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization;