import { beforeEach, describe, it, vi, expect, beforeAll, afterAll } from 'vitest';
import { AuthDataSourceMocks } from '@test/test-utils/infrastructure/datasources/auth.datasource.mocks'; // this import should be right after vitest
import { isValidObjectId } from 'mongoose';
import type { AuthDataSource } from '@/domain';
import { AuthDataSourceImpl } from '@/infrastructure';
import { Messages } from '@/config';
import { ResetPasswordTokenModel, UserModel } from '@/data/mongodb';
import { asMock } from '@test/test-utils';

AuthDataSourceMocks.setupMocks();

describe('AuthDataSourceImpl', () => {
  let authDataSource: AuthDataSource;

  const hashPasswordMock = vi.fn((password: string) => `hashed-${password}`);
  const comparePasswordMock = vi.fn();

  beforeAll(() => {
    authDataSource = new AuthDataSourceImpl(hashPasswordMock, comparePasswordMock);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register user', async () => {
      const user = await authDataSource.register(AuthDataSourceMocks.registerUserDto);
      expect(user).toEqual(AuthDataSourceMocks.user);
      expect(UserModel.create).toHaveBeenCalledTimes(1);
      expect(UserModel.create).toHaveBeenCalledWith({
        name: 'name',
        lastName: 'lastName',
        email: 'email',
        password: 'hashed-password',
      });
    });

    it('should throw internal server error', async () => {
      asMock(UserModel.findOne).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.register(AuthDataSourceMocks.registerUserDto)).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw error if email is already registered', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce({
        _id: 'userId',
        name: 'name',
        lastName: 'lastName',
        email: 'email',
        password: 'password',
        role: ['role'],
      });
      await expect(authDataSource.register(AuthDataSourceMocks.registerUserDto)).rejects.toThrow(Messages.INVALID_EMAIL_REGISTER);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.user);
      asMock(comparePasswordMock).mockReturnValueOnce(true);
      const user = await authDataSource.login(AuthDataSourceMocks.loginUserDto);
      expect(user).toEqual(AuthDataSourceMocks.user);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });

    it('should throw internal server error', async () => {
      asMock(UserModel.findOne).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.login(AuthDataSourceMocks.loginUserDto)).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw error if email is not registered', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(null);
      await expect(authDataSource.login(AuthDataSourceMocks.loginUserDto)).rejects.toThrow(Messages.BAD_CREDENTIALS);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });

    it('should throw invalid email', async () => {
      // google autheticated user
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.googleUser);
      await expect(authDataSource.login(AuthDataSourceMocks.loginUserDto)).rejects.toThrow(Messages.INVALID_EMAIL_LOGIN);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });

    it('should throw error if password is incorrect', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.user);
      asMock(comparePasswordMock).mockReturnValueOnce(false);
      await expect(authDataSource.login(AuthDataSourceMocks.loginUserDto)).rejects.toThrow(Messages.BAD_CREDENTIALS);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });
  });

  describe('get users', () => {
    it('should return users', async () => {
      const users = await authDataSource.getUsers();
      expect(users).toEqual(AuthDataSourceMocks.users);
      expect(UserModel.find).toHaveBeenCalledTimes(1);
    });

    it('should throw internal server error', async () => {
      asMock(UserModel.find).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.getUsers()).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should return empty array if no users found', async () => {
      asMock(UserModel.find).mockResolvedValueOnce([]);
      const users = await authDataSource.getUsers();
      expect(users).toEqual([]);
      expect(UserModel.find).toHaveBeenCalledTimes(1);
    });

    it('should throw bad request error', async () => {
      asMock(UserModel.find).mockResolvedValueOnce([
        {
          _id: 'userId',
          lastName: 'lastName',
          email: 'email',
          password: 'password',
          role: ['role'],
        },
      ]);
      await expect(authDataSource.getUsers()).rejects.toThrow(Messages.REQUIRED_FIELD('name'));
      expect(UserModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('get user', () => {
    it('should return user if user exists', async () => {
      const expectedUser = AuthDataSourceMocks.user;
      const user = await authDataSource.getUser('userId');
      expect(user).toEqual(expectedUser);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });

    it('should throw error if userId is not valid', async () => {
      asMock(isValidObjectId).mockReturnValueOnce(false);
      await expect(authDataSource.getUser('invalidId')).rejects.toThrow(Messages.USER_NOT_FOUND);
    });

    it('should throw internal server error', async () => {
      asMock(isValidObjectId).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.getUser('invalidId')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw error if user does not exist', async () => {
      asMock(UserModel.findById).mockResolvedValueOnce(null);
      await expect(authDataSource.getUser('userId')).rejects.toThrow(
        'We could not find a user matching the provided information.',
      );
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });
  });

  describe('update user', () => {
    it('should update user', async () => {
      const user = await authDataSource.updateUser('userId', AuthDataSourceMocks.updateUserDto);
      expect(user).toEqual(AuthDataSourceMocks.updatedUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'userId',
        {
          name: 'nameUpdated',
          lastName: 'lastNameUpdated',
          email: 'email',
        },
        { new: true },
      );
    });

    it('should throw bad request error if the email is already registered', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.user);
      await expect(authDataSource.updateUser('userId', AuthDataSourceMocks.updateUserDto)).rejects.toThrow(
        Messages.INVALID_EMAIL,
      );
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledTimes(0);
    });

    it('should throw not found error if user does not exist', async () => {
      asMock(UserModel.findByIdAndUpdate).mockResolvedValueOnce(null);
      await expect(authDataSource.updateUser('userId', AuthDataSourceMocks.updateUserDto)).rejects.toThrow(
        Messages.USER_NOT_FOUND,
      );
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'userId',
        {
          name: 'nameUpdated',
          lastName: 'lastNameUpdated',
          email: 'email',
        },
        { new: true },
      );
    });

    it('should throw internal server error', async () => {
      asMock(UserModel.findByIdAndUpdate).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.updateUser('userId', AuthDataSourceMocks.updateUserDto)).rejects.toThrow(
        Messages.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('auth github', () => {
    afterAll(() => {
      AuthDataSourceMocks.setupMocks();
    });

    it('should login user with github', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.githubUser);
      const user = await authDataSource.authGithub('code');
      expect(UserModel.findOne).toBeCalledTimes(1);
      expect(UserModel.findOne).toBeCalledWith({ githubId: 'githubUserId', active: true });
      expect(user).toEqual({
        id: 'userId',
        name: 'name',
        lastName: 'lastName',
        email: 'email@github.com',
        githubId: 'githubUserId',
        role: ['role'],
      });
    });

    it('should register user with github', async () => {
      asMock(UserModel.create).mockResolvedValueOnce({ ...AuthDataSourceMocks.githubUser, save: vi.fn() });
      const user = await authDataSource.authGithub('code');
      expect(UserModel.findOne).toBeCalledTimes(2);
      expect(user).toEqual({
        id: 'userId',
        name: 'name',
        lastName: 'lastName',
        email: 'email@github.com',
        githubId: 'githubUserId',
        role: ['role'],
      });
    });

    it('should throw invalid email to register error', async () => {
      asMock(UserModel.findOne).mockImplementation((params: object) => {
        if (Object.prototype.hasOwnProperty.call(params, 'githubId')) {
          return Promise.resolve(null);
        } else if (Object.prototype.hasOwnProperty.call(params, 'email')) {
          return Promise.resolve(AuthDataSourceMocks.githubUser);
        }
      });
      await expect(authDataSource.authGithub('code')).rejects.toThrow(Messages.INVALID_EMAIL_REGISTER);
      expect(UserModel.findOne).toBeCalledTimes(2);
      asMock(UserModel.findOne).mockResolvedValue(null);
    });

    it('should throw github access token error', async () => {
      asMock(globalThis.fetch).mockResolvedValueOnce({ ok: false });
      await expect(authDataSource.authGithub('code')).rejects.toThrow(Messages.GITHUB_ACCESS_TOKEN_ERROR);
    });

    it('should throw github user data error', async () => {
      asMock(globalThis.fetch).mockImplementation((url) => {
        switch (url) {
          case 'https://github.com/login/oauth/access_token':
            return AuthDataSourceMocks.buildFetchResolvedPromise({
              access_token: 'fakegithubaccesstoken',
            });
          case 'https://api.github.com/user':
            return AuthDataSourceMocks.buildFetchResolvedPromise({}, false, 500);
          default:
            return AuthDataSourceMocks.buildFetchResolvedPromise({});
        }
      });
      await expect(authDataSource.authGithub('code')).rejects.toThrow(Messages.GITHUB_USER_DATA_ERROR);
    });

    it('should throw internal server error', async () => {
      asMock(globalThis.fetch).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.authGithub('code')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });
  });

  describe('auth google', () => {
    it('should login user with google', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.googleUser);
      const user = await authDataSource.authGoogle('code');
      expect(UserModel.findOne).toBeCalledTimes(1);
      expect(UserModel.findOne).toBeCalledWith({ googleId: 'googleUserId', active: true });
      expect(user).toEqual({
        id: 'userId',
        name: 'name',
        lastName: 'lastName',
        email: 'email@gmail.com',
        googleId: 'googleUserId',
        role: ['role'],
      });
    });

    it('should register user with google', async () => {
      asMock(UserModel.create).mockResolvedValueOnce({ ...AuthDataSourceMocks.googleUser, save: vi.fn() });
      const user = await authDataSource.authGoogle('code');
      expect(UserModel.findOne).toBeCalledTimes(2);
      expect(user).toEqual({
        id: 'userId',
        name: 'name',
        lastName: 'lastName',
        email: 'email@gmail.com',
        googleId: 'googleUserId',
        role: ['role'],
      });
    });

    it('should throw invalid email to register error', async () => {
      asMock(UserModel.findOne).mockImplementation((params: object) => {
        if (Object.prototype.hasOwnProperty.call(params, 'googleId')) {
          return Promise.resolve(null);
        } else if (Object.prototype.hasOwnProperty.call(params, 'email')) {
          return Promise.resolve(AuthDataSourceMocks.googleUser);
        }
      });
      await expect(authDataSource.authGoogle('code')).rejects.toThrow(Messages.INVALID_EMAIL_REGISTER);
      expect(UserModel.findOne).toBeCalledTimes(2);
      asMock(UserModel.findOne).mockResolvedValue(null);
    });

    it('should throw google access token error', async () => {
      asMock(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        text: vi.fn(() => Promise.resolve('text')),
      });
      await expect(authDataSource.authGoogle('code')).rejects.toThrow(Messages.GOOGLE_ACCESS_TOKEN_ERROR);
    });

    it('should throw google user data error', async () => {
      asMock(globalThis.fetch).mockImplementation((url) => {
        switch (url) {
          case 'https://oauth2.googleapis.com/token':
            return AuthDataSourceMocks.buildFetchResolvedPromise({
              access_token: 'fakegoogleaccesstoken',
            });
          case 'https://www.googleapis.com/oauth2/v3/userinfo':
            return AuthDataSourceMocks.buildFetchResolvedPromise({}, false, 500);
          default:
            return AuthDataSourceMocks.buildFetchResolvedPromise({});
        }
      });
      await expect(authDataSource.authGoogle('code')).rejects.toThrow(Messages.GOOGLE_USER_DATA_ERROR);
    });

    it('should throw internal server error', async () => {
      asMock(globalThis.fetch).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.authGoogle('code')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });
  });

  describe('delete account', () => {
    it('should delete account', async () => {
      await authDataSource.deleteAccount('userId');
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith('userId');
    });

    it('should throw internal server error', async () => {
      asMock(UserModel.findByIdAndDelete).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.deleteAccount('userId')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw not found error if user does not exist', async () => {
      asMock(UserModel.findById).mockResolvedValueOnce(null);
      await expect(authDataSource.deleteAccount('userId')).rejects.toThrow(Messages.USER_NOT_FOUND);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findByIdAndDelete).toHaveBeenCalledTimes(0);
    });
  });

  describe('get user by email', () => {
    it('should return user if user exists', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.user);
      const expectedUser = AuthDataSourceMocks.user;
      const user = await authDataSource.getUserByEmail('email');
      expect(user).toEqual(expectedUser);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });

    it('should throw internal server error', async () => {
      asMock(UserModel.findOne).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.getUserByEmail('email')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw error if user does not exist', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(null);
      await expect(authDataSource.getUserByEmail('email')).rejects.toThrow(Messages.INVALID_EMAIL);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });

    it('should throw bad request error if email is invalid', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.googleUser);
      await expect(authDataSource.getUserByEmail('email')).rejects.toThrow(Messages.INVALID_EMAIL);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });
  });

  describe('save reset password token', () => {
    it('should save reset password token', async () => {
      await authDataSource.saveResetPasswordToken('userId', 'token');
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(ResetPasswordTokenModel.create).toHaveBeenCalledTimes(1);
    });

    it('should throw internal server error', async () => {
      asMock(UserModel.findById).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.saveResetPasswordToken('userId', 'token')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw not found error if user does not exist', async () => {
      asMock(UserModel.findById).mockResolvedValueOnce(null);
      await expect(authDataSource.saveResetPasswordToken('userId', 'token')).rejects.toThrow(Messages.USER_NOT_FOUND);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(ResetPasswordTokenModel.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('is valid password token', () => {
    it('should return true if token is valid', async () => {
      asMock(ResetPasswordTokenModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.validResetPasswordToken);
      await authDataSource.isValidPasswordToken('token');
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledTimes(1);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledWith({ token: 'token', active: true });
    });

    it('should throw bad request error if token is expired', async () => {
      asMock(ResetPasswordTokenModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.expiredResetPasswordToken);
      await expect(authDataSource.isValidPasswordToken('token')).rejects.toThrow(Messages.INVALID_PASSWORD_TOKEN);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledTimes(1);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledWith({ token: 'token', active: true });
    });

    it('should throw internal server error', async () => {
      asMock(ResetPasswordTokenModel.findOne).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.isValidPasswordToken('token')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw not found error if token does not exist', async () => {
      asMock(ResetPasswordTokenModel.findOne).mockResolvedValueOnce(null);
      await expect(authDataSource.isValidPasswordToken('token')).rejects.toThrow(Messages.INVALID_PASSWORD_TOKEN);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledTimes(1);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledWith({ token: 'token', active: true });
    });
  });

  describe('update password', () => {
    it('should update password', async () => {
      const user = {
        ...AuthDataSourceMocks.user,
        _id: AuthDataSourceMocks.user.id,
        active: true,
        save: vi.fn(),
      };
      const passwordToken = {
        id: 'resetPasswordTokenId',
        user: user,
        token: 'token',
        expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
        active: true,
        save: vi.fn(),
      };
      asMock(UserModel.findById).mockResolvedValueOnce(user);
      asMock(ResetPasswordTokenModel.findOne).mockResolvedValueOnce(passwordToken);
      await authDataSource.updatePassword('token', 'new-password');
      expect(user.password).toBe('hashed-new-password');
      expect(passwordToken.active).toBe(false);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith(passwordToken.user.id);
    });

    it('should throw internal server error', async () => {
      asMock(ResetPasswordTokenModel.findOne).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.updatePassword('userId', 'password')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw not found error if password token does not exist', async () => {
      asMock(ResetPasswordTokenModel.findOne).mockResolvedValueOnce(null);
      await expect(authDataSource.updatePassword('token', 'new-password')).rejects.toThrow(Messages.INVALID_PASSWORD_TOKEN);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledTimes(1);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledWith({ token: 'token', active: true });
    });

    it('should throw bad request error if password token is expired', async () => {
      asMock(ResetPasswordTokenModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.expiredResetPasswordToken);
      await expect(authDataSource.updatePassword('token', 'new-password')).rejects.toThrow(Messages.INVALID_PASSWORD_TOKEN);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledTimes(1);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledWith({ token: 'token', active: true });
    });

    it('should throw not found error if user does not exist', async () => {
      const user = {
        ...AuthDataSourceMocks.user,
        _id: AuthDataSourceMocks.user.id,
        active: true,
        save: vi.fn(),
      };
      const passwordToken = {
        id: 'resetPasswordTokenId',
        user: user,
        token: 'token',
        expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
        active: true,
        save: vi.fn(),
      };
      asMock(ResetPasswordTokenModel.findOne).mockResolvedValueOnce(passwordToken);
      asMock(UserModel.findById).mockResolvedValueOnce(null);
      await expect(authDataSource.updatePassword('token', 'new-password')).rejects.toThrow(Messages.USER_NOT_FOUND);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith(AuthDataSourceMocks.validResetPasswordToken.user.id);
    });
  });
});
