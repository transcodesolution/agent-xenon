import { IModule } from "@agent-xenon/interfaces";
import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    tabName: { type: String },
    displayName: { type: String, default: null },
    tabUrl: { type: String },
    image: { type: String, default: null },
    deletedAt: { type: Date, default: null, },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: "module" },
}, { timestamps: true, versionKey: false })

export const moduleModel = mongoose.model<IModule>('module', moduleSchema);