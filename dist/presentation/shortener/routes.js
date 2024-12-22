"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortenerRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const infrastructure_1 = require("../../infrastructure");
class ShortenerRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const dataSource = new infrastructure_1.UrlDataSourceImpl();
        const urlRepository = new infrastructure_1.UrlRepositoryImpl(dataSource);
        const controller = new controller_1.ShortenerController(urlRepository);
        router.get('/:shortId', controller.shorten);
        return router;
    }
}
exports.ShortenerRoutes = ShortenerRoutes;
