import { CustomError, User } from '../../domain';

export class UserGithubMapper {

  static userEntityFromObject(object: {[key: string]: any}) {

    const { id, _id, name, lastName, email, roles, githubId } = object;

    if ( !_id || !id ) throw CustomError.badRequest('missing id');
    if ( !name ) throw CustomError.badRequest('missing name');
    if ( !name ) throw CustomError.badRequest('Missing last name');
    if ( !roles ) throw CustomError.badRequest('missing roles');
    if ( !githubId ) throw CustomError.badRequest('Missing GitHub ID');

    return new User(_id || id, name, lastName, email, roles, undefined, undefined, githubId);
  }
}