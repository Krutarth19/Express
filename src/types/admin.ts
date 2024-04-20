import { Document } from "mongoose";

export interface AdminDocument extends Document{
    name:string;
    profilePicture:string | null;
    email: string;
    password:string;
    role:string;
    lastLogin:Date;
    passwordResetToken: string | null;
    passwordResetTokenExpiry: Date;
    phoneNumber: number | null;
    refreshToken:string | null;
}