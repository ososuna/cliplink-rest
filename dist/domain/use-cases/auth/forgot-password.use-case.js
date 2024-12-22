import fs from 'fs/promises';
import path from 'path';
import { Resend } from 'resend';
import { IdAdapter, envs } from '../../../config';
import { CustomError } from '../../';
export class ForgotPassword {
    constructor(authRepository, idGenerator = IdAdapter.generateId) {
        this.authRepository = authRepository;
        this.idGenerator = idGenerator;
    }
    async execute(email) {
        const user = await this.authRepository.getUserByEmail(email);
        const token = this.idGenerator();
        const resetPasswordToken = await this.authRepository.saveResetPasswordToken(user.id, token);
        const url = envs.WEB_APP_URL + '/auth/reset-password/' + resetPasswordToken.token;
        // Load the email template
        const templatePath = path.resolve(__dirname, '../../../assets/templates/reset-password.template.html');
        let emailHtml = await fs.readFile(templatePath, 'utf-8');
        emailHtml = emailHtml.replace('{{resetLink}}', url);
        const resend = new Resend(envs.RESEND_API_KEY);
        const resp = await resend.emails.send({
            from: 'send@cliplink.app',
            to: user.email,
            subject: 'Password Reset',
            html: emailHtml
        });
        if (resp.error)
            throw CustomError.internalServer('Error sending email');
    }
}
//# sourceMappingURL=forgot-password.use-case.js.map