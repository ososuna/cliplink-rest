export class UpdateUserDto {

  private constructor(public name: string, public lastName: string, public email: string) {}

  static create(object: {[key: string]: any}): [string?, UpdateUserDto?] {
    const { name, lastName, email } = object;    
    return [
      undefined,
      new UpdateUserDto(name, lastName, email)
    ];
  }
}