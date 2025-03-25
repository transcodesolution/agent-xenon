import { App } from '@agent-xenon/constants';
import { IApp } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const AppSchema: Schema = new Schema({
  name: { type: String, enum: App, default: App.GOOGLE },
}, { timestamps: true, versionKey: false, });

const AppModel = mongoose.model<IApp>('app', AppSchema);

export default AppModel;