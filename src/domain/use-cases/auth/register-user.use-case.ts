import { type AuthRepository, CustomError, type RegisterUserDto } from '@/domain';
import { JwtAdapter, Messages } from '@/config';

interface UserToken {
  token: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    email: string;
  }
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<any>
}

// This use case will allow us to change the repository and the way we are signing tokens
export class RegisterUser implements RegisterUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {

    const user = await this.authRepository.register(registerUserDto);
    const token = await this.signToken({ id: user.id });

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