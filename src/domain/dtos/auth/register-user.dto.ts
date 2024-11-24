import { Validators } from './../../../config';

export class RegisterUserDto {

  private constructor(public name: string, public email: string, public password: string) {}

  static create(object: {[key: string]: any}): [string?, RegisterUserDto?] {
    const { name, email, password } = object;
    
    if ( !name ) return ['missing name', undefined];
    if ( !email ) return ['missing email', undefined];
    if ( !Validators.email.test(email) ) return ['email is not valid']
    if ( !password ) return ['missing password', undefined];
    if ( password.length < 6 ) return ['password too short', undefined];
    
    return [
      undefined,
      new RegisterUserDto(name, email, password)
    ];
  }
}