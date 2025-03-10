import { describe, expect, it } from 'vitest';
import { UpdateUserDto } from '../../../../src/domain/dtos/auth/update-user.dto';

describe('UpdateUserDto', () => {

  it('should create a new instance of UpdateUserDto', () => {
    const [error, updateUserDto] = UpdateUserDto.create({
      name: 'John',
      lastName: 'Doe'
    });
    expect(error).toBeUndefined();
    expect(updateUserDto).toBeInstanceOf(UpdateUserDto);
  });

});