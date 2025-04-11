import { type AuthRepository, type UserToken } from '@/domain';
import { JwtAdapter } from '@/config';
import { generateAuthTokens } from '@/domain/utils/token.utils';

interface AuthGoogleUseCase {
  execute(code: string): Promise<UserToken>;
}

type SignToken = (payload: object, type: 'access' | 'refresh') => Promise<string | null>;

export class AuthGoogle implements AuthGoogleUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken,
  ) {}

  async execute(code: string): Promise<UserToken> {
    const user = await this.authRepository.authGoogle(code);
    return generateAuthTokens(user, this.signToken);
  }
}
