import mongoose from "mongoose";
import { IRole, } from "@agent-xenon/interfaces";
import { RoleTypes } from "@agent-xenon/constants";

const roleSchema = new mongoose.Schema({
    name: { type: String, enum: RoleTypes },
    isAdministratorRole: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export const roleModel = mongoose.model<IRole>('role', roleSchema);