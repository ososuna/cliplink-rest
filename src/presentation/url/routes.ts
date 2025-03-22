import { Router } from 'express';
import { UrlController } from '@/presentation/url/controller';
import { UrlDataSourceImpl, UrlRepositoryImpl } from '@/infrastructure';
import { AuthLimiter, NonAuthLimiter, AuthMiddleware, CreateUrlMiddleware } from '@/presentation/middlewares';

export class UrlRoutes {
  static get routes(): Router {
    const router = Router();

    const dataSource = new UrlDataSourceImpl();
    const urlRepository = new UrlRepositoryImpl(dataSource);

    const controller = new UrlController(urlRepository);

    // Define main routes
    router.post('/', CreateUrlMiddleware.validateJWT, NonAuthLimiter.limit, controller.createUrl);
    router.get('/', AuthMiddleware.validateJWT, controller.getUrls);
    router.get('/:id', AuthMiddleware.validateJWT, AuthLimiter.limit, controller.getUrl);
    router.delete('/:id', AuthMiddleware.validateJWT, AuthLimiter.limit, controller.deleteUrl);
    router.put('/:id', AuthMiddleware.validateJWT, AuthLimiter.limit, controller.updateUrl);

    return router;
  }
}