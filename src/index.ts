import {
    Application,
    urlencoded,
    json,
    static as serveStatic,
    Request,
    NextFunction,
}
    from "express";
import morgan from "morgan";
import fs from 'fs';
import expressSession from 'express-session';
import winston from 'winston';
import cors from 'cors';
import path from "path";
import { requestLog } from './services/log.service';
import { unCoughtErrorHandler } from './handlers/errorHandler';
import { connectDB } from "./config/dbConfig";
import { config } from "./types/default";
import passport from "./services/passport.service";
passport.initialize()
// import rateLimit from 'express-rate-limiter';
// import Routes from './routes';

// const rateLimitWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS!, 1800000);
// const rateLimitMaxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!, 50);

export default class Server {
    constructor(app: Application) {
        this.config(app);
        //   new Routes(app);
    }

    public config(app: Application): void {
        const accessLogStream: fs.WriteStream = fs.createWriteStream(
            path.join(__dirname, './logs/access.log'),
            { flags: 'a' },
        );
        app.use(function (request: Request, response: any, next: NextFunction) {
            const beforeTime = new Date().getTime();
            const old = response.json.bind(response);
            response.json = (body) => {
                old(body);
                const afterTime = new Date().getTime();
                requestLog(request, {
                    responseStatusCode: response.statusCode,
                    responseData: body,
                    beforeTime: beforeTime,
                    afterTime: afterTime,
                });
            };
            next();
        });
        connectDB();
        app.use(cors());
        app.use(morgan('combined', { stream: accessLogStream }));
        app.use(urlencoded({ extended: true }));
        app.use(json());
        app.use(expressSession({
            secret: config.SESSION_SECRET,
            resave: false,
            saveUninitialized: true
        }))
        // app.use(rateLimit({
        //     windowMs: rateLimitWindowMs,
        //     max: rateLimitMaxRequests,
        //     message: 'Too many requests from this IP, please try again later'
        // }));
        app.use('/uploads', serveStatic(path.join(__dirname, './uploads')));
        app.use(unCoughtErrorHandler);
    }
}

process.on('beforeExit', function (err) {
    winston.error(JSON.stringify(err));
    console.error(err);
});