import { Router } from 'express';
import passport from 'passport';
import customerController from '../controllers/customer'
import { validateRequestInput } from '../validators';

class CustomerRoutes {
    router = Router();
    customerController = new customerController();

    constructor() {
        this.intializeRoutes()
    };

    intializeRoutes() {
        this.router
            .route('/signup')
            .post(
                this.customerController.signUp
            )

        this.router
            .route('/signin')
            .post(
                this.customerController.signIn
            )

        // this.router
        //     .route('/activation/:id')
        //     .get(
        //         this.customerController.verifyCustomerController
        //     )

        this.router
            .route('/verify')
            .post(
                this.customerController.verify
            )

        this.router
            .route('/auth/google')
            .get(
                passport.authenticate('google', { scope: ['profile', 'email'] })
            )

        this.router
            .route('/auth/google/callback')
            .get(
                passport.authenticate('google', { scope: ['profile', 'email'] }),
                this.customerController.googleAuth
            )

        // this.router
        //     .route('/profile')
        //     .put(passport.authenticate('customer', { session: false }),
        //         this.customerController.signUp
        //     )

        // this.router
        //     .route('/profile')
        //     .get(passport.authenticate('customer', { session: false }),
        //         this.customerController.signUp
        //     )

        // this.router
        //     .route('/forgotPassword')
        //     .post(passport.authenticate('customer', { session: false }),
        //         this.customerController.signUp
        //     )

        // this.router
        //     .route('/resetPassword')
        //     .post(passport.authenticate('customer', { session: false }),
        //         this.customerController.signUp
        //     )

        // this.router
        //     .route('/verify/resetToken')
        //     .post(passport.authenticate('customer', { session: false }),
        //         this.customerController.signUp
        //     )
    }
}

export default new CustomerRoutes().router;