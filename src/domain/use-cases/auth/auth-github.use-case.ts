import { JwtAdapter, Messages } from '@/config';
import { type AuthRepository, CustomError, type UserToken } from '@/domain';
interface AuthGithubUseCase {
  execute(code: string): Promise<UserToken>
}
type SignToken = (payload: Object, type: 'access' | 'refresh') => Promise<string | null>;
export class AuthGithub implements AuthGithubUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(code: string): Promise<UserToken> {
    const user = await this.authRepository.authGithub(code);
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