import { describe, expect, it } from 'vitest';
import { LoginUserDto } from '@/domain';

describe('LoginUserDto', () => {

  it('should create a new instance of LoginUserDto', () => {
    const [error, loginUserDto] = LoginUserDto.create({
      email: 'user@example.com',
      password: '12345678'
    });
    expect(error).toBeUndefined();
    expect(loginUserDto).toBeInstanceOf(LoginUserDto); 
  });

  it('should return an error if email is not provided', () => {
    const [error, loginUserDto] = LoginUserDto.create({
      email: '',
      password: '12345678'
    });
    expect(error).toEqual('missing email');
    expect(loginUserDto).toBeUndefined();
  });

  it('should return an error if email is invalid', () => {
    const [error, loginUserDto] = LoginUserDto.create({
      email: 'user',
      password: '12345678'
    });
    expect(error).toEqual('email is not valid');
    expect(loginUserDto).toBeUndefined();
  });

  it('should return an error if password is not provided', () => {
    const [error, loginUserDto] = LoginUserDto.create({
      email: 'user@example.com',
      password: ''
    });
    expect(error).toEqual('missing password');
    expect(loginUserDto).toBeUndefined();
  });
  
  it('should return an error if password is too short', () => {
    const [error, loginUserDto] = LoginUserDto.create({
      email: 'user@example.com',
      password: '12345'
    });
    expect(error).toEqual('password too short');
    expect(loginUserDto).toBeUndefined();
  });
});