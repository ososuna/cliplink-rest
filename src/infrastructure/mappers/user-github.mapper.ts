import { Messages } from '../../config';
import { CustomError, User } from '../../domain';

export class UserGithubMapper {

  static userEntityFromObject(object: {[key: string]: any}) {

    const { id, _id, name, lastName, email, roles, githubId } = object;

    if ( !_id || !id ) throw CustomError.badRequest(Messages.REQUIRED_FIELD('ID'));
    if ( !name ) throw CustomError.badRequest(Messages.REQUIRED_FIELD('name'));
    if ( !name ) throw CustomError.badRequest(Messages.REQUIRED_FIELD('last name'));
    if ( !roles ) throw CustomError.badRequest(Messages.REQUIRED_FIELD('roles'));
    if ( !githubId ) throw CustomError.badRequest(Messages.REQUIRED_FIELD('Github ID'));

    return new User(_id || id, name, lastName, email, roles, undefined, undefined, githubId);
  }
}