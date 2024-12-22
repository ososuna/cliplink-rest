import { CustomError, ResetPasswordToken } from '../../domain';
export class ResetPasswordTokenMapper {
    static resetPasswordTokenEntityFromObject(object) {
        const { id, _id, token, expiresAt, user } = object;
        if (!_id || !id)
            throw CustomError.badRequest('missing id');
        if (!token)
            throw CustomError.badRequest('missing token');
        if (!expiresAt)
            throw CustomError.badRequest('missing expiresAt');
        return new ResetPasswordToken(_id || id, token, expiresAt, user);
    }
}
//# sourceMappingURL=reset-password-token.mapper.js.map