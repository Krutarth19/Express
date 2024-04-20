import { Document } from "mongoose";

export interface LogDocument extends Document {
    requestApi: string | null;
    requestBody: string;
    responseStatusCode: number;
    responseData: string;
    userData: string;
    executionTimeInMS: number
}