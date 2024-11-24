
export class CreateUrlDto {

  private constructor(public name: string, public originalUrl: string) {}

  static create(object: {[key: string]: any}): [string?, CreateUrlDto?] {
    const { name, originalUrl } = object;
    if ( !originalUrl ) return ['missing original URL', undefined];
    return [undefined, new CreateUrlDto(name, originalUrl)];
  }

}