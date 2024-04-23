import { Response } from 'express';
import otpGenerator from 'otp-generator';

export const generateOTP = (): string => {
    try {
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        return otp;
    } catch (error: any) {
        console.log('error in otp generation :', error);
        return error;
    }
} 