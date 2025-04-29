import { describe, it, expect } from 'vitest';
import { CustomError, ResetPasswordToken } from '@/domain';
import { ResetPasswordTokenMapper } from '@/infrastructure';
import { Messages } from '@/config';

describe('ResetPasswordTokenMapper', () => {
  describe('resetPasswordTokenEntityFromObject', () => {
    it('should create a ResetPasswordToken instance from a valid object', () => {
      const tokenData = {
        id: '12345678-90ab-cdef-1234-567890abcdef',
        token: 'reset-token-123',
        expiresAt: new Date(),
        user: 'user-123',
      };

      const resetToken = ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(tokenData);

      expect(resetToken).toBeInstanceOf(ResetPasswordToken);
      expect(resetToken.id).toBe(tokenData.id);
      expect(resetToken.token).toBe(tokenData.token);
      expect(resetToken.expiresAt).toBe(tokenData.expiresAt);
      expect(resetToken.user).toBe(tokenData.user);
    });

    it('should throw an error if ID is missing', () => {
      const tokenData = {
        token: 'reset-token-123',
        expiresAt: new Date(),
        user: 'user-123',
      };

      expect(() => ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(tokenData)).toThrow(CustomError);
      expect(() => ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(tokenData)).toThrow(Messages.REQUIRED_FIELD('ID'));
    });

    it('should throw an error if token is missing', () => {
      const tokenData = {
        id: 'abcdef12-3456-7890-abcd-ef1234567890',
        expiresAt: new Date(),
        user: 'user-123',
      };

      expect(() => ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(tokenData)).toThrow(CustomError);
      expect(() => ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(tokenData)).toThrow(
        Messages.REQUIRED_FIELD('token'),
      );
    });

    it('should throw an error if expiresAt is missing', () => {
      const tokenData = {
        id: 'fedcba98-7654-3210-abcdefabcdef',
        token: 'reset-token-123',
        user: 'user-123',
      };

      expect(() => ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(tokenData)).toThrow(CustomError);
      expect(() => ResetPasswordTokenMapper.resetPasswordTokenEntityFromObject(tokenData)).toThrow(
        Messages.REQUIRED_FIELD('expires at'),
      );
    });
  });
});
