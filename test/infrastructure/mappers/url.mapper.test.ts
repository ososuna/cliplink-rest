import { describe, it, expect } from 'vitest';
import { CustomError, Url } from '@/domain';
import { UrlMapper } from '@/infrastructure';
import { Messages } from '@/config';

describe('UrlMapper', () => {
  describe('urlEntityFromObject', () => {
    it('should create a Url instance from a valid object', () => {
      const urlData = {
        id: '12345678-90ab-cdef-1234-567890abcdef',
        name: 'Test URL',
        originalUrl: 'https://example.com',
        shortId: 'exmpl',
        user: 'user-123'
      };
      
      const url = UrlMapper.urlEntityFromObject(urlData);
      
      expect(url).toBeInstanceOf(Url);
      expect(url.id).toBe(urlData.id);
      expect(url.name).toBe(urlData.name);
      expect(url.originalUrl).toBe(urlData.originalUrl);
      expect(url.shortId).toBe(urlData.shortId);
      expect(url.user).toBe(urlData.user);
    });

    it('should throw an error if ID is missing', () => {
      const urlData = {
        name: 'Test URL',
        originalUrl: 'https://example.com',
        shortId: 'exmpl',
        user: 'user-123'
      };

      expect(() => UrlMapper.urlEntityFromObject(urlData)).toThrow(CustomError);
      expect(() => UrlMapper.urlEntityFromObject(urlData)).toThrow(Messages.REQUIRED_FIELD('ID'));
    });

    it('should throw an error if originalUrl is missing', () => {
      const urlData = {
        id: 'abcdef12-3456-7890-abcd-ef1234567890',
        name: 'Test URL',
        shortId: 'exmpl',
        user: 'user-123'
      };

      expect(() => UrlMapper.urlEntityFromObject(urlData)).toThrow(CustomError);
      expect(() => UrlMapper.urlEntityFromObject(urlData)).toThrow(Messages.REQUIRED_FIELD('original URL'));
    });

    it('should throw an error if shortId is missing', () => {
      const urlData = {
        id: 'fedcba98-7654-3210-abcdefabcdef',
        name: 'Test URL',
        originalUrl: 'https://example.com',
        user: 'user-123'
      };

      expect(() => UrlMapper.urlEntityFromObject(urlData)).toThrow(CustomError);
      expect(() => UrlMapper.urlEntityFromObject(urlData)).toThrow(Messages.REQUIRED_FIELD('short ID'));
    });
  });
});
