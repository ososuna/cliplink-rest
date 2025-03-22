import { type AuthRepository, CustomError } from '@/domain';
import { JwtAdapter, Messages } from '@/config';

interface UpdatePasswordUseCase {
  execute(token: string, password: string): Promise<UserToken>;
}

interface UserToken {
  token: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
  };
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class UpdatePassword implements UpdatePasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(token: string, password: string): Promise<UserToken> {
    const user = await this.authRepository.updatePassword(token, password);
    const jwt = await this.signToken({ id: user.id });

    if (!jwt) throw CustomError.internalServer(Messages.TOKEN_GENERATION_ERROR);

    return {
      token: jwt,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}
