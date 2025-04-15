export class UpdateUrlDto {
  private constructor(
    public name: string,
    public originalUrl: string,
  ) {}

  static create(object: { [key: string]: string }): [string?, UpdateUrlDto?] {
    const { name, originalUrl } = object;
    return [undefined, new UpdateUrlDto(name, originalUrl)];
  }
}
