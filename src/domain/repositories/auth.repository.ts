import { LoginUserDto, RegisterUserDto, UpdateUserDto, User } from '..';

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
}