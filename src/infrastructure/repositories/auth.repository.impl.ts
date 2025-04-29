import type {
  AuthDataSource,
  AuthRepository,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordToken,
  UpdateUserDto,
  User,
} from '@/domain';

export class AuthRepositoryImpl implements AuthRepository {
  // dependency injection 💉
  // this implementation can use any data source
  // can be mongo, postgres, oracle, etc.
  constructor(private readonly authDataSource: AuthDataSource) {}

  login(loginUserDto: LoginUserDto): Promise<User> {
    return this.authDataSource.login(loginUserDto);
  }

  register(registerUserDto: RegisterUserDto): Promise<User> {
    return this.authDataSource.register(registerUserDto);
  }

  getUsers(): Promise<User[]> {
    return this.authDataSource.getUsers();
  }

  getUser(userId: string): Promise<User> {
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

  deleteAccount(userId: string): Promise<User> {
    return this.authDataSource.deleteAccount(userId);
  }

  getUserByEmail(email: string): Promise<User> {
    return this.authDataSource.getUserByEmail(email);
  }

  saveResetPasswordToken(userId: string, token: string): Promise<ResetPasswordToken> {
    return this.authDataSource.saveResetPasswordToken(userId, token);
  }

  isValidPasswordToken(token: string): Promise<ResetPasswordToken> {
    return this.authDataSource.isValidPasswordToken(token);
  }

  updatePassword(token: string, password: string): Promise<User> {
    return this.authDataSource.updatePassword(token, password);
  }
}
