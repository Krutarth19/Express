import { Request } from "express";
import Log from "../models/log";
const maxResponseSize = 4294967296; // 2^32 for long text

export const requestLog = async (
    request: Request,
    { responseStatusCode, responseData, beforeTime, afterTime }) => {
    try {
        if (!request.user) {
            request.user = { id: 0, email: '' }
        }

        responseData = JSON.stringify(responseData);

        if (Buffer.byteLength(responseData) > maxResponseSize) {
            responseData = responseData.slice(0, maxResponseSize - 1)
        };

        const executionTimeInMSIn = afterTime - beforeTime;

        const logData = await Log.create({
            requestApi:request.originalUrl,
            requestBody:JSON.stringify(request.body),
            responseStatusCode:responseStatusCode,
            responseData:responseData,
            userData:JSON.stringify(request.user),
            executionTimeInMS:executionTimeInMSIn
        });

        
    } catch (error) {
        console.log('error in writing log')
    }
}