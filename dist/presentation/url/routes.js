"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const infrastructure_1 = require("../../infrastructure");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const create_url_middleware_1 = require("../middlewares/create-url.middleware");
class UrlRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const dataSource = new infrastructure_1.UrlDataSourceImpl();
        const urlRepository = new infrastructure_1.UrlRepositoryImpl(dataSource);
        const controller = new controller_1.UrlController(urlRepository);
        // Define main routes
        router.post('/', create_url_middleware_1.CreateUrlMiddleware.validateJWT, controller.createUrl);
        router.get('/', auth_middleware_1.AuthMiddleware.validateJWT, controller.getUrls);
        router.get('/:id', auth_middleware_1.AuthMiddleware.validateJWT, controller.getUrl);
        router.delete('/:id', auth_middleware_1.AuthMiddleware.validateJWT, controller.deleteUrl);
        router.put('/:id', auth_middleware_1.AuthMiddleware.validateJWT, controller.updateUrl);
        return router;
    }
}
exports.UrlRoutes = UrlRoutes;
