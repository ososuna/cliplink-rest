import { describe, expect, it } from 'vitest';
import { CreateUrlDto } from '../../../../src/domain/dtos/url/create-url.dto';

describe('CreateUrlDto', () => {

  it('should create a new instance of CreateUrlDto', () => {
    const [error, createUrlDto] = CreateUrlDto.create({
      name: 'name',
      originalUrl: 'originalUrl',
      userId: 'userId'
    });
    expect(error).toBeUndefined();
    expect(createUrlDto).toBeInstanceOf(CreateUrlDto);
  });

});