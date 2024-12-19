import { isValidObjectId } from 'mongoose';
import { AuthDataSource, CustomError, RegisterUserDto, LoginUserDto, User, UpdateUserDto, GithubUser } from '../../domain';
import { BcryptAdapter, envs } from '../../config';
import { UserMapper, UserGithubMapper } from '../';
import { UserModel } from '../../data/mongodb';

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

      const isValidPassword = this.comparePassword(password, user.password!);
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

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.email) {
        const exists = await UserModel.findOne({ email: updateUserDto.email });
        if (exists) throw CustomError.badRequest('Invalid email');
      }
      const user = await UserModel.findByIdAndUpdate(userId, updateUserDto, {
        new: true,
      });
      if (!user) throw CustomError.notFound('User not found');
      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async authGithub(code: string): Promise<User> {
    try {
      // Exchange the authorization code for an access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        body: JSON.stringify({
          client_id: envs.GITHUB_CLIENT_ID,
          client_secret: envs.GITHUB_CLIENT_SECRET,
          code: code,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
  
      if (!tokenResponse.ok) {
        throw CustomError.internalServer('Failed to fetch Github access token');
      }
      const { access_token: accessToken } = await tokenResponse.json();
  
      // Fetch the authenticated user's information
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!userResponse.ok) {
        throw CustomError.internalServer('Failed to fetch Github user data');
      }  
      const githubUser: GithubUser = await userResponse.json();

      // check if user is already registered
      const user = await UserModel.findOne({ githubId: githubUser.id });
      if (user) {
        // login
        return UserGithubMapper.userEntityFromObject(user);
      } else {
        // register
        const exists = await UserModel.findOne({ email: githubUser.email });
        if (exists) throw CustomError.badRequest('An account with this email is already registered');
  
        const userToSave = await UserModel.create({
          name: githubUser.name,
          email: githubUser.email,
          githubId: githubUser.id
        });
  
        await userToSave.save();
        return UserGithubMapper.userEntityFromObject(userToSave);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

}