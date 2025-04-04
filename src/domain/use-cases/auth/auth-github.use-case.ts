import { type AuthRepository, type UserToken } from '@/domain';
import { JwtAdapter } from '@/config';
import { generateAuthTokens } from '@/domain/utils/token.utils';

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
    return generateAuthTokens(user, this.signToken);
  }
}