import { CustomError, Url } from '@/domain';
import { Messages } from '@/config';

export class UrlMapper {
  static urlEntityFromObject(object: { [key: string]: any }): Url {
    const { id, _id, name, originalUrl, shortId, user } = object;

    if (!(_id || id)) throw CustomError.badRequest(Messages.REQUIRED_FIELD('ID'));
    if (!originalUrl) throw CustomError.badRequest(Messages.REQUIRED_FIELD('original URL'));
    if (!shortId) throw CustomError.badRequest(Messages.REQUIRED_FIELD('short ID'));

    return new Url(_id || id, shortId, originalUrl, user, name);
  }
}
