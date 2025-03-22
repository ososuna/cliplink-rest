import { Router } from 'express';
import { UrlDataSourceImpl, UrlRepositoryImpl } from '@/infrastructure';
import { ShortenerController } from '@/presentation/shortener/controller';

export class ShortenerRoutes {
  static get routes(): Router {
    const router = Router();

    const dataSource = new UrlDataSourceImpl();
    const urlRepository = new UrlRepositoryImpl(dataSource);

    const controller = new ShortenerController(urlRepository);

    router.get('/:shortId', controller.shorten);
    router.get('/', controller.welcome);

    return router;
  }
}