import { isValidObjectId } from 'mongoose';
import { UserModel } from '../../data/mongodb';
import { AuthDataSource, CustomError, RegisterUserDto, LoginUserDto, User } from '../../domain';
import { BcryptAdapter } from '../../config';
import { UserMapper } from '../mappers/user.mapper';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDataSourceImpl implements AuthDataSource {

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { name, lastName, email, password } = registerUserDto;

    try {
      const exists = await UserModel.findOne({ email });
      if (exists) throw CustomError.badRequest('user aleady exists');

      const user = await UserModel.create({
        name: name,
        lastName: lastName,
        email: email,
        password: this.hashPassword(password)
      });

      await user.save();
      return UserMapper.userEntityFromObject(user);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;

    try {
      const user = await UserModel.findOne({ email });
      if ( !user ) throw CustomError.badRequest('bad credentials');

      const isValidPassword = this.comparePassword(password, user.password);
      if ( !isValidPassword ) throw CustomError.badRequest('bad credentials');

      return UserMapper.userEntityFromObject(user);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find();
      return users.map(user => UserMapper.userEntityFromObject(user));
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async getUser(userId: string): Promise<User> {
    try {
      if ( !isValidObjectId(userId) ) throw CustomError.badRequest('user not found');
      const user = await UserModel.findById(userId);
      if ( !user ) throw CustomError.badRequest('user not found');
      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

}