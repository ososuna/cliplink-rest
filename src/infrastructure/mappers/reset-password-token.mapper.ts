import { CustomError, ResetPasswordToken } from '@/domain';
import { Messages } from '@/config';

export class ResetPasswordTokenMapper {
  static resetPasswordTokenEntityFromObject(object: { [key: string]: any }): ResetPasswordToken {
    const { id, _id, token, expiresAt, user } = object;

    if (!(_id || id)) throw CustomError.badRequest(Messages.REQUIRED_FIELD('ID'));
    if (!token) throw CustomError.badRequest(Messages.REQUIRED_FIELD('token'));
    if (!expiresAt) throw CustomError.badRequest(Messages.REQUIRED_FIELD('expires at'));

    return new ResetPasswordToken(_id || id, token, expiresAt, user);
  }
}
