"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordTokenMapper = void 0;
const domain_1 = require("../../domain");
class ResetPasswordTokenMapper {
    static resetPasswordTokenEntityFromObject(object) {
        const { id, _id, token, expiresAt, user } = object;
        if (!_id || !id)
            throw domain_1.CustomError.badRequest('missing id');
        if (!token)
            throw domain_1.CustomError.badRequest('missing token');
        if (!expiresAt)
            throw domain_1.CustomError.badRequest('missing expiresAt');
        return new domain_1.ResetPasswordToken(_id || id, token, expiresAt, user);
    }
}
exports.ResetPasswordTokenMapper = ResetPasswordTokenMapper;
