import { type AuthRepository } from '@/domain';

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
}

interface GetUserUseCase {
  execute(userId: string): Promise<User>;
}

export class GetUser implements GetUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.authRepository.getUser(userId);
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
