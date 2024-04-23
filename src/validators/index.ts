import { Request, Response } from "express";

export const validateRequestInput = (schema:any, object:any) => {
    try {
        const validatedData = schema.parse(object);
        return { isValid: true, data: validatedData };
    } catch (error: any) {
        return { isValid: false, error: error.errors };
    }
};
