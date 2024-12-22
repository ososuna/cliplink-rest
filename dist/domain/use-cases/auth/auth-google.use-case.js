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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGoogle = void 0;
const config_1 = require("../../../config");
const custom_error_1 = require("../../errors/custom.error");
class AuthGoogle {
    constructor(authRepository, signToken = config_1.JwtAdapter.generateToken) {
        this.authRepository = authRepository;
        this.signToken = signToken;
    }
    execute(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.authGoogle(code);
            const token = yield this.signToken({ id: user.id }, '2h');
            if (!token)
                throw custom_error_1.CustomError.internalServer('Error generating token');
            return {
                token,
                user: {
                    id: user.id,
                    googleId: user.googleId,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                }
            };
        });
    }
}
exports.AuthGoogle = AuthGoogle;
