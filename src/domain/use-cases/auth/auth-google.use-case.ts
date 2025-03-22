import { JwtAdapter, Messages } from '@/config';
import { type AuthRepository, CustomError } from '@/domain';

interface UserToken {
  token: string;
  user: {
    id: string;
    googleId: string;
    name: string;
    lastName: string;
    email: string;
  }
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

interface AuthGoogleUseCase {
  execute(code: string): Promise<UserToken>
}

export class AuthGoogle implements AuthGoogleUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(code: string): Promise<UserToken> {
    const user = await this.authRepository.authGoogle(code);
    const token = await this.signToken({ id: user.id }, '2h');
    if (!token) throw CustomError.internalServer(Messages.TOKEN_GENERATION_ERROR);
    return {
      token,
      user: {
        id: user.id,
        googleId: user.googleId!,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      }
    }
  }

}