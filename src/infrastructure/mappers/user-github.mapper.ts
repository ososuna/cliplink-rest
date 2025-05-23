/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomError, User } from '@/domain';
import { Messages } from '@/config';

export class UserGithubMapper {
  static userEntityFromObject(object: { [key: string]: any }): User {
    const { id, _id, name, lastName, email, role, githubId } = object;

    if (!(_id || id)) throw CustomError.badRequest(Messages.REQUIRED_FIELD('ID'));
    if (!name) throw CustomError.badRequest(Messages.REQUIRED_FIELD('name'));
    if (!lastName) throw CustomError.badRequest(Messages.REQUIRED_FIELD('last name'));
    if (!role) throw CustomError.badRequest(Messages.REQUIRED_FIELD('role'));
    if (!githubId) throw CustomError.badRequest(Messages.REQUIRED_FIELD('Github ID'));

    return new User(_id || id, name, lastName, email, role, undefined, undefined, githubId);
  }
}
