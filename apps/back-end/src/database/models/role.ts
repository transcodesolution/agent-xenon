import mongoose, { Schema } from "mongoose";
import { IRole, } from "@agent-xenon/interfaces";
import { Permission, RoleTypes } from "@agent-xenon/constants";

const roleSchema = new mongoose.Schema({
    name: { type: String },
    type: { type: String, enum: RoleTypes },
    permissions: { type: [String], enum: Permission },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

export const roleModel = mongoose.model<IRole>('role', roleSchema);