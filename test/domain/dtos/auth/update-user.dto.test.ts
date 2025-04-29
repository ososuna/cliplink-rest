import { describe, expect, it } from 'vitest';
import { UpdateUserDto } from '@/domain';

describe('UpdateUserDto', () => {
  it('should create a new instance of UpdateUserDto', () => {
    const [error, updateUserDto] = UpdateUserDto.create({
      name: 'John',
      lastName: 'Doe',
    });
    expect(error).toBeUndefined();
    expect(updateUserDto).toBeInstanceOf(UpdateUserDto);
  });
});
