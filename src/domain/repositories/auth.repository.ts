import { LoginUserDto, RegisterUserDto, ResetPasswordToken, UpdateUserDto, User } from '..';

/**
* We can implement this interface with any data source
*/
export interface AuthRepository {
  login(loginUserDto: LoginUserDto): Promise<User>
  register(registerUserDto: RegisterUserDto): Promise<User>
  getUsers(): Promise<User[]>
  getUser(userId: string): Promise<User>
  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>
  authGithub(code: string): Promise<User>
  authGoogle(code: string): Promise<User>
  deleteAccount(userId: string): Promise<User>
  getUserByEmail(email: string): Promise<User>
  saveResetPasswordToken(userId: string, token: string): Promise<ResetPasswordToken>
  isValidPasswordToken(token: string): Promise<ResetPasswordToken>
  updatePassword(token: string, password: string): Promise<User>
}