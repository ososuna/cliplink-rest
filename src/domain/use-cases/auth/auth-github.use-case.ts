import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

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
    const token = await this.signToken({ id: user.id }, '2h');
    if (!token) throw CustomError.internalServer('Error generating token');
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