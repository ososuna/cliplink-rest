"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const config_1 = require("../../config");
const mongodb_1 = require("../../data/mongodb");
class AuthMiddleware {
}
exports.AuthMiddleware = AuthMiddleware;
_a = AuthMiddleware;
AuthMiddleware.validateJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.access_token;
    try {
        const payload = yield config_1.JwtAdapter.validateToken(token);
        if (!payload) {
            res.status(401).json({ error: 'invalid token' });
            return;
        }
        const user = yield mongodb_1.UserModel.findById(payload.id);
        if (!user) {
            res.status(401).json({ error: 'invalid token - user not found' });
            return;
        }
        req.body.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server error' });
    }
});
//# sourceMappingURL=auth.middleware.js.map