"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./auth/routes");
const routes_2 = require("./url/routes");
const routes_3 = require("./shortener/routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        // Define main routes
        router.use('/api/v1/auth', routes_1.AuthRoutes.routes);
        router.use('/api/v1/url', routes_2.UrlRoutes.routes);
        router.use('', routes_3.ShortenerRoutes.routes);
        return router;
    }
}
exports.AppRoutes = AppRoutes;
//# sourceMappingURL=routes.js.map