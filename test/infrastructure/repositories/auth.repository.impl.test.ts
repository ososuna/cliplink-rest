import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthDataSourceMocks } from '../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { LoginUserDto, RegisterUserDto, User, type AuthRepository } from '../../../src/domain';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../../src/infrastructure';
import { UserModel } from '../../../src/data/mongodb';
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

  
});