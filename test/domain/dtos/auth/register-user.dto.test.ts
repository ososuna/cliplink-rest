import { describe, expect, it } from 'vitest';
import { RegisterUserDto } from '../../../../src/domain/dtos/auth/register-user.dto';

describe('RegisterUserDto', () => {

  it('should create a new instance of RegisterUserDto', () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: '12345678'
    });
    expect(error).toBeUndefined();
    expect(registerUserDto).toBeInstanceOf(RegisterUserDto);
  });

  it('should return an error if name is not provided', () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: '',
      lastName: 'Doe',
      email: 'john@test.com',
      password: '12345678'
    });
    expect(error).toBeDefined();
    expect(error).toEqual('missing name');
    expect(registerUserDto).toBeUndefined();
  });

  it('should return an error if last name is not provided', () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'John',
      lastName: '',
      email: 'john@test.com',
      password: '12345678'
    });
    expect(error).toBeDefined();
    expect(error).toEqual('missing last name');
    expect(registerUserDto).toBeUndefined();
  });

  it('should return an error if email is not provided', () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'John',
      lastName: 'Doe',
      email: '',
      password: '12345678'
    });
    expect(error).toBeDefined();
    expect(error).toEqual('missing email');
    expect(registerUserDto).toBeUndefined();
  });

  it('should return an error if email is not valid', () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'John',
      lastName: 'Doe',
      email: 'john',
      password: '12345678'
    });
    expect(error).toBeDefined();
    expect(error).toEqual('email is not valid');
    expect(registerUserDto).toBeUndefined();
  });

  it('should return an error if password is not provided', () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: ''
    });
    expect(error).toBeDefined();
    expect(error).toEqual('missing password');
    expect(registerUserDto).toBeUndefined();
  });

  it('should return an error if password is too short', () => {
    const [error, registerUserDto] = RegisterUserDto.create({
      name: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: '123'
    });
    expect(error).toBeDefined();
    expect(error).toEqual('password too short');
    expect(registerUserDto).toBeUndefined();
  });

});