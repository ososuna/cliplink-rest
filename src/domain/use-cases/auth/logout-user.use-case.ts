import { AuthRepository } from '../../repositories/auth.repository';

interface LogoutUserUseCase {
  execute(): Promise<string>
}

export class LogoutUser implements LogoutUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  async execute(): Promise<string> {
    await this.authRepository.logout();
    return 'logged out successfully';
  }

}