import { Validators } from './../../../config';

export class LoginUserDto {

  private constructor(public email: string, public password: string) {}

  static create(object: {[key: string]: any}): [string?, LoginUserDto?] {
    const { email, password } = object;
    
    if ( !email ) return ['missing email', undefined];
    if ( !Validators.email.test(email) ) return ['email is not valid']
    if ( !password ) return ['missing password', undefined];
    if ( password.length < 6 ) return ['password too short', undefined];

    return [undefined, new LoginUserDto(email, password)];
  }

}