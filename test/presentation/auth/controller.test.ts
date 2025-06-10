import { beforeAll, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Request, Response } from 'express';
import {
  AuthGithub,
  AuthGoogle,
  CustomError,
  GetUser,
  GetUsers,
  LoginUser,
  RefreshToken,
  RegisterUser,
  UpdateUser,
  UpdateUserDto,
} from '@/domain';
import { envs, Messages } from '@/config';
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
        url: '/auth/github',
      });
      const res = createMockResponse();
      authController.loginGithub(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.redirect).toHaveBeenCalledWith(
        'https://github.com/login/oauth/authorize?client_id=dummy-value&redirect_uri=dummy-value',
      );
    });
  });

  describe('login github callback', () => {
    let loginGithubCallbackSpy: MockInstance;

    beforeEach(() => {
      loginGithubCallbackSpy?.mockRestore();
    });

    it('should login github', async () => {
      const mockUser = AuthDataSourceMocks.user;
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/github/callback',
        query: {
          code: 'dummy-code',
        },
      });
      const res = createMockResponse();
      loginGithubCallbackSpy = vi.spyOn(AuthGithub.prototype, 'execute').mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'token',
        user: mockUser,
      });
      authController.loginGithubCallback(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.redirect).toHaveBeenCalledWith(`${envs.WEB_APP_URL}/dashboard`);
    });

    it('should return error 400 if code is not provided', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/github/callback',
      });
      const res = createMockResponse();
      expect(() => authController.loginGithubCallback(req as Request, res as Response)).toThrow(
        CustomError.badRequest(Messages.REQUIRED_FIELD('Github auth code')),
      );
    });

    it('should return error 500 if there is an error', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/github/callback',
        query: {
          code: 'dummy-code',
        },
      });
      const res = createMockResponse();
      loginGithubCallbackSpy = vi.spyOn(AuthGithub.prototype, 'execute').mockRejectedValue(new Error('Database error'));
      authController.loginGithubCallback(req as Request, res as Response);

      await new Promise(process.nextTick);

      const expectedUrl = 'https://www.cliplink.app/auth/login?error=Something+went+wrong+on+our+end.+Please+try+again+later.';
      expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return custom error', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/github/callback',
        query: {
          code: 'dummy-code',
        },
      });
      const res = createMockResponse();
      loginGithubCallbackSpy = vi
        .spyOn(AuthGithub.prototype, 'execute')
        .mockRejectedValue(CustomError.forbidden('Forbidden error'));
      authController.loginGithubCallback(req as Request, res as Response);

      await new Promise(process.nextTick);

      const expectedUrl = 'https://www.cliplink.app/auth/login?error=Forbidden+error';
      expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
    });
  });

  describe('login google', () => {
    it('should login google', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/google',
      });
      const res = createMockResponse();
      authController.loginGoogle(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.redirect).toHaveBeenCalledWith(
        'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=dummy-value&redirect_uri=dummy-value&scope=openid%20email%20profile',
      );
    });
  });

  describe('login google callback', () => {
    let loginGoogleCallbackSpy: MockInstance;

    beforeEach(() => {
      loginGoogleCallbackSpy?.mockRestore();
    });

    it('should login google', async () => {
      const mockUser = AuthDataSourceMocks.user;
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/google/callback',
        query: {
          code: 'dummy-code',
        },
      });
      const res = createMockResponse();
      loginGoogleCallbackSpy = vi.spyOn(AuthGoogle.prototype, 'execute').mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'token',
        user: mockUser,
      });
      authController.loginGoogleCallback(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.redirect).toHaveBeenCalledWith(`${envs.WEB_APP_URL}/dashboard`);
    });

    it('should return error 400 if code is not provided', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/google/callback',
      });
      const res = createMockResponse();
      expect(() => authController.loginGoogleCallback(req as Request, res as Response)).toThrow(
        CustomError.badRequest(Messages.REQUIRED_FIELD('Google auth code')),
      );
    });

    it('should return error 500 if there is an error', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/google/callback',
        query: {
          code: 'dummy-code',
        },
      });
      const res = createMockResponse();
      loginGoogleCallbackSpy = vi.spyOn(AuthGoogle.prototype, 'execute').mockRejectedValue(new Error('Database error'));
      authController.loginGoogleCallback(req as Request, res as Response);

      await new Promise(process.nextTick);

      const expectedUrl = 'https://www.cliplink.app/auth/login?error=Something+went+wrong+on+our+end.+Please+try+again+later.';
      expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
    });

    it('should return custom error', async () => {
      const req = createMockRequest({
        method: 'GET',
        url: '/auth/google/callback',
        query: {
          code: 'dummy-code',
        },
      });
      const res = createMockResponse();
      loginGoogleCallbackSpy = vi
        .spyOn(AuthGoogle.prototype, 'execute')
        .mockRejectedValue(CustomError.forbidden('Forbidden error'));
      authController.loginGoogleCallback(req as Request, res as Response);

      await new Promise(process.nextTick);

      const expectedUrl = 'https://www.cliplink.app/auth/login?error=Forbidden+error';
      expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
