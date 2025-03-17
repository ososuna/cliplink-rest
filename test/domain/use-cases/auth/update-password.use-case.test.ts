import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository } from '../../../../src/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../../../../src/infrastructure/repositories/auth.repository.impl';
import { AuthDataSourceImpl } from '../../../../src/infrastructure/datasources/auth.datasource.impl';
import { UpdatePassword } from '../../../../src/domain';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { Messages } from '../../../../src/config';

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