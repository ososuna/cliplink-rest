import { Router } from 'express';
import { AuthRoutes } from '@/presentation/auth/routes';
import { ShortenerRoutes } from '@/presentation/shortener/routes';
import { UrlRoutes } from '@/presentation/url/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use('/api/v1/auth', AuthRoutes.routes)
    router.use('/api/v1/url', UrlRoutes.routes)
    router.use('', ShortenerRoutes.routes)
    return router;
  }
}