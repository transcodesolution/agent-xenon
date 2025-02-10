import { IPermission } from "@agent-xenon/interfaces";
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "module", index: true, },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "role", index: true, },
    view: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

export const permissionModel = mongoose.model<IPermission>('permission', permissionSchema);  