import { AuthDataSource, AuthRepository, LoginUserDto, RegisterUserDto, UpdateUserDto, User } from '../../domain';

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

  getUsers() {
    return this.authDataSource.getUsers();
  }

  getUser(userId: string) {
    return this.authDataSource.getUser(userId);
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.authDataSource.updateUser(userId, updateUserDto);
  }

  authGithub(code: string): Promise<User> {
    return this.authDataSource.authGithub(code);
  }

  authGoogle(code: string): Promise<User> {
    return this.authDataSource.authGoogle(code);
  }
}