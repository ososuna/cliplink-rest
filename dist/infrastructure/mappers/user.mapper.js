import { CustomError, User } from '../../domain';
export class UserMapper {
    static userEntityFromObject(object) {
        const { id, _id, name, lastName, email, password, roles } = object;
        if (!_id || !id)
            throw CustomError.badRequest('missing id');
        if (!name)
            throw CustomError.badRequest('missing name');
        if (!name)
            throw CustomError.badRequest('Missing last name');
        if (!roles)
            throw CustomError.badRequest('missing roles');
        return new User(_id || id, name, lastName, email, roles, password);
    }
}
//# sourceMappingURL=user.mapper.js.map