import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import Server from './src/index';

export const app: Application = express();

const server: Server = new Server(app);
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

app.get('/test', (request: Request, response: Response) => {
    return response.status(200).json({
        status: true,
        message: 'api is working'
    })
});

app.listen(port, "localhost", function () {
    console.log(`🚀 Server is running on : http://localhost:${port}`);
})
    .on("error", (err: any) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`server startup error: address already in use`);
            return;
        } else {
            console.log(err);
        }
    })