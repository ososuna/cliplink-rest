import { Router } from 'express';
import { UrlRepositoryImpl, UrlDataSourceImpl } from '@/infrastructure';
import { MainController } from '@/presentation/controller';
import { AuthRoutes } from '@/presentation/auth/routes';
import { UrlRoutes } from '@/presentation/url/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    const dataSource = new UrlDataSourceImpl();
    const urlRepository = new UrlRepositoryImpl(dataSource);
    const controller = new MainController(urlRepository);

    router.get('/:shortId', controller.shorten);
    router.get('/', controller.welcome);
    router.use('/api/v1/auth', AuthRoutes.routes)
    router.use('/api/v1/url', UrlRoutes.routes)

    return router;
  }
}