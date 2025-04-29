import { type AuthRepository, type LoginUserDto, type UserToken } from '@/domain';
import { JwtAdapter } from '@/config';
import { generateAuthTokens } from '@/domain/utils/token.utils';

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

type SignToken = (payload: object, type: 'access' | 'refresh') => Promise<string | null>;
export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken,
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
    const user = await this.authRepository.login(loginUserDto);
    return generateAuthTokens(user, this.signToken);
  }
}
