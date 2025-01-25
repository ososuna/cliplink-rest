import { beforeEach, describe, it, vi, expect, beforeAll } from 'vitest';
import { AuthDataSourceMocks } from '../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { AuthDataSourceImpl } from '../../../src/infrastructure';
import { ResetPasswordTokenModel, UserModel } from '../../../src/data/mongodb';
import { DateAdapter, Messages } from '../../../src/config';
import { isValidObjectId } from 'mongoose';

AuthDataSourceMocks.setupMocks();

describe('AuthDataSourceImpl', () => {

  let authDataSource: AuthDataSourceImpl;

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
        }
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
      await expect(authDataSource.getUser('userId')).rejects.toThrow('We could not find a user matching the provided information.');
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });
  });

  describe('update user', () => {
    it('should update user', async () => {
      const user = await authDataSource.updateUser('userId', AuthDataSourceMocks.updateUserDto);
      expect(user).toEqual(AuthDataSourceMocks.updatedUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith('userId', {
        name: 'nameUpdated',
        lastName: 'lastNameUpdated',
        email: 'email',
      }, { new: true });
    });

    it('should throw bad request error if the email is already registered', async () => {
      asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.user);
      await expect(authDataSource.updateUser('userId', AuthDataSourceMocks.updateUserDto)).rejects.toThrow(Messages.INVALID_EMAIL);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledTimes(0);
    });
  
    it('should throw not found error if user does not exist', async () => {
      asMock(UserModel.findByIdAndUpdate).mockResolvedValueOnce(null);
      await expect(authDataSource.updateUser('userId', AuthDataSourceMocks.updateUserDto)).rejects.toThrow(Messages.USER_NOT_FOUND);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith('userId', {
        name: 'nameUpdated',
        lastName: 'lastNameUpdated',
        email: 'email',
      }, { new: true });
    });
  
    it('should throw internal server error', async () => {
      asMock(UserModel.findByIdAndUpdate).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.updateUser('userId', AuthDataSourceMocks.updateUserDto)).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
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
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true});
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
      const expectedPasswordToken = AuthDataSourceMocks.resetPasswordToken;
      expectedPasswordToken.expiresAt = new Date(new Date().getTime() + 60 * 60 * 1000);
      await authDataSource.isValidPasswordToken('token');
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledTimes(1);
      expect(ResetPasswordTokenModel.findOne).toHaveBeenCalledWith({ token: 'token', active: true });
    });

    it('should throw bad request error if token is expired', async () => {
      const expectedPasswordToken = AuthDataSourceMocks.resetPasswordToken;
      expectedPasswordToken.expiresAt = new Date(new Date().getTime() - 60 * 60 * 1000);
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

});