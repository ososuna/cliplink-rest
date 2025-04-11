import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository, RegisterUser, RegisterUserDto } from '@/domain';
import { AuthRepositoryImpl, AuthDataSourceImpl } from '@/infrastructure';
import { Messages } from '@/config';
import { AuthDataSourceMocks } from '@test/test-utils';

describe('register user use case', () => {
  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should register a new user', async () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'Tyler',
      lastName: 'Joseph',
      email: 'tyler@top.com',
      password: '12345678',
    });
    expect(error).toBeUndefined();

    const expectedUser = AuthDataSourceMocks.user;
    const signToken = vi.fn(async () => 'token');

    vi.spyOn(authRepository, 'register').mockResolvedValue(expectedUser);

    const result = await new RegisterUser(authRepository, signToken).execute(registerUserDto!);

    expect(authRepository.register).toHaveBeenCalledWith(registerUserDto);
    expect(result).toEqual({
      accessToken: 'token',
      refreshToken: 'token',
      user: {
        email: 'email',
        id: 'userId',
        lastName: 'lastName',
        name: 'name',
      },
    });
  });

  it('should throw an error when token generation fails', async () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'Tyler',
      lastName: 'Joseph',
      email: 'tyler@top.com',
      password: '12345678',
    });
    expect(error).toBeUndefined();

    const expectedUser = AuthDataSourceMocks.user;
    const signToken = vi.fn(async () => null);

    vi.spyOn(authRepository, 'register').mockResolvedValue(expectedUser);

    await expect(new RegisterUser(authRepository, signToken).execute(registerUserDto!)).rejects.toThrow(
      Messages.TOKEN_GENERATION_ERROR,
    );
  });
});
