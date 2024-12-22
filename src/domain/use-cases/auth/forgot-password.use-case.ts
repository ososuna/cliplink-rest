import { Resend } from 'resend';
import { IdAdapter, envs } from '../../../config';
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
    const resend = new Resend(envs.RESEND_API_KEY);
    
    const resp = await resend.emails.send({
      from: 'send@cliplink.app',
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Reset your <strong>password</strong>:</p> <p>${ url }</p>`
    });
    
    if (resp.error) throw CustomError.internalServer('Error sending email');
  }
}