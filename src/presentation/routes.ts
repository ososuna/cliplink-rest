import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { UrlRoutes } from './url/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    
    // Define main routes
    router.use('/api/v1/auth', AuthRoutes.routes)
    router.use('/api/v1/url', UrlRoutes.routes)
    
    return router;
  }
}