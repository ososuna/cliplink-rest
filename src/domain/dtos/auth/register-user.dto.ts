import { Validators } from '@/config';

export class RegisterUserDto {
  private constructor(
    public name: string,
    public lastName: string,
    public email: string,
    public password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, lastName, email, password } = object;

    if (!name) return ['missing name'];
    if (!lastName) return ['missing last name'];
    if (!email) return ['missing email'];
    if (!Validators.email.test(email)) return ['email is not valid'];
    if (!password) return ['missing password'];
    if (password.length < 6) return ['password too short'];

    return [undefined, new RegisterUserDto(name, lastName, email, password)];
  }
}
