import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthDataSourceMocks } from '../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { LoginUserDto, RegisterUserDto, ResetPasswordToken, UpdateUserDto, User, type AuthRepository } from '../../../src/domain';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../../src/infrastructure';
import { ResetPasswordTokenModel, UserModel } from '../../../src/data/mongodb';
import { asMock } from '../../test-utils/test-utils';

AuthDataSourceMocks.setupMocks();

describe('AuthRepositoryImpl', () => {

  let authRepository: AuthRepository;
  
  const hashPasswordMock = vi.fn((password: string) => `hashed-${password}`);
  const comparePasswordMock = vi.fn(() => true);
  
  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(hashPasswordMock, comparePasswordMock));
  });

  it('login', async () => {
    asMock(UserModel.findOne).mockResolvedValueOnce({
      _id: 'userId',
      name: 'name',
      password: 'hashed-password',
      lastName: 'lastName',
      email: 'user@example.com',
      role: ['role'],
    });
    const [_error, loginUserDto] = LoginUserDto.create({
      email: 'user@example.com',
      password: '12345678'
    });
    const user = await authRepository.login(loginUserDto!);
    expect(user).instanceOf(User);
    expect(user).toEqual({
      id: "userId",
      name: 'name',
      password: 'hashed-password',
      lastName: 'lastName',
      email: 'user@example.com',
      role: ['role'],
    });
  });

  it('register', async () => {
    const [_error, registerUserDto] = RegisterUserDto.create({
      name: 'name',
      lastName: 'lastName',
      email: 'user@example.com',
      password: '12345678'
    });
    const user = await authRepository.register(registerUserDto!);
    expect(user).instanceOf(User);
    expect(user).toEqual({
      id: "userId",
      name: 'name',
      password: 'hashed-password',
      lastName: 'lastName',
      email: 'email',
      role: ['role'],
    });
  });

  it('get users', async () => {
    const users = await authRepository.getUsers();
    expect(users).instanceOf(Array<User>);
    expect(users).toEqual(AuthDataSourceMocks.users);
  });
  
  it('get user', async () => {
    const user = await authRepository.getUser('userId');
    expect(user).instanceOf(User);
    expect(user).toEqual(AuthDataSourceMocks.user);
  });

  it('update user', async () => {
    const [_error, updateUserDto] = UpdateUserDto.create({
      name: 'name',
      lastName: 'lastName',
      email: 'user@example.com',
    });
    const user = await authRepository.updateUser('userId', updateUserDto!);
    expect(user).instanceOf(User);
    expect(user).toEqual(AuthDataSourceMocks.updatedUser)
  });

  it('auth github', async () => {
    asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.githubUser);
    const user = await authRepository.authGithub('code');
    expect(user).instanceOf(User);
    expect(user).toEqual(AuthDataSourceMocks.githubUser);
  });

  it('auth google', async () => {
    asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.googleUser);
    const user = await authRepository.authGoogle('code');
    expect(user).instanceOf(User);
    expect(user).toEqual(AuthDataSourceMocks.googleUser);
  });

  it('delete account', async () => {
    const user = await authRepository.deleteAccount('userId');
    expect(user).instanceOf(User);
    expect(user).toEqual(AuthDataSourceMocks.user);
  });

  it('get user by email', async () => {
    asMock(UserModel.findOne).mockResolvedValueOnce(AuthDataSourceMocks.user);
    const user = await authRepository.getUserByEmail('user@test.com');
    expect(user).instanceOf(User);
    expect(user).toEqual(AuthDataSourceMocks.user);
  });

  it('save reset password token', async () => {
    const resetPasswordToken = await authRepository.saveResetPasswordToken('userId', 'token');
    expect(resetPasswordToken).instanceOf(ResetPasswordToken);
    expect(resetPasswordToken).toEqual(AuthDataSourceMocks.resetPasswordToken);
  });

  it('is valid password token', async () => {
    asMock(ResetPasswordTokenModel.findOne).mockResolvedValue(AuthDataSourceMocks.validResetPasswordToken);
    const resetPasswordToken = await authRepository.isValidPasswordToken('token');
    expect(resetPasswordToken).instanceOf(ResetPasswordToken);
    expect(resetPasswordToken).toEqual(AuthDataSourceMocks.validResetPasswordToken);
  });

  it('update password', async () => {
    const user = {
      ...AuthDataSourceMocks.user,
      _id: AuthDataSourceMocks.user.id,
      active: true,
      save: vi.fn()
    };
    const passwordToken = {
      id: 'resetPasswordTokenId',
      user: user,
      token: 'token',
      expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
      active: true,
      save: vi.fn()
    };
    asMock(UserModel.findById).mockResolvedValueOnce(user);
    asMock(ResetPasswordTokenModel.findOne).mockResolvedValue(passwordToken);
    const updatedUser = await authRepository.updatePassword('token', 'newPassword');
    expect(updatedUser).instanceOf(User);
    expect(updatedUser).toEqual({
      email: 'email',
      id: 'userId',
      lastName: 'lastName',
      name: 'name',
      password: 'hashed-newPassword',
      role: ['role']
    });
  });

});