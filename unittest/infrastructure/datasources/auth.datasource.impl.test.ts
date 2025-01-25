import { beforeEach, describe, it, vi, expect, beforeAll } from 'vitest';
import { AuthDataSourceMocks } from '../../test-utils/mocks/auth.datasource.mocks';
import { AuthDataSourceImpl } from '../../../src/infrastructure';
import { UserModel } from '../../../src/data/mongodb';
import { Messages } from '../../../src/config';
import { isValidObjectId } from 'mongoose';

AuthDataSourceMocks.setupMocks();

describe('AuthDataSourceImpl', () => {

  let authDataSource: AuthDataSourceImpl;

  const hashPasswordMock = vi.fn((password: string) => `hashed-${password}`);
  const comparePasswordMock = vi.fn();

  beforeAll(() => {
    authDataSource = new AuthDataSourceImpl(hashPasswordMock, comparePasswordMock);
    vi.clearAllMocks();
  });

  describe('get user', () => {

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return user if user exists', async () => {
      const expectedUser = AuthDataSourceMocks.user;
      const user = await authDataSource.getUser('userId');
      expect(user).toEqual(expectedUser);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });
  
    it('should throw error if userId is not valid', async () => {
      (isValidObjectId as any).mockReturnValueOnce(false);
      await expect(authDataSource.getUser('invalidId')).rejects.toThrow(Messages.USER_NOT_FOUND);
    });
  
    it('should throw internal server error', async () => {
      (isValidObjectId as any).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.getUser('invalidId')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });
  
    it('should throw error if user does not exist', async () => {
      (UserModel.findById as any).mockResolvedValueOnce(null);
      await expect(authDataSource.getUser('userId')).rejects.toThrow('We could not find a user matching the provided information.');
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });
  });

  describe('register', () => {

    beforeEach(() => {
      vi.clearAllMocks();
    });

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
      (UserModel.findOne as any).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.register(AuthDataSourceMocks.registerUserDto)).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw error if email is already registered', async () => {
      (UserModel.findOne as any).mockResolvedValueOnce({
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

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should login user', async () => {
      (UserModel.findOne as any).mockResolvedValueOnce(AuthDataSourceMocks.user);
      (comparePasswordMock as any).mockReturnValueOnce(true);
      const user = await authDataSource.login(AuthDataSourceMocks.loginUserDto);
      expect(user).toEqual(AuthDataSourceMocks.user);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });

    it('should throw internal server error', async () => {
      (UserModel.findOne as any).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.login(AuthDataSourceMocks.loginUserDto)).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should throw error if email is not registered', async () => {
      (UserModel.findOne as any).mockResolvedValueOnce(null);
      await expect(authDataSource.login(AuthDataSourceMocks.loginUserDto)).rejects.toThrow(Messages.BAD_CREDENTIALS);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });

    it('should throw invalid email', async () => {
      // google autheticated user
      (UserModel.findOne as any).mockResolvedValueOnce(AuthDataSourceMocks.googleUser);
      await expect(authDataSource.login(AuthDataSourceMocks.loginUserDto)).rejects.toThrow(Messages.INVALID_EMAIL_LOGIN);
      expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'email', active: true });
    });

    it('should throw error if password is incorrect', async () => {
      (UserModel.findOne as any).mockResolvedValueOnce(AuthDataSourceMocks.user);
      (comparePasswordMock as any).mockReturnValueOnce(false);
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
      (UserModel.find as any).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });
      await expect(authDataSource.getUsers()).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
    });

    it('should return empty array if no users found', async () => {
      (UserModel.find as any).mockResolvedValueOnce([]);
      const users = await authDataSource.getUsers();
      expect(users).toEqual([]);
      expect(UserModel.find).toHaveBeenCalledTimes(1);
    });

    it('should throw bad request error', async () => {
      (UserModel.find as any).mockResolvedValueOnce([
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

});