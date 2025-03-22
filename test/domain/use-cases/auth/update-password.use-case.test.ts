import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository, UpdatePassword } from '@/domain';
import { AuthRepositoryImpl, AuthDataSourceImpl } from '@/infrastructure';
import { Messages } from '@/config';
import { AuthDataSourceMocks } from '@test/test-utils';

describe('update password use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should update the password and return a new token', async () => {
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'updatePassword').mockResolvedValue(expectedUser);
    const signToken = vi.fn(async () => 'token');
    const result = await new UpdatePassword(authRepository, signToken)
      .execute('token', 'password');
    expect(authRepository.updatePassword).toHaveBeenCalledExactlyOnceWith('token', 'password');
    expect(result).toEqual({
      token: 'token',
      user: {
        id: expectedUser.id,
        name: expectedUser.name,
        lastName: expectedUser.lastName,
        email: expectedUser.email,
      }
    });
  });

  it('should throw an error if the token generation fails', async () => {
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'updatePassword').mockResolvedValue(expectedUser);
    const signToken = vi.fn(async () => null);
    await expect(new UpdatePassword(authRepository, signToken)
      .execute('token', 'password')).rejects.toThrowError(Messages.TOKEN_GENERATION_ERROR);
  });

});