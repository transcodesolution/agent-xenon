import mongoose from "mongoose";
import { IRole, RoleTypes } from "@agent-xenon/interfaces";

const roleSchema = new mongoose.Schema({
    name: { type: String, enum: RoleTypes },
    isAdministratorRole: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export const roleModel = mongoose.model<IRole>('role', roleSchema);