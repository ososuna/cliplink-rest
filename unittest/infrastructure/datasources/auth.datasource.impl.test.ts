import { beforeEach, describe, it, vi, expect } from 'vitest';
import { AuthDataSourceMocks } from '../../test-utils/mocks/auth.datasource.mocks';
import { AuthDataSourceImpl } from '../../../src/infrastructure';
import { UserModel } from '../../../src/data/mongodb';
import { Messages } from '../../../src/config';
import { isValidObjectId } from 'mongoose';

AuthDataSourceMocks.setupMocks();

describe('AuthDataSourceImpl - get user', () => {

  let authDataSource: AuthDataSourceImpl;

  const hashPasswordMock = vi.fn((password: string) => `hashed-${password}`);
  const comparePasswordMock = vi.fn();

  beforeEach(() => {
    authDataSource = new AuthDataSourceImpl(hashPasswordMock, comparePasswordMock);
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

  it('should throw 500 error', async () => {
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

  it('should throw error if email is already registered', async () => {
    (UserModel.findOne as any).mockResolvedValueOnce({
      _id: 'userId',
      name: 'name',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
      roles: ['role'],
    });
    const registerUserDto = {
      name: 'name',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
    };
    await expect(authDataSource.register(registerUserDto)).rejects.toThrow('his email address cannot be used to create an account. Please use a different email address.');
    expect(UserModel.findOne).toHaveBeenCalledTimes(1);
  });

});