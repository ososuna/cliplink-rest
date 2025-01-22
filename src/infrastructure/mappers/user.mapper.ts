import { CustomError, User } from '../../domain';
import { Messages } from '../../config';

export class UserMapper {

  static userEntityFromObject(object: {[key: string]: any}) {

    const { id, _id, name, lastName, email, password, roles } = object;

    if (!(_id || id)) throw CustomError.badRequest(Messages.REQUIRED_FIELD('ID'));
    if ( !name ) throw CustomError.badRequest(Messages.REQUIRED_FIELD('name'));
    if ( !lastName ) throw CustomError.badRequest(Messages.REQUIRED_FIELD('last name'));
    if ( !roles ) throw CustomError.badRequest(Messages.REQUIRED_FIELD('roles'));

    return new User(_id || id, name, lastName, email, roles, password);
  }
}