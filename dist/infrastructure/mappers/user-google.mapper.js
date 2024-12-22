import { CustomError, User } from '../../domain';
export class UserGoogleMapper {
    static userEntityFromObject(object) {
        const { id, _id, name, lastName, email, roles, googleId } = object;
        if (!_id || !id)
            throw CustomError.badRequest('missing id');
        if (!name)
            throw CustomError.badRequest('missing name');
        if (!name)
            throw CustomError.badRequest('Missing last name');
        if (!roles)
            throw CustomError.badRequest('missing roles');
        if (!googleId)
            throw CustomError.badRequest('Missing GitHub ID');
        return new User(_id || id, name, lastName, email, roles, undefined, undefined, googleId);
    }
}
//# sourceMappingURL=user-google.mapper.js.map