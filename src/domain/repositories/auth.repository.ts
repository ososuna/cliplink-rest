import { LoginUserDto, RegisterUserDto } from '..';
import { User } from '../entities/user.entity';

/**
* We can implement this interface with any data source
*/
export interface AuthRepository {
  login(loginUserDto: LoginUserDto): Promise<User>
  register(registerUserDto: RegisterUserDto): Promise<User>
}