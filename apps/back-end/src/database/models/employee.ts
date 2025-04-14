import { IEmployee } from '@agent-xenon/interfaces';
import mongoose, { Schema } from 'mongoose';

const AllowanceSchema: Schema = new Schema({
    coreCompensation: { type: Number },
    houseLivingBenefits: { type: Number },
    incentivePerformanceBenefits: { type: Number },
    retirementBenefits: { type: Number },
    transportationMobilityBenefits: { type: Number },
    workRelatedBenefits: { type: Number },
});

const DeductionSchema: Schema = new Schema({
    mandatory: { type: Number },
    optional: { type: Number },
    voluntary: { type: Number },
});

const SalarySchema: Schema = new Schema({
    allowances: { type: AllowanceSchema },
    deductions: { type: DeductionSchema },
    grossSalary: { type: Number },
    netSalary: { type: Number },
    totalCostToCompany: { type: Number },
});

const EmployeeSchema: Schema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    organizationId: { type: Schema.Types.ObjectId },
    salaryDetail: { type: SalarySchema },
    applicantId: { type: Schema.Types.ObjectId },
    jobRoleId: { type: Schema.Types.ObjectId },
    designationId: { type: Schema.Types.ObjectId },
    roleId: { type: Schema.Types.ObjectId },
    joinDate: { type: Date },
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
        },
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