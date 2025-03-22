import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthDataSourceMocks } from '../../../test-utils/infrastructure/datasources/auth.datasource.mocks';
import { AuthRepository } from '../../../../src/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from '../../../../src/infrastructure/repositories/auth.repository.impl';
import { AuthDataSourceImpl } from '../../../../src/infrastructure/datasources/auth.datasource.impl';
import { ForgotPassword } from '../../../../src/domain';

describe('forgot password use case', () => {

  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');
  const idGenerator = vi.fn(() => 'e204b07e-a274-4a4b-9ef4-b9a3c71d81db');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
    vi.mock('path', () => ({
      resolve: vi.fn(() => 'templatePath')
    }));
    vi.mock('fs/promises', () => ({
      readFile: vi.fn((_path, _encoding) => Promise.resolve('<html>{{resetLink}}</html>'))
    }));
    vi.mock('resend', () => ({
      Resend: vi.fn(() => ({
        emails: {
          send: vi.fn(() => Promise.resolve({ error: null }))
        }
      }))
    }));
  });

  it('should send an email with a link to reset the password', async () => {
    const expectedUser = AuthDataSourceMocks.user;
    const expectedPasswordToken = AuthDataSourceMocks.resetPasswordToken;
    vi.spyOn(authRepository, 'getUserByEmail').mockResolvedValue(expectedUser);
    vi.spyOn(authRepository, 'saveResetPasswordToken').mockResolvedValue(expectedPasswordToken);
    const result = await new ForgotPassword(authRepository, idGenerator).execute('user@example.com');
    expect(result).toBeUndefined();
    expect(authRepository.getUserByEmail).toHaveBeenCalledOnce();
    expect(authRepository.getUserByEmail).toHaveBeenCalledWith('user@example.com');
    expect(authRepository.saveResetPasswordToken).toHaveBeenCalledOnce();
    expect(authRepository.saveResetPasswordToken).toHaveBeenCalledWith(expectedUser.id, 'e204b07e-a274-4a4b-9ef4-b9a3c71d81db');
  });

});