import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository, AuthGithub} from '@/domain';
import { AuthRepositoryImpl, AuthDataSourceImpl } from '@/infrastructure';
import { Messages } from '@/config';
import { AuthDataSourceMocks } from '@test/test-utils';

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