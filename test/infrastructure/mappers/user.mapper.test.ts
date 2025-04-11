import { describe, expect, it } from 'vitest';
import { CustomError, User } from '@/domain';
import { UserMapper } from '@/infrastructure';
import { Messages } from '@/config';

describe('UserMapper', () => {
  describe('userEntityFromObject', () => {
    it('should create user entity', () => {
      const userObj = {
        id: '567499e7-5805-42ee-b0ff-8fb6fc6b5824',
        name: 'Tanjirou',
        lastName: 'Kamado',
        email: 'tanjirou@gmail.com',
        password: '12345678',
        role: ['user'],
      };
      const user = UserMapper.userEntityFromObject(userObj);
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(userObj.id);
      expect(user.name).toBe(userObj.name);
      expect(user.lastName).toBe(userObj.lastName);
      expect(user.email).toBe(userObj.email);
      expect(user.password).toBe(userObj.password);
      expect(user.role).toBe(userObj.role);
    });

    it('should throw an error if ID is missing', () => {
      const userData = {
        name: 'Nezuko',
        lastName: 'Kamado',
        email: 'nezuko@gmail.com',
        password: '87654321',
        role: ['user'],
      };
      expect(() => UserMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('ID'));
    });

    it('should throw an error if name is missing', () => {
      const userData = {
        id: '89c2d1a3-6f3e-4c89-a9a8-3a2eae2bba72',
        lastName: 'Rengoku',
        email: 'rengoku@gmail.com',
        password: 'flamehashira',
        role: ['admin'],
      };
      expect(() => UserMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('name'));
    });

    it('should throw an error if lastName is missing', () => {
      const userData = {
        id: 'c1a2b3d4-e5f6-7890-abcdef123456',
        name: 'Zenitsu',
        email: 'zenitsu@gmail.com',
        password: 'thunderclap',
        role: ['user'],
      };
      expect(() => UserMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('last name'));
    });

    it('should throw an error if role is missing', () => {
      const userData = {
        id: 'a2b3c4d5-e6f7-8901-abcdef987654',
        name: 'Inosuke',
        lastName: 'Hashibira',
        email: 'inosuke@gmail.com',
        password: 'beastbreath',
      };
      expect(() => UserMapper.userEntityFromObject(userData)).toThrow(CustomError);
      expect(() => UserMapper.userEntityFromObject(userData)).toThrow(Messages.REQUIRED_FIELD('role'));
    });
  });
});
