import { CustomError, User } from '../../domain';

export class UserMapper {

  static userEntityFromObject(object: {[key: string]: any}) {

    const { id, _id, name, email, password, roles } = object;

    if ( !_id || !id ) throw CustomError.badRequest('missing id');
    if ( !name ) throw CustomError.badRequest('missing name');
    if ( !password ) throw CustomError.badRequest('missing password');
    if ( !roles ) throw CustomError.badRequest('missing roles');

    return new User(_id || id, name, email, password, roles);
  }
}