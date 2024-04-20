import { Application } from 'express';
import customerRoutes from './customer';

export default class Routes {
    constructor(app: Application) {
        app.use('/api/customer', customerRoutes);
    }
}