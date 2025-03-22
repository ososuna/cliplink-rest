import { describe, it, expect } from 'vitest';
import { CustomError, User } from '@/domain';
import { UserGithubMapper } from '@/infrastructure';
import { Messages } from '@/config';

describe('UserGithubMapper', () => {
  describe('userEntityFromObject', () => {
    it('should create a User instance from a valid object', () => {
      const userData = {
        id: '12345678-90ab-cdef-1234-567890abcdef',
        name: 'Gon',
        lastName: 'Freecss',
        email: 'gon.freecss@gmail.com',
        role: ['user'],
        githubId: 'github-12345'
      };
      
      const user = UserGithubMapper.userEntityFromObject(userData);
      
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(userData.id);
      expect(user.name).toBe(userData.name);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.githubId).toBe(userData.githubId);
    });

    it('should throw an error if ID is missing', () => {
      const userData = {
        name: 'Killua',
        lastName: 'Zoldyck',
        email: 'killua.zoldyck@gmail.com',
        role: ['user'],
        githubId: 'github-67890'
      };

      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('ID'));
    });

    it('should throw an error if name is missing', () => {
      const userData = {
        id: 'abcdef12-3456-7890-abcd-ef1234567890',
        lastName: 'Zoldyck',
        email: 'zoldyck@gmail.com',
        role: ['admin'],
        githubId: 'github-11223'
      };

      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('name'));
    });

    it('should throw an error if lastName is missing', () => {
      const userData = {
        id: 'fedcba98-7654-3210-abcdefabcdef',
        name: 'Kurapika',
        email: 'kurapika@gmail.com',
        role: ['user'],
        githubId: 'github-33445'
      };

      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('last name'));
    });

    it('should throw an error if role is missing', () => {
      const userData = {
        id: 'a1b2c3d4-e5f6-7890-abcd-efghijklmnop',
        name: 'Leorio',
        lastName: 'Paradinight',
        email: 'leorio.paradinight@gmail.com',
        githubId: 'github-55667'
      };

      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('role'));
    });

    it('should throw an error if Github ID is missing', () => {
      const userData = {
        id: '09876543-21ab-cdef-4567-890abcdef123',
        name: 'Hisoka',
        lastName: 'Morow',
        email: 'hisoka.morow@gmail.com',
        role: ['admin']
      };

      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserGithubMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('Github ID'));
    });
  });
});
