import { Document } from 'mongoose';

export interface CustomerDocument extends Document {
    name: string;
    profilePicture: string | null;
    email: string;
    password?: string;
    role: string;
    googleId?: string;
    authMethod: string;
    isEmailVerified: boolean;
    lastLogin: Date;
    accountVerificationToken: string | null;
    accountVerificationTokenExpiry: Date;
    passwordResetToken: string | null;
    passwordResetTokenExpiry: Date;
    phoneNumber: number | null;
    refreshToken:string | null;
}
