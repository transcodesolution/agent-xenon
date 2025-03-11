import mongoose from "mongoose";
import { IRole, IUser } from "@agent-xenon/interfaces";

const userSchema = new mongoose.Schema({
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, index: true, },
    password: { type: String, },
    organizationId: { type: mongoose.Schema.Types.ObjectId, default: "Organization" },
    roleId: { type: mongoose.Schema.Types.ObjectId, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "user" },
    deletedAt: { type: Date, default: null, },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true
    },
    virtuals: {
        role: {
            options: {
                ref: 'role',
                localField: 'roleId',
                foreignField: '_id',
                justOne: true
            }
        }
    }
});

export const userModel = mongoose.model<IUser<IRole>>('user', userSchema);