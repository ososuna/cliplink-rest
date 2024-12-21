import { AuthRepository, User } from '../..';

interface DeleteAccountUseCase {
  execute(userId: string): Promise<User>;
}

export class DeleteAccount implements DeleteAccountUseCase {

  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  async execute(userId: string): Promise<User> {
    return this.authRepository.deleteAccount(userId);
  }

}
