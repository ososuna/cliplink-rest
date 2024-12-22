"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGoogleMapper = void 0;
const domain_1 = require("../../domain");
class UserGoogleMapper {
    static userEntityFromObject(object) {
        const { id, _id, name, lastName, email, roles, googleId } = object;
        if (!_id || !id)
            throw domain_1.CustomError.badRequest('missing id');
        if (!name)
            throw domain_1.CustomError.badRequest('missing name');
        if (!name)
            throw domain_1.CustomError.badRequest('Missing last name');
        if (!roles)
            throw domain_1.CustomError.badRequest('missing roles');
        if (!googleId)
            throw domain_1.CustomError.badRequest('Missing GitHub ID');
        return new domain_1.User(_id || id, name, lastName, email, roles, undefined, undefined, googleId);
    }
}
exports.UserGoogleMapper = UserGoogleMapper;
//# sourceMappingURL=user-google.mapper.js.map