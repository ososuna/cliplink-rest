export class CreateUrlDto {

  private constructor(public name: string, public originalUrl: string, public userId: string) {}

  static create(object: {[key: string]: any}): [string?, CreateUrlDto?] {
    const { name, originalUrl, userId } = object;
    if ( !originalUrl ) return ['missing original url', undefined];
    if ( !userId ) return ['missing user id', undefined];
    return [undefined, new CreateUrlDto(name, originalUrl, userId)];
  }

}