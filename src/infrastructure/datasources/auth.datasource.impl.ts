import { isValidObjectId } from 'mongoose';
import {
  type AuthDataSource,
  CustomError,
  type RegisterUserDto,
  type LoginUserDto,
  type User,
  type UpdateUserDto,
  type GithubUser,
  type GoogleUser,
  type ResetPasswordToken } from '@/domain';
import { BcryptAdapter, DateAdapter, envs, Messages } from '@/config';
import { UserMapper, UserGithubMapper, UserGoogleMapper, ResetPasswordTokenMapper } from '@/infrastructure';
import { ResetPasswordTokenModel, UrlModel, UserModel } from '@/data/mongodb';

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
      const exists = await UserModel.findOne({ email, active: true });
      if (exists) throw CustomError.badRequest(Messages.INVALID_EMAIL_REGISTER);

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
      const user = await UserModel.findOne({ email, active: true });
      if ( !user ) throw CustomError.badRequest(Messages.BAD_CREDENTIALS);
      
      if ( !user.password ) throw CustomError.badRequest(Messages.INVALID_EMAIL_LOGIN);
      
      const isValidPassword = this.comparePassword(password, user.password!);
      if ( !isValidPassword ) throw CustomError.badRequest(Messages.BAD_CREDENTIALS);

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
      if ( !isValidObjectId(userId) ) throw CustomError.badRequest(Messages.USER_NOT_FOUND);
      const user = await UserModel.findById(userId);
      if ( !user ) throw CustomError.badRequest(Messages.USER_NOT_FOUND);
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
        if (exists) throw CustomError.badRequest(Messages.INVALID_EMAIL);
      }
      const user = await UserModel.findByIdAndUpdate(userId, updateUserDto, {
        new: true,
      });
      if (!user) throw CustomError.notFound(Messages.USER_NOT_FOUND);
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
        throw CustomError.internalServer(Messages.GITHUB_ACCESS_TOKEN_ERROR);
      }
      const { access_token: accessToken } = await tokenResponse.json();
  
      // Fetch the authenticated user's information
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!userResponse.ok) {
        throw CustomError.internalServer(Messages.GITHUB_USER_DATA_ERROR);
      }  
      const githubUser: GithubUser = await userResponse.json();

      // check if user is already registered
      const user = await UserModel.findOne({ githubId: githubUser.id, active: true });
      if (user) {
        // login
        return UserGithubMapper.userEntityFromObject(user);
      } else {
        // register
        const exists = await UserModel.findOne({ email: githubUser.email, active: true });
        if (exists) throw CustomError.badRequest(Messages.INVALID_EMAIL_REGISTER);
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

  async authGoogle(code: string): Promise<User> {
    try {
      // Exchange the authorization code for an access token and ID token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: new URLSearchParams({
          code: code,
          client_id: envs.GOOGLE_CLIENT_ID,
          client_secret: envs.GOOGLE_CLIENT_SECRET,
          redirect_uri: envs.GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      if (!tokenResponse.ok) {
        const errorDetails = await tokenResponse.text();
        console.error('Google Token Exchange Error:', errorDetails);
        throw CustomError.internalServer(Messages.GOOGLE_ACCESS_TOKEN_ERROR);
      }
  
      const { access_token: accessToken } = await tokenResponse.json();
  
      // Fetch the authenticated user's information
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!userResponse.ok) {
        throw CustomError.internalServer(Messages.GOOGLE_USER_DATA_ERROR);
      }
  
      const googleUser: GoogleUser = await userResponse.json();
  
      // Check if user is already registered
      const user = await UserModel.findOne({ googleId: googleUser.sub, active: true });
      if (user) {
        // Login
        return UserGoogleMapper.userEntityFromObject(user);
      } else {
        // Register
        const exists = await UserModel.findOne({ email: googleUser.email, active: true });
        if (exists) throw CustomError.badRequest(Messages.INVALID_EMAIL_REGISTER);
        const userToSave = await UserModel.create({
          name: googleUser.given_name,
          lastName: googleUser.family_name,
          email: googleUser.email,
          googleId: googleUser.sub,
        });
  
        await userToSave.save();
        return UserGoogleMapper.userEntityFromObject(userToSave);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async deleteAccount(userId: string): Promise<User> {
    try {
      const user = await UserModel.findById(userId);
      if ( !user ) throw CustomError.notFound(Messages.USER_NOT_FOUND);
      
      await UrlModel.updateMany({ user: user._id }, { $set: { active: false } });
      await UserModel.findByIdAndDelete(userId);
      
      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ email, active: true });
      if ( !user ) throw CustomError.badRequest(Messages.INVALID_EMAIL);
      if (user.googleId || user.githubId) throw CustomError.badRequest(Messages.INVALID_EMAIL);
      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async saveResetPasswordToken(userId: string, token: string): Promise<ResetPasswordToken> {
    try {
      const user = await UserModel.findById(userId);
      if ( !user ) throw CustomError.notFound(Messages.USER_NOT_FOUND);
      
      const resetPasswordToken = await ResetPasswordTokenModel.create({
        user: user._id,
        token: token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 1) // 1 hour 
      });

      await resetPasswordToken.save();

      return ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(resetPasswordToken);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async isValidPasswordToken(token: string): Promise<ResetPasswordToken> {
    try {
      const resetPasswordToken = await ResetPasswordTokenModel.findOne({ token, active: true });
      if ( !resetPasswordToken ) throw CustomError.badRequest(Messages.INVALID_PASSWORD_TOKEN);

      const now = DateAdapter.now();
      if ( resetPasswordToken.expiresAt < now ) throw CustomError.badRequest(Messages.INVALID_PASSWORD_TOKEN);

      return ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(resetPasswordToken);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async updatePassword(token: string, password: string): Promise<User> {
    try {
      const resetPasswordToken = await ResetPasswordTokenModel.findOne({ token, active: true });
      if ( !resetPasswordToken ) throw CustomError.badRequest(Messages.INVALID_PASSWORD_TOKEN);

      const now = DateAdapter.now();
      if ( resetPasswordToken.expiresAt < now ) throw CustomError.badRequest(Messages.INVALID_PASSWORD_TOKEN);

      const user = await UserModel.findById(resetPasswordToken.user._id);
      if ( !user || !user.active ) throw CustomError.notFound(Messages.USER_NOT_FOUND);

      user.password = this.hashPassword(password);
      await user.save();

      resetPasswordToken.active = false;
      await resetPasswordToken.save();

      return UserMapper.userEntityFromObject(user);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    } 
  }
}