import { type AuthRepository, type RegisterUserDto, type UserToken } from '@/domain';
import { JwtAdapter } from '@/config';
import { generateAuthTokens } from '@/domain/utils/token.utils';

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>
}

type SignToken = (payload: Object, type: 'access' | 'refresh') => Promise<string | null>;

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    const user = await this.authRepository.register(registerUserDto);
    return generateAuthTokens(user, this.signToken);
  }
}