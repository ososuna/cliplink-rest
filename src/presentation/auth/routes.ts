import { Router } from 'express';
import { AuthController } from './controller';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../infrastructure';
import { AuthMiddleware, AuthLimiter, NonAuthLimiter } from '../middlewares';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    
    const dataSource = new AuthDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(dataSource);
    const controller = new AuthController(authRepository);
    
    // Define main routes
    router.post('/login', NonAuthLimiter.limit, controller.loginUser);
    router.get('/github', NonAuthLimiter.limit, controller.loginGithub);
    router.get('/github/callback', NonAuthLimiter.limit, controller.loginGithubCallback);
    router.get('/google', NonAuthLimiter.limit, controller.loginGoogle);
    router.get('/google/callback', NonAuthLimiter.limit, controller.loginGoogleCallback);
    router.get('/token', AuthMiddleware.validateJWT, controller.checkToken);
    router.get('/logout', NonAuthLimiter.limit, controller.logout);
    router.post('/register', NonAuthLimiter.limit, controller.registerUser);
    router.get('/users', AuthMiddleware.validateJWT, AuthLimiter.limit, controller.getUsers);
    router.get('/user/:id', AuthMiddleware.validateJWT, AuthLimiter.limit, controller.getUser);
    router.put('/', AuthMiddleware.validateJWT, AuthLimiter.limit, controller.updateUser);
    router.delete('/', AuthMiddleware.validateJWT, AuthLimiter.limit, controller.deleteAccount);
    router.post('/forgot-password', NonAuthLimiter.limit, controller.forgotPassword);
    router.get('/password-token/:token', NonAuthLimiter.limit, controller.checkResetPasswordToken);
    router.put('/update-password', NonAuthLimiter.limit, controller.updatePassword);

    return router;
  }
}