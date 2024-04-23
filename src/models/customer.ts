import mongoose, { Schema } from "mongoose";
import { CustomerDocument } from "../types/customer";
import bcrypt from 'bcryptjs';
import { NextFunction } from "express";

const customerSchema = new mongoose.Schema<CustomerDocument>(
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
            default: 'customer',
            required: [true, 'Auth method is required']
        },
        googleId: {
            type: String,
            required: false,
        },
        authMethod: {
            type: String,
            enum: ['google', 'local', 'github'],
            default: 'local',
            required: [true, 'Auth method is required']
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        // accountVerificationToken: {
        //     type: String,
        //     default: null
        // },
        // accountVerificationTokenExpiry: {
        //     type: Date,
        //     default: null,
        // },
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
            default: null,
        },
        otp: {
            type: String,
            default: null
        },
        otpExpiry: {
            type: Date,
            default: Date.now(),
        },
        refreshToken: {
            type: Date,
            default: null,
        }
    }, { timestamps: true }
)

customerSchema.pre(
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

customerSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};


const CustomerModel = mongoose.model<CustomerDocument>('Customer', customerSchema);
export default CustomerModel;