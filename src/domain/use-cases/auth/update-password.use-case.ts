import { type AuthRepository, CustomError, type UserToken } from '@/domain';
import { JwtAdapter, Messages } from '@/config';

interface UpdatePasswordUseCase {
  execute(token: string, password: string): Promise<UserToken>;
}

type SignToken = (payload: Object, type: 'access' | 'refresh') => Promise<string | null>;

export class UpdatePassword implements UpdatePasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(token: string, password: string): Promise<UserToken> {
    const user = await this.authRepository.updatePassword(token, password);
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