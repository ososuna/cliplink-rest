import { CustomError, User } from '@/domain';
import { Messages } from '@/config';

export class UserGoogleMapper {
  static userEntityFromObject(object: { [key: string]: any }) {
    const { id, _id, name, lastName, email, role, googleId } = object;

    if (!(_id || id)) throw CustomError.badRequest(Messages.REQUIRED_FIELD('ID'));
    if (!name) throw CustomError.badRequest(Messages.REQUIRED_FIELD('name'));
    if (!lastName) throw CustomError.badRequest(Messages.REQUIRED_FIELD('last name'));
    if (!role) throw CustomError.badRequest(Messages.REQUIRED_FIELD('role'));
    if (!googleId) throw CustomError.badRequest(Messages.REQUIRED_FIELD('Google ID'));

    return new User(_id || id, name, lastName, email, role, undefined, undefined, undefined, googleId);
  }
}
