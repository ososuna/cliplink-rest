import { AuthDataSource, AuthRepository, LoginUserDto, RegisterUserDto, User } from '../../domain';

export class AuthRepositoryImpl implements AuthRepository {
  // dependency injection 💉
  // this implementation can use any data source
  // can be mongo, postgres, oracle, etc.
  constructor(
    private readonly authDataSource: AuthDataSource,
  ) {}

  login(loginUserDto: LoginUserDto): Promise<User> {
    return this.authDataSource.login(loginUserDto);
  }

  register(registerUserDto: RegisterUserDto): Promise<User> {
    return this.authDataSource.register(registerUserDto);
  }
}