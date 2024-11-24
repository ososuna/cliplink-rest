import { JwtAdapter } from '../../../config';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';

// can create a sep file of interfaces in domain
interface UserToken {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}

interface LoginUserUseCase {
  execute(loginUserDto: LoginUserDto): Promise<any>
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

    if (!token) throw CustomError.internalServer('error generating token');

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    }
  }

}