const nodemailer = require('nodemailer');
const ejs = require('ejs');
const dotenv = require('dotenv').config();

const sendEmail = async (data:any, subject:string, emailContent:any) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_MAIL_HOST,
            port: process.env.SMTP_MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_MAIL_USER,
                pass: process.env.SMTP_MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_MAIL_USER,
            to: data.email,
            subject: subject,
            html: emailContent
        });

        console.log('email sent successfully');
    } catch (error) {
        console.log('error in sending email :', error);
    }
};

export default sendEmail;