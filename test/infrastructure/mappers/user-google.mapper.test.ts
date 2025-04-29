import { describe, it, expect } from 'vitest';
import { CustomError, User } from '@/domain';
import { UserGoogleMapper } from '@/infrastructure';
import { Messages } from '@/config';

describe('UserGoogleMapper', () => {
  describe('userEntityFromObject', () => {
    it('should create a User instance from a valid object', () => {
      const userData = {
        id: '1a2b3c4d-5678-90ef-ghij-klmnopqrstuv',
        name: 'Eren',
        lastName: 'Yeager',
        email: 'eren.yeager@gmail.com',
        role: ['user'],
        googleId: 'google-12345',
      };

      const user = UserGoogleMapper.userEntityFromObject(userData);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(userData.id);
      expect(user.name).toBe(userData.name);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.googleId).toBe(userData.googleId);
    });

    it('should throw an error if ID is missing', () => {
      const userData = {
        name: 'Mikasa',
        lastName: 'Ackerman',
        email: 'mikasa.ackerman@gmail.com',
        role: ['user'],
        googleId: 'google-67890',
      };

      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('ID'));
    });

    it('should throw an error if name is missing', () => {
      const userData = {
        id: '2b3c4d5e-6789-01fg-hijk-lmnopqrstuvw',
        lastName: 'Armin',
        email: 'armin.arlet@gmail.com',
        role: ['admin'],
        googleId: 'google-11223',
      };

      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('name'));
    });

    it('should throw an error if lastName is missing', () => {
      const userData = {
        id: '3c4d5e6f-7890-12gh-ijkl-mnopqrstuvwx',
        name: 'Levi',
        email: 'levi.ackerman@gmail.com',
        role: ['user'],
        googleId: 'google-33445',
      };

      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('last name'));
    });

    it('should throw an error if role is missing', () => {
      const userData = {
        id: '4d5e6f7g-8901-23hi-jklm-nopqrstuvwxy',
        name: 'Hange',
        lastName: 'Zoë',
        email: 'hange.zoe@gmail.com',
        googleId: 'google-55667',
      };

      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('role'));
    });

    it('should throw an error if Google ID is missing', () => {
      const userData = {
        id: '5e6f7g8h-9012-34ij-klmn-opqrstuvwxyz',
        name: 'Erwin',
        lastName: 'Smith',
        email: 'erwin.smith@gmail.com',
        role: ['admin'],
      };

      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGoogleMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('Google ID'));
    });
  });
});
