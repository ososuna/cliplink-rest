
import { describe, expect, it } from 'vitest';
import { UpdateUrlDto } from '../../../../src/domain/dtos/url/update-url.dto';

describe('UpdateUrlDto', () => {

  it('should create a new instance of UpdateUrlDto', () => {
    const [error, updateUrlDto] = UpdateUrlDto.create({
      name: 'name',
      originalUrl: 'originalUrl'
    });
    expect(error).toBeUndefined();
    expect(updateUrlDto).toBeInstanceOf(UpdateUrlDto);
  });

});