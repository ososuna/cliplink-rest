"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const infrastructure_1 = require("../../infrastructure");
const auth_middleware_1 = require("../middlewares/auth.middleware");
class AuthRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const dataSource = new infrastructure_1.AuthDataSourceImpl();
        const authRepository = new infrastructure_1.AuthRepositoryImpl(dataSource);
        const controller = new controller_1.AuthController(authRepository);
        // Define main routes
        router.post('/login', controller.loginUser);
        router.get('/github', controller.loginGithub);
        router.get('/github/callback', controller.loginGithubCallback);
        router.get('/google', controller.loginGoogle);
        router.get('/google/callback', controller.loginGoogleCallback);
        router.get('/token', auth_middleware_1.AuthMiddleware.validateJWT, controller.checkToken);
        router.get('/logout', controller.logout);
        router.post('/register', controller.registerUser);
        router.get('/', auth_middleware_1.AuthMiddleware.validateJWT, controller.getUsers);
        router.get('/:id', auth_middleware_1.AuthMiddleware.validateJWT, controller.getUser);
        router.put('/', auth_middleware_1.AuthMiddleware.validateJWT, controller.updateUser);
        router.delete('/', auth_middleware_1.AuthMiddleware.validateJWT, controller.deleteAccount);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
