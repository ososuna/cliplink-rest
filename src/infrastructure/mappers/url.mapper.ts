import { CustomError, Url } from '../../domain';

export class UrlMapper {

  static urlEntityFromObject(object: {[key: string]: any}) {

    const { id, _id, name, originalUrl, shortId } = object;

    if ( !_id || !id ) throw CustomError.badRequest('missing id');
    if ( !originalUrl ) throw CustomError.badRequest('missing original URL');
    if ( !shortId ) throw CustomError.badRequest('missing short id');

    return new Url(_id || id, name, originalUrl, shortId);
  }
}