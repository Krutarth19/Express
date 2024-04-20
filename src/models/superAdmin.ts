import mongoose, { Schema } from "mongoose";
import { SuperAdminDocument } from "../types/superAdmin";
import bcrypt from 'bcryptjs';
import { NextFunction } from "express";

const superAdminSchema = new mongoose.Schema<SuperAdminDocument>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        profilePicture: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        password: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: ['customer', 'superAdmin', 'admin', 'seller', 'distributor'],
            default: 'superAdmin',
            required: [true, 'Auth method is required']
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        passwordResetToken: {
            type: String,
            default: null,
        },
        passwordResetTokenExpiry: {
            type: Date,
            default: null,
        },
        phoneNumber: {
            type: Number,
            default: null
        },
        refreshToken: {
            type: Date,
            default: null,
        }
    }, { timestamps: true }
)

superAdminSchema.pre(
    'save',
    async function (
        this: any,
        next: (err?: mongoose.CallbackError) => void,
    ): Promise<void> {
        if (this.isModified('password') && this.authMethod === 'local') {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    },
);

superAdminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const SuperAdmin = mongoose.model<SuperAdminDocument>('SuperAdmin', superAdminSchema);
export default SuperAdmin;