import { type AuthRepository } from '@/domain';

interface User {
  id: string,
  name: string,
  email: string,
  role: string[],
  img?: string,
}

interface GetUsersUseCase {
  execute(): Promise<User[]>;
}

export class GetUsers implements GetUsersUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.authRepository.getUsers();
    return users;
  }
}
