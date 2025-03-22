import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository, GetUsers } from '@/domain';
import { AuthRepositoryImpl, AuthDataSourceImpl } from '@/infrastructure';
import { AuthDataSourceMocks } from '@test/test-utils';

describe('get users use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should get users', async () => {
    const expectedUsers = AuthDataSourceMocks.users;
    vi.spyOn(authRepository, 'getUsers').mockResolvedValue(expectedUsers);
    const result = await new GetUsers(authRepository).execute();
    expect(result).toEqual(expectedUsers);
  });

});