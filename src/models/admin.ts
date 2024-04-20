import mongoose, { Schema } from "mongoose";
import { AdminDocument } from "../types/admin";
import bcrypt from 'bcryptjs';
import { NextFunction } from "express";

const adminSchema = new mongoose.Schema<AdminDocument>(
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
            enum: ['customer', 'superAdmin', 'admin','seller','distributor'],
            default: 'admin',
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

adminSchema.pre(
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

adminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model<AdminDocument>('Admin', adminSchema);
export default Admin;