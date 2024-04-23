import { z } from 'zod';

export const signUpValidator = z.object({
    name: z.string({ required_error: 'name is required' }).min(2, 'Name must be at least 2 characters long'),
    email: z.string({ required_error: 'email is required' }).email('invalid email'),
    password: z.string({ required_error: 'password is required' })
        .min(4, 'password must be atleast 4 characters long')
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{8,}$/, 'at least one uppercase, one lowercase, one digit, and one special character required.')
})

export const signInValidator = z.object({
    email: z.string({ required_error: 'email is required' }).email('invalid email'),
    password: z.string({ required_error: 'password is required' })
        .min(4, 'invalid password')
})

export const verifyValidator = z.object({
    email: z.string({ required_error: 'email is required' }).email('invalid email'),
    otp: z.string({ required_error: 'OTP is required' }).length(6,'OTP must be 6 digits')
})

