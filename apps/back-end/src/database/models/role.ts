import mongoose, { Schema } from "mongoose";
import { IRole, } from "@agent-xenon/interfaces";
import { Permission, RoleType } from "@agent-xenon/constants";

const roleSchema = new mongoose.Schema({
    name: { type: String },
    type: { type: String, enum: RoleType },
    permissions: { type: [String], enum: Permission },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

export const Role = mongoose.model<IRole>('role', roleSchema);