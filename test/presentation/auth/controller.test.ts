import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Request, Response } from 'express';
import { LoginUser, RegisterUser } from '@/domain';
import { AuthDataSourceImpl } from '@/infrastructure';
import { AuthController } from '@/presentation/auth/controller';
import { AuthDataSourceMocks, createMockRequest, createMockResponse } from '@test/test-utils';

describe('auth controller', () => {

  let authController: AuthController;
  
  beforeAll(() => {
    const shortIdGenerator = vi.fn(() => 'shortId');
    authController = new AuthController(new AuthDataSourceImpl(shortIdGenerator));
  });

  describe('register user', () => {   
    it('should register user', async () => {
      const mockUser = AuthDataSourceMocks.user;
      vi.spyOn(RegisterUser.prototype, 'execute').mockResolvedValue({
        token: 'token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          lastName: mockUser.lastName,
          email: mockUser.email
        }
      });
      const req = createMockRequest({
        body: {
          name: 'John',
          lastName: 'Wick',
          email: 'john@test.com',
          password: 'password'
        },
        method: 'POST',
        url: '/auth/register'
      });
      const res = createMockResponse();
      authController.registerUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(RegisterUser.prototype.execute).toHaveBeenCalledTimes(1);
      expect(RegisterUser.prototype.execute).toHaveBeenCalledWith({
        name: 'John',
        lastName: 'Wick',
        email: 'john@test.com',
        password: 'password'
      });
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'token',
        expect.any(Object)
      );      
    });

    it('should return error 400 if dto is invalid', async () => {
      const req = createMockRequest({
        body: {
          name: '',
          lastName: 'Wick',
          email: 'john@test.com',
          password: 'password'
        },
        method: 'POST',
        url: '/auth/register'
      });
      const res = createMockResponse();
      authController.registerUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });

  });

  describe('login user', () => {
    it('should login user', async () => {
      const mockUser = AuthDataSourceMocks.user;
      vi.spyOn(LoginUser.prototype, 'execute').mockResolvedValue({
        token: 'token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          lastName: mockUser.lastName,
          email: mockUser.email
        }
      });
      const req = createMockRequest({
        body: {
          email: 'john@test.com',
          password: 'password'
        },
        method: 'POST',
        url: '/auth/login'
      });
      const res = createMockResponse();
      authController.loginUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(LoginUser.prototype.execute).toHaveBeenCalledTimes(1);
      expect(LoginUser.prototype.execute).toHaveBeenCalledWith({
        email: 'john@test.com',
        password: 'password'
      });
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'token',
        expect.any(Object)
      );      
    });

    it('should return error 400 if dto is invalid', async () => {
      const req = createMockRequest({
        body: {
          email: '',
          password: 'password'
        },
        method: 'POST',
        url: '/auth/login'
      });
      const res = createMockResponse();
      authController.loginUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });
});