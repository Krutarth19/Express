import { Router } from 'express';
import passport from 'passport';
import customerController from '../controllers/customer'

class CustomerRoutes {
    router = Router();
    customerController = new customerController();

    constructor() {
        this.intializeRoutes()
    };

    intializeRoutes() {
        this.router
            .route('/signin')
            .post(
                passport.authenticate('customer', { session: false }),
                this.customerController.signIn
            )

        this.router
            .route('/signup')
            .post(passport.authenticate('customer', { session: false }),
                this.customerController.signUp
            )
    }
}

export default new CustomerRoutes().router;