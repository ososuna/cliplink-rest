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
    router.get('/token', AuthMiddleware.validateJWT, controller.checkToken);
    router.get('/logout', controller.logout);
    router.post('/register', controller.registerUser);
    router.get('/', AuthMiddleware.validateJWT, controller.getUsers);
    router.get('/:id', AuthMiddleware.validateJWT, controller.getUser);
    router.put('/', AuthMiddleware.validateJWT, controller.updateUser);

    return router;
  }
}