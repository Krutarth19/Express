import { Application } from 'express';
import customerRoutes from './customer';

export default class Routes {
    constructor(app: Application) {
        app.use('/api/v1/customers', customerRoutes);
    }
}