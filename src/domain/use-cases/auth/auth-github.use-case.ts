import { JwtAdapter, Messages } from '@/config';
import { type AuthRepository, CustomError } from '@/domain';

interface UserToken {
  token: string;
  user: {
    id: string;
    githubId: string;
    name: string;
    lastName: string;
    email: string;
  }
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

interface AuthGithubUseCase {
  execute(code: string): Promise<UserToken>
}

export class AuthGithub implements AuthGithubUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(code: string): Promise<UserToken> {
    const user = await this.authRepository.authGithub(code);
    const token = await this.signToken({ id: user.id });
    if (!token) throw CustomError.internalServer(Messages.TOKEN_GENERATION_ERROR);
    return {
      token,
      user: {
        id: user.id,
        githubId: user.githubId!,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      }
    }
  }

}