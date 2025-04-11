import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository, CheckPasswordToken } from '@/domain';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '@/infrastructure';
import { AuthDataSourceMocks } from '@test/test-utils';

describe('check password token use case', () => {
  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should return a reset password token', async () => {
    const expectedResetPasswordToken = AuthDataSourceMocks.resetPasswordToken;
    vi.spyOn(authRepository, 'isValidPasswordToken').mockResolvedValue(expectedResetPasswordToken);
    const result = await new CheckPasswordToken(authRepository).execute('token');
    expect(result).toEqual(expectedResetPasswordToken);
    expect(authRepository.isValidPasswordToken).toHaveBeenCalledExactlyOnceWith('token');
  });
});
