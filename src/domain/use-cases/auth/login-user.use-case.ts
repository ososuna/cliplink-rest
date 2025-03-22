import { type AuthRepository, CustomError, LoginUserDto } from '@/domain';
import { JwtAdapter, Messages } from '@/config';

// can create a sep file of interfaces in domain
interface UserToken {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    lastName: string;
  }
}

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<UserToken>
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {

    const user = await this.authRepository.login(loginUserDto);
    const token = await this.signToken({ id: user.id }, '2h');

    if (!token) throw CustomError.internalServer(Messages.TOKEN_GENERATION_ERROR);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      }
    }
  }

}