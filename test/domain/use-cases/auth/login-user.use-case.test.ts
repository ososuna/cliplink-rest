import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository, LoginUser, LoginUserDto } from '@/domain';
import { AuthRepositoryImpl, AuthDataSourceImpl } from '@/infrastructure';
import { Messages } from '@/config';
import { AuthDataSourceMocks } from '@test/test-utils';

describe('login user use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should login user', async () => {
    const [error, loginUserDto] = LoginUserDto.create({
      email: 'user@example.com',
      password: 'password',
    });
    expect(error).toBeUndefined();
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'login').mockResolvedValue(expectedUser);
    const signToken = vi.fn(async () => 'token');
    const result = await new LoginUser(authRepository, signToken).execute(loginUserDto!);
    expect(result).toEqual({
      token: 'token',
      user: {
        email: 'email',
        id: 'userId',
        lastName: 'lastName',
        name: 'name',
      }
    });
  });

  it('should throw error when token generation fails', async () => {
    const [error, loginUserDto] = LoginUserDto.create({
      email: 'user@example.com',
      password: 'password',
    });
    expect(error).toBeUndefined();
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'login').mockResolvedValue(expectedUser);
    const signToken = vi.fn(async () => null);
    await expect(new LoginUser(authRepository, signToken).execute(loginUserDto!))
      .rejects.toThrow(Messages.TOKEN_GENERATION_ERROR);
  });

});