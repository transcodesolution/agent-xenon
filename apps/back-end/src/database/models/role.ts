import mongoose from "mongoose";
import { ROLE_TYPES } from "@agent-xenon/constants";
import { IRole } from "@agent-xenon/interfaces";

const roleSchema = new mongoose.Schema({
    name: { type: String, enum: Object.values(ROLE_TYPES) },
    isAdministratorRole: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export const roleModel = mongoose.model<IRole>('role', roleSchema);