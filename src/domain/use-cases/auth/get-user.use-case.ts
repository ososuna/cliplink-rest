import { AuthRepository } from '../../repositories/auth.repository';

interface User {
  id: string,
  name: string,
  email: string,
  role: string[],
  img?: string,
}

interface GetUserUseCase {
  execute(userId: string): Promise<User>
}

export class GetUser implements GetUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.authRepository.getUser(userId);
    return user;
  }

}