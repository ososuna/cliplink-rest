import { Router } from 'express';
import { AuthController } from './controller';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../infrastructure';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    
    const dataSource = new AuthDataSourceImpl();
    const authRepository = new AuthRepositoryImpl(dataSource);
    
    const controller = new AuthController(authRepository);
    
    // Define main routes
    router.post('/login', controller.loginUser);
    router.get('/github', controller.loginGithub);
    router.get('/github/callback', controller.loginGithubCallback);
    router.get('/google', controller.loginGoogle);
    router.get('/google/callback', controller.loginGoogleCallback);
    router.get('/token', AuthMiddleware.validateJWT, controller.checkToken);
    router.get('/logout', controller.logout);
    router.post('/register', controller.registerUser);
    router.get('/users', AuthMiddleware.validateJWT, controller.getUsers);
    router.get('/user/:id', AuthMiddleware.validateJWT, controller.getUser);
    router.put('/', AuthMiddleware.validateJWT, controller.updateUser);
    router.delete('/', AuthMiddleware.validateJWT, controller.deleteAccount);
    router.get('/forgot-password', controller.forgotPassword);
    router.get('/password-token/:token', controller.checkResetPasswordToken);
    router.put('/update-password', controller.updatePassword);

    return router;
  }
}