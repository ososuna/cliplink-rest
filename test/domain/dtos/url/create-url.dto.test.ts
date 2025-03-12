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

  it('should return an error when originalUrl is missing', () => {
    const [error, createUrlDto] = CreateUrlDto.create({
      name: 'name',
      userId: 'userId'
    });
    expect(error).toBe('missing original url');
    expect(createUrlDto).toBeUndefined();
  });

});