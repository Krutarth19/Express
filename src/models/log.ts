import mongoose, { Schema } from 'mongoose';
import { LogDocument } from '../types/log.interfaces';

const logSchema = new mongoose.Schema<LogDocument>({
    requestApi: {
        type: String,
        default: null,
    },
    requestBody: {
        type: String,
        default: ''
    },
    responseStatusCode: {
        type: Number,
        default: 200,
    },
    responseData: {
        type: String,
        default: ''
    },
    userData: {
        type: String,
        default: ''
    },
    executionTimeInMS: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Log = mongoose.model<LogDocument>('Log', logSchema);
export default Log;