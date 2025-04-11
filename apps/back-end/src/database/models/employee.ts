import { IEmployee } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const EmployeeSchema: Schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    organizationId: { type: Schema.Types.ObjectId },
    salary: { type: Number },
    applicantId: { type: Schema.Types.ObjectId },
    jobRoleId: { type: Schema.Types.ObjectId },
    designationId: { type: Schema.Types.ObjectId },
    roleId: { type: Schema.Types.ObjectId },
    contactInfo: {
        address: { type: String },
        city: { type: String },
        email: { type: String },
        phoneNumber: { type: String },
        state: { type: String },
    },
    deletedAt: { type: Date, default: null }
}, {
    timestamps: true, versionKey: false,
    toJSON: {
        virtuals: true,
        transform: function (_, ret) {
            delete ret.deletedAt;
            delete ret.updatedAt;
            delete ret.organizationId;
            delete ret.roleId;
            delete ret.applicantId;
            return ret;
        }
    },
    virtuals: {
        role: {
            options: {
                ref: 'role',
                localField: 'roleId',
                foreignField: '_id',
                justOne: true
            }
        },
        jobRole: {
            options: {
                ref: 'JobRole',
                localField: 'jobRoleId',
                foreignField: '_id',
                justOne: true,
                match: { deletedAt: null }
            }
        },
        designation: {
            options: {
                ref: 'Designation',
                localField: 'designationId',
                foreignField: '_id',
                justOne: true,
                match: { deletedAt: null }
            }
        }
    }
});

EmployeeSchema.post("findOne", function (doc: IEmployee) {
    if (doc) {
        delete doc.deletedAt;
        delete doc.updatedAt;
        delete doc.organizationId;
        delete doc.roleId;
        delete doc.applicantId;
        return doc;
    }
});

const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;