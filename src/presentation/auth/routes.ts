import { Router } from 'express';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '@/infrastructure';
import { AuthController } from '@/presentation/auth/controller';
import { AuthMiddleware, AuthLimiter, NonAuthLimiter } from '@/presentation/middlewares';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    
    const dataSource = new AuthDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(dataSource);
    const controller = new AuthController(authRepository);
    
    router.post('/login', NonAuthLimiter.limit, controller.loginUser);
    router.get('/github', NonAuthLimiter.limit, controller.loginGithub);
    router.get('/github/callback', NonAuthLimiter.limit, controller.loginGithubCallback);
    router.get('/google', NonAuthLimiter.limit, controller.loginGoogle);
    router.get('/google/callback', NonAuthLimiter.limit, controller.loginGoogleCallback);
    router.get('/token', AuthMiddleware.validateAccessToken, controller.checkToken);
    router.get('/refresh-token', AuthMiddleware.validateRefreshToken, controller.refreshToken);
    router.get('/logout', NonAuthLimiter.limit, controller.logout);
    router.post('/register', NonAuthLimiter.limit, controller.registerUser);
    router.get('/users', AuthMiddleware.validateAccessToken, AuthLimiter.limit, controller.getUsers);
    router.get('/user/:id', AuthMiddleware.validateAccessToken, AuthLimiter.limit, controller.getUser);
    router.put('/', AuthMiddleware.validateAccessToken, AuthLimiter.limit, controller.updateUser);
    router.delete('/', AuthMiddleware.validateAccessToken, AuthLimiter.limit, controller.deleteAccount);
    router.post('/forgot-password', NonAuthLimiter.limit, controller.forgotPassword);
    router.get('/password-token/:token', NonAuthLimiter.limit, controller.checkResetPasswordToken);
    router.put('/update-password', NonAuthLimiter.limit, controller.updatePassword);

    return router;
  }
}