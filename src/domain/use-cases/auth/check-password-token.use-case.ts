import { AuthRepository, ResetPasswordToken } from '../../';

interface CheckPasswordTokenUseCase {
  execute(token: string): Promise<ResetPasswordToken>;
}

export class CheckPasswordToken implements CheckPasswordTokenUseCase {
  
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(token: string): Promise<ResetPasswordToken> {
    const resetPasswordToken = await this.authRepository.isValidPasswordToken(token);
    return resetPasswordToken;
  }
}