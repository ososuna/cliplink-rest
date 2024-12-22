import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { UrlRoutes } from './url/routes';
import { ShortenerRoutes } from './shortener/routes';
export class AppRoutes {
    static get routes() {
        const router = Router();
        // Define main routes
        router.use('/api/v1/auth', AuthRoutes.routes);
        router.use('/api/v1/url', UrlRoutes.routes);
        router.use('', ShortenerRoutes.routes);
        return router;
    }
}
//# sourceMappingURL=routes.js.map