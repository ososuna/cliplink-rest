import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { Resend } from 'resend';
import { IdAdapter, Messages, envs } from '../../../config';
import { AuthRepository, CustomError } from '../../';

interface ForgotPasswordUseCase {
  execute(email: string): Promise<void>;
}

type IdGenerator = () => string;

export class ForgotPassword implements ForgotPasswordUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly idGenerator: IdGenerator = IdAdapter.generateId,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.authRepository.getUserByEmail(email);
    const token = this.idGenerator();

    const resetPasswordToken = await this.authRepository.saveResetPasswordToken(user.id, token);
    const url = envs.WEB_APP_URL + '/auth/reset-password/' + resetPasswordToken.token;
    
    // Load the email template
    const templatePath = resolve(__dirname, '../../../assets/templates/reset-password.template.html');
    let emailHtml = await readFile(templatePath, 'utf-8');
    emailHtml = emailHtml.replace('{{resetLink}}', url);
    
    const resend = new Resend(envs.RESEND_API_KEY);
    const resp = await resend.emails.send({
      from: 'send@cliplink.app',
      to: user.email,
      subject: 'Password Reset',
      html: emailHtml
    });
    
    if (resp.error) throw CustomError.internalServer(Messages.SEND_EMAIL_ERROR);
  }
}