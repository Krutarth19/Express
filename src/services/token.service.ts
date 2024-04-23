import jwt from 'jsonwebtoken';
import { tokenPayload } from '../types/token';

export const generateToken = (payload: tokenPayload, secret: string, expiry: string): string => {
    const token = jwt.sign(payload, secret, { expiresIn: expiry });
    return token;
}

export const decodeToken = (token: string, secret: string): any => {
    try {
        const decodedToken = jwt.verify(token, secret);
        return decodeToken;
    } catch (error: any) {
        console.log('error ', error.message);
    }
}