import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Request, Response } from 'express';
import { CreateUrl } from '@/domain';
import { UrlDataSourceImpl } from '@/infrastructure';
import { UrlController } from '@/presentation/url/controller';
import { AuthDataSourceMocks, createMockRequest, createMockResponse, UrlDataSourceMocks } from '@test/test-utils';

describe('url controller', () => {
  let urlController: UrlController;

  beforeAll(() => {
    const shortIdGenerator = vi.fn(() => 'shortId');
    urlController = new UrlController(new UrlDataSourceImpl(shortIdGenerator));
  });

  describe('create url', () => {
    it('should create url no auth user', async () => {
      const mockUrl = UrlDataSourceMocks.url;
      vi.spyOn(CreateUrl.prototype, 'execute').mockResolvedValue(mockUrl);
      const req = createMockRequest({
        method: 'POST',
        url: '/url',
        body: {
          name: 'test',
          originalUrl: 'https://test.com',
        },
      });
      const res = createMockResponse();
      urlController.createUrl(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUrl);
    });

    it('should create url with auth user', async () => {
      const mockUrl = UrlDataSourceMocks.url;
      const mockUser = AuthDataSourceMocks.user;
      vi.spyOn(CreateUrl.prototype, 'execute').mockResolvedValue(mockUrl);
      const req = createMockRequest({
        method: 'POST',
        url: '/url',
        body: {
          name: 'test',
          originalUrl: 'https://test.com',
          user: mockUser,
        },
      });
      const res = createMockResponse();
      urlController.createUrl(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUrl);
    });

    it('should return 400 if name is not provided', async () => {
      const req = createMockRequest({
        method: 'POST',
        url: '/url',
      });
      const res = createMockResponse();
      urlController.createUrl(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 500 if error occurs', async () => {
      vi.spyOn(CreateUrl.prototype, 'execute').mockRejectedValue(new Error('error'));
      const req = createMockRequest({
        method: 'POST',
        url: '/url',
        body: {
          name: 'test',
          originalUrl: 'https://test.com',
        },
      });
      const res = createMockResponse();
      urlController.createUrl(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
