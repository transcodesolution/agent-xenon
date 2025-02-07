import mongoose from "mongoose";
import { IUser } from "@agent-xenon/interfaces";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, },
    password: { type: String, required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, default: "Organization" },
    roleId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "role" },
    deletedAt: { type: Date, default: null, },
}, { timestamps: true, versionKey: false })

export const userModel = mongoose.model<IUser>('user', userSchema);