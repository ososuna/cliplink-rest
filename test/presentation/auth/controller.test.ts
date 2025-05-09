import { beforeAll, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Request, Response } from 'express';
import { GetUser, GetUsers, LoginUser, RefreshToken, RegisterUser, UpdateUser, UpdateUserDto } from '@/domain';
import { AuthDataSourceImpl } from '@/infrastructure';
import { AuthController } from '@/presentation/auth/controller';
import { AuthDataSourceMocks, createMockRequest, createMockResponse } from '@test/test-utils';
import { Messages } from '@/config';

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
        accessToken: 'token',
        refreshToken: 'token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          lastName: mockUser.lastName,
          email: mockUser.email,
        },
      });
      const req = createMockRequest({
        body: {
          name: 'John',
          lastName: 'Wick',
          email: 'john@test.com',
          password: 'password',
        },
        method: 'POST',
        url: '/auth/register',
      });
      const res = createMockResponse();
      authController.registerUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(RegisterUser.prototype.execute).toHaveBeenCalledTimes(1);
      expect(RegisterUser.prototype.execute).toHaveBeenCalledWith({
        name: 'John',
        lastName: 'Wick',
        email: 'john@test.com',
        password: 'password',
      });
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'token', expect.any(Object));
    });

    it('should return error 400 if dto is invalid', async () => {
      const req = createMockRequest({
        body: {
          name: '',
          lastName: 'Wick',
          email: 'john@test.com',
          password: 'password',
        },
        method: 'POST',
        url: '/auth/register',
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
        accessToken: 'token',
        refreshToken: 'token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          lastName: mockUser.lastName,
          email: mockUser.email,
        },
      });
      const req = createMockRequest({
        body: {
          email: 'john@test.com',
          password: 'password',
        },
        method: 'POST',
        url: '/auth/login',
      });
      const res = createMockResponse();
      authController.loginUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(LoginUser.prototype.execute).toHaveBeenCalledTimes(1);
      expect(LoginUser.prototype.execute).toHaveBeenCalledWith({
        email: 'john@test.com',
        password: 'password',
      });
      expect(res.cookie).toHaveBeenCalledWith('access_token', 'token', expect.any(Object));
    });

    it('should return error 400 if dto is invalid', async () => {
      const req = createMockRequest({
        body: {
          email: '',
          password: 'password',
        },
        method: 'POST',
        url: '/auth/login',
      });
      const res = createMockResponse();
      authController.loginUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
  });

  describe('get users', () => {
    let getUsersSpy: MockInstance;

    beforeEach(() => {
      getUsersSpy?.mockRestore();
    });

    it('should get users', async () => {
      const mockUsers = AuthDataSourceMocks.users;
      getUsersSpy = vi.spyOn(GetUsers.prototype, 'execute').mockResolvedValue(mockUsers);
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/users',
      });
      const res = createMockResponse();
      authController.getUsers(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return error 500 if there is an error', async () => {
      const mockError = new Error('Database error');
      getUsersSpy = vi.spyOn(GetUsers.prototype, 'execute').mockRejectedValue(mockError);
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/users',
      });
      const res = createMockResponse();
      authController.getUsers(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('get user', () => {
    let getUserSpy: MockInstance;

    beforeEach(() => {
      getUserSpy?.mockRestore();
    });

    it('should get user', async () => {
      const mockUser = AuthDataSourceMocks.user;
      getUserSpy = vi.spyOn(GetUser.prototype, 'execute').mockResolvedValue(mockUser);
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/user',
      });
      const res = createMockResponse();
      authController.getUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('logout user', () => {
    it('should logout user', async () => {
      const req = createMockRequest({
        method: 'POST',
        url: '/auth/logout',
      });
      const res = createMockResponse();
      authController.logout(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith({ message: Messages.LOGOUT_SUCCESSFUL });
    });
  });

  describe('check token', () => {
    it('should check token', async () => {
      const mockUser = AuthDataSourceMocks.user;
      const req = createMockRequest({
        method: 'POST',
        url: '/auth/check-token',
        body: {
          user: mockUser,
        },
      });
      const res = createMockResponse();
      authController.checkToken(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        name: mockUser.name,
        lastName: mockUser.lastName,
        email: mockUser.email,
        githubId: mockUser.githubId,
        googleId: mockUser.googleId,
      });
    });
  });

  describe('refresh token', () => {
    let refreshTokenSpy: MockInstance;

    beforeEach(() => {
      refreshTokenSpy?.mockRestore();
    });

    it('should refresh token', async () => {
      const mockUser = AuthDataSourceMocks.user;
      refreshTokenSpy = vi.spyOn(RefreshToken.prototype, 'execute').mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'token',
        user: mockUser,
      });
      const req = createMockRequest({
        method: 'POST',
        url: '/auth/refresh-token',
        body: {
          user: mockUser,
        },
      });
      const res = createMockResponse();
      authController.refreshToken(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.send).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update user', () => {
    let updateUserSpy: MockInstance;

    beforeEach(() => {
      updateUserSpy?.mockRestore();
    });

    it('should update user', async () => {
      const mockUser = AuthDataSourceMocks.user;
      updateUserSpy = vi.spyOn(UpdateUser.prototype, 'execute').mockResolvedValue(mockUser);
      const req = createMockRequest({
        method: 'PUT',
        url: '/auth/user',
        body: {
          user: mockUser,
        },
      });
      const res = createMockResponse();
      authController.updateUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return error 400 if dto is invalid', async () => {
      const mockUser = AuthDataSourceMocks.user;
      vi.spyOn(UpdateUserDto, 'create').mockReturnValue(['invalid dto', undefined]);
      const req = createMockRequest({
        method: 'PUT',
        url: '/auth/user',
        body: {
          user: mockUser,
        },
      });
      const res = createMockResponse();
      authController.updateUser(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'invalid dto' });
    });
  });

  describe('login github', () => {
    it('should login github', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/login/github',
      });
      const res = createMockResponse();
      authController.loginGithub(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.redirect).toHaveBeenCalledWith(
        'https://github.com/login/oauth/authorize?client_id=dummy-value&redirect_uri=dummy-value',
      );
    });
  });
});
