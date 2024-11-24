import { LoginUserDto, RegisterUserDto } from '..';
import { User } from '../entities/user.entity';

/**
* Abstract business rules to implement.
* No matter which data source we are using:
* MongoDb, PostgreSQL, Oracle.
* Each data source must implement the required methods
*/
export interface AuthDataSource {
  login(loginUserDto: LoginUserDto): Promise<User>
  register(registerUserDto: RegisterUserDto): Promise<User>
  getUsers(): Promise<User[]>
  getUser(userId: string): Promise<User>
}