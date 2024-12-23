"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const domain_1 = require("../../domain");
class UserMapper {
    static userEntityFromObject(object) {
        const { id, _id, name, lastName, email, password, roles } = object;
        if (!_id || !id)
            throw domain_1.CustomError.badRequest('missing id');
        if (!name)
            throw domain_1.CustomError.badRequest('missing name');
        if (!name)
            throw domain_1.CustomError.badRequest('Missing last name');
        if (!roles)
            throw domain_1.CustomError.badRequest('missing roles');
        return new domain_1.User(_id || id, name, lastName, email, roles, password);
    }
}
exports.UserMapper = UserMapper;
