import mongoose, { Schema } from 'mongoose';
import { IOrganization } from "@agent-xenon/interfaces";

const OrganizationSchema: Schema = new Schema({
    name: { type: String, unique: true },
    description: { type: String },
    address: { type: String },
    serviceProviders: {
        type: [{
            accessToken: { type: String },
            expiry: { type: Date },
            refreshToken: { type: String },
            scope: { type: String, },
            appId: { type: Schema.Types.ObjectId, },
        }]
    },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true, versionKey: false
});

const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);

export default Organization;