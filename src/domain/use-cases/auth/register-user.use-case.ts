import { type AuthRepository, CustomError, type RegisterUserDto, type UserToken } from '@/domain';
import { JwtAdapter, Messages } from '@/config';

type SignToken = (payload: Object, type: 'access' | 'refresh') => Promise<string | null>;

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<any>
}

// This use case will allow us to change the repository and the way we are signing tokens
export class RegisterUser implements RegisterUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    const user = await this.authRepository.register(registerUserDto);
    const payload = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, 'access'),
      this.signToken(payload, 'refresh')
    ]);
    if (!accessToken || !refreshToken) throw CustomError.internalServer(Messages.TOKEN_GENERATION_ERROR);
    return {
      accessToken,
      refreshToken,
      user: payload
    }
  }

}