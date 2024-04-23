import { Request, Response } from "express";
import CustomerModel from "../models/customer";
import { validateRequestInput } from "../validators";
import { signUpValidator, verifyValidator } from "../validators/customer";
import { decodeToken, generateToken } from "../services/token.service";
import fs from 'fs';
import ejs from 'ejs';
import path from "path";
import sendEmail from "../services/email.service";
import { tokenPayload } from "../types/token";
import { generateOTP } from "../services/otp.service";


export default class Customer {
    constructor() { }

    async signUp(request: Request, response: Response) {
        try {
            const validationResponse = validateRequestInput(signUpValidator, request.body);
            if (!validationResponse.isValid) {
                return response.status(400).json({
                    success: false,
                    message: validationResponse.error[0].message
                });
            }

            const requestdData = validationResponse.data;

            const existingCustomer = await CustomerModel.findOne({ email: requestdData.email })
            if (existingCustomer) {
                if (existingCustomer.isEmailVerified === true) {
                    return response.status(400).json({
                        success: false,
                        message: 'email already exists',
                    });
                }
                else {
                    const otp: string = generateOTP();

                    existingCustomer.otp = otp;
                    await existingCustomer.save();

                    const templatePath = path.join(__dirname, '../templates/signup.confirmation.ejs');
                    const templateFile = fs.readFileSync(templatePath, 'utf-8');

                    const emailContent = ejs.render(templateFile, {
                        name: existingCustomer.name,
                        otp: otp
                    });

                    await sendEmail(existingCustomer, 'Email Confirmation', emailContent);

                    return response.status(200).json({
                        success: true,
                        message: 'verification email sent to your email address'
                    });
                }
            }

            const newCustomer = new CustomerModel({
                email: requestdData.email,
                password: requestdData.password,
                name: requestdData.name
            });

            const otp: string = generateOTP();
            newCustomer.otp = otp;
            newCustomer.otpExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);


            await newCustomer.save();

            const templatePath = path.join(__dirname, '../templates/signup.confirmation.ejs');
            const templateFile = fs.readFileSync(templatePath, 'utf-8');

            const emailContent = ejs.render(templateFile, {
                name: newCustomer.name,
                otp: otp
            });

            await sendEmail(newCustomer, 'Email Confirmation', emailContent);

            return response.status(200).json({
                success: true,
                message: 'verification email sent to your email address'
            });
        } catch (err) {
            console.log('error in signup :', err);
            return response.status(500).json({
                success: false,
                message: 'error in signup',
                error: err
            });
        }
    }

    async verify(request: Request, response: Response) {

        try {
            const validationResponse = validateRequestInput(verifyValidator, request.body);
            if (!validationResponse.isValid) {
                return response.status(400).json({
                    success: false,
                    message: validationResponse.error[0].message
                });
            }

            const requestdData = validationResponse.data;

            const customer: any = await CustomerModel.findOne({
                email: requestdData.email
            });

            if (customer.isEmailVerified) {
                return response.status(200).json({
                    success: false,
                    message: 'customer already verified'
                });
            }

            if (!customer) {
                return response.status(400).json({
                    success: false,
                    message: 'customer not found'
                });
            }

            if (requestdData.otp !== customer.otp) {
                return response.status(400).json({
                    success: false,
                    message: 'invalid OTP'
                });
            }

            if (Date.now() > customer.otpExpiry.getTime()) {
                return response.status(400).json({
                    success: false,
                    message: 'OTP expired'
                });
            }

            customer.isEmailVerified = true;

            const templatePath = path.join(__dirname, '../templates/signup.welcome.ejs');
            const templateFile = fs.readFileSync(templatePath, 'utf-8');

            const emailContent = ejs.render(templateFile, {
                name: customer.name,
            });

            await sendEmail({ name: customer.name, email: customer.email }, 'Welcome Email', emailContent);
            await customer.save();

            response.status(200).json({
                success: true,
                message: 'email verified successfully',
            });
        } catch (error: any) {
            console.log('error in verify email :', error);
            return response.status(500).json({
                success: false,
                message: 'error while verify email',
                error: error
            });
        }
    }

    async signIn(request: Request, response: Response) {
        try {
            const validationResponse = validateRequestInput(signUpValidator, request.body);
            if (!validationResponse.isValid) {
                return response.status(400).json({
                    success: false,
                    message: validationResponse.error[0].message
                });
            }

            const requestdData = validationResponse.data;
            const customer: any = await CustomerModel.findOne({ email: requestdData.email })

            if (customer?.isEmailVerified === false) {
                return response.status(400).json({
                    success: false,
                    message: 'plase verify your email before login'
                })
            };

            const isPasswordCorrect = await customer.comparePassword(requestdData.password);

            if (!isPasswordCorrect) {
                return response.status(400).json({
                    success: false,
                    message: 'invalid credentials'
                });
            }

            const payload = {
                name: customer.name,
                email: customer.email,
                role: customer.role,
                isEmailVerified: customer.isEmailVerified,
                _id: customer._id
            }
            const options = { httpOnly: true, secure: false };


            const token = generateToken(payload, process.env.USER_ACCESS_SECRET as string, process.env.USER_ACCESS_SECRET_EXPIRY as string)

            response.cookie('authToken', token, options).status(200).json({
                success: true,
                message: 'login successfull',
                token: token
            });

        } catch (error: any) {
            console.log('error in signin customer :', error);
            return response.status(500).json({
                success: false,
                message: 'error in signin customer',
                error: error
            });
        }
    }

    async googleAuth(request: Request, response: Response) {
        try {
            const userData: any = request.user;

            const options: any = {
                httpOnly: true,
                secure: false
            };

            response.cookie('authToken', userData.accessToken, options).status(200).json(
                {
                    success: true,
                    message: 'Login Successfull',
                    data: userData.accessToken
                }
            );
        } catch (error: any) {
            console.log('error in google auth :', error);
        }

    }

}