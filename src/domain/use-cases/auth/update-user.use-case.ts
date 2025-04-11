import { type AuthRepository, type UpdateUserDto } from '@/domain';

interface User {
  id: string;
  name: string;
  email: string;
  role: string[];
  img?: string;
}

interface UpdateUserUseCase {
  execute(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
}

export class UpdateUser implements UpdateUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.authRepository.updateUser(userId, updateUserDto);
    return user;
  }
}
