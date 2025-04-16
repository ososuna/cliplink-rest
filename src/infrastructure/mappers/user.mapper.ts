/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError, User } from '@/domain';
import { Messages } from '@/config';

export class UserMapper {
  static userEntityFromObject(object: { [key: string]: any }): User {
    const { id, _id, name, lastName, email, password, role } = object;

    if (!(_id || id)) throw CustomError.badRequest(Messages.REQUIRED_FIELD('ID'));
    if (!name) throw CustomError.badRequest(Messages.REQUIRED_FIELD('name'));
    if (!lastName) throw CustomError.badRequest(Messages.REQUIRED_FIELD('last name'));
    if (!role) throw CustomError.badRequest(Messages.REQUIRED_FIELD('role'));

    return new User(_id || id, name, lastName, email, role, password);
  }
}
