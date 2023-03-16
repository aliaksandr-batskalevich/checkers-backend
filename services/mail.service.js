import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_APP_PASSWORD,
            },
        });
    }

    async sendActivationMail(to, link) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: `Activate you account on ${process.env.API_URL}`,
                text: '',
                html:
                    `
                        <div>
                            <h1>Activate your account by link:</h1>
                            <a href="${link}">${link}</a>
                        </div>
                    `
            });
            return {status: 200}

        } catch (e) {
            console.log(e);
            return {status: 500}
        }
    }

}

export default new MailService();