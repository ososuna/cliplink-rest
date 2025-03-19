import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository } from '../../../../src/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../../../../src/infrastructure/repositories/auth.repository.impl';
import { AuthDataSourceImpl } from '../../../../src/infrastructure/datasources/auth.datasource.impl';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { AuthGithub } from '../../../../src/domain';
import { Messages } from '../../../../src/config';

describe('auth github use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should auth with github', async () => {
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'authGithub').mockResolvedValue(expectedUser);
    const signToken = vi.fn(async () => 'token');
    const result = await new AuthGithub(authRepository, signToken).execute('code');
    expect(result).toEqual({
      token: 'token',
      user: {
        id: 'userId',
        name: 'name',
        lastName: 'lastName',
        email: 'email',
      },
    });
  });

  it('should throw error when token generation fails', async () => {
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'authGithub').mockResolvedValue(expectedUser);
    const signToken = vi.fn(async () => null);
    const authGithub = new AuthGithub(authRepository, signToken);
    await expect(authGithub.execute('code')).rejects.toThrow(Messages.TOKEN_GENERATION_ERROR);
  });

});