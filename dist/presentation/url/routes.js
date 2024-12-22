import { Router } from 'express';
import { UrlController } from './controller';
import { UrlDataSourceImpl, UrlRepositoryImpl } from '../../infrastructure';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CreateUrlMiddleware } from '../middlewares/create-url.middleware';
export class UrlRoutes {
    static get routes() {
        const router = Router();
        const dataSource = new UrlDataSourceImpl();
        const urlRepository = new UrlRepositoryImpl(dataSource);
        const controller = new UrlController(urlRepository);
        // Define main routes
        router.post('/', CreateUrlMiddleware.validateJWT, controller.createUrl);
        router.get('/', AuthMiddleware.validateJWT, controller.getUrls);
        router.get('/:id', AuthMiddleware.validateJWT, controller.getUrl);
        router.delete('/:id', AuthMiddleware.validateJWT, controller.deleteUrl);
        router.put('/:id', AuthMiddleware.validateJWT, controller.updateUrl);
        return router;
    }
}
//# sourceMappingURL=routes.js.map