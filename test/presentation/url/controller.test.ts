import { beforeAll, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { Request, Response } from 'express';
import { CreateUrl, CustomError, DeleteUrl, GetUrl, GetUrls, UpdateUrl } from '@/domain';
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
    let createUrlSpy: MockInstance;

    beforeEach(() => {
      createUrlSpy?.mockRestore();
    });

    it('should create url no auth user', async () => {
      const mockUrl = UrlDataSourceMocks.url;
      createUrlSpy = vi.spyOn(CreateUrl.prototype, 'execute').mockResolvedValue(mockUrl);
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

      expect(createUrlSpy).toHaveBeenCalledWith({
        name: 'test',
        originalUrl: 'https://test.com',
      });

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUrl);
    });

    it('should create url with auth user', async () => {
      const mockUrl = UrlDataSourceMocks.url;
      const mockUser = AuthDataSourceMocks.user;
      createUrlSpy = vi.spyOn(CreateUrl.prototype, 'execute').mockResolvedValue(mockUrl);
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

      expect(createUrlSpy).toHaveBeenCalledWith({
        name: 'test',
        originalUrl: 'https://test.com',
        userId: mockUser.id,
      });

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
      createUrlSpy = vi.spyOn(CreateUrl.prototype, 'execute').mockRejectedValue(new Error('error'));
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

      expect(createUrlSpy).toHaveBeenCalledWith({
        name: 'test',
        originalUrl: 'https://test.com',
      });

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('get urls', () => {
    let getUrlsSpy: MockInstance;

    beforeEach(() => {
      getUrlsSpy?.mockRestore();
    });

    it('should get urls', async () => {
      const mockUrls = UrlDataSourceMocks.urls;
      const mockUser = AuthDataSourceMocks.user;
      const mockPage = {
        page: 1,
        limit: 10,
        total: 10,
        totalPages: 1,
        items: mockUrls,
      };
      getUrlsSpy = vi.spyOn(GetUrls.prototype, 'execute').mockResolvedValue(mockPage);
      const req = createMockRequest({
        method: 'GET',
        url: '/url',
        body: {
          user: mockUser,
        },
      });
      const res = createMockResponse();
      urlController.getUrls(req as Request, res as Response);

      expect(getUrlsSpy).toHaveBeenCalledWith(mockUser.id, 1, 10, '');

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockPage);
    });

    it('should return 500 if error occurs', async () => {
      const mockUser = AuthDataSourceMocks.user;
      getUrlsSpy = vi.spyOn(GetUrls.prototype, 'execute').mockRejectedValue(CustomError.internalServer('error'));
      const req = createMockRequest({
        method: 'GET',
        url: '/url',
        body: {
          user: mockUser,
        },
      });
      const res = createMockResponse();
      urlController.getUrls(req as Request, res as Response);

      await new Promise(process.nextTick);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('delete url', () => {
    let deleteUrlSpy: MockInstance;

    beforeEach(() => {
      deleteUrlSpy?.mockRestore();
    });

    it('should delete url', async () => {
      const mockUrl = UrlDataSourceMocks.url;
      deleteUrlSpy = vi.spyOn(DeleteUrl.prototype, 'execute').mockResolvedValue(mockUrl);
      const req = createMockRequest({
        method: 'DELETE',
        url: '/url',
        params: {
          id: mockUrl.id,
        },
      });
      const res = createMockResponse();
      urlController.deleteUrl(req as Request, res as Response);

      expect(deleteUrlSpy).toHaveBeenCalledWith(mockUrl.id);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe('get url', () => {
    let getUrlSpy: MockInstance;

    beforeEach(() => {
      getUrlSpy?.mockRestore();
    });

    it('should get url', async () => {
      const mockUrl = UrlDataSourceMocks.url;
      getUrlSpy = vi.spyOn(GetUrl.prototype, 'execute').mockResolvedValue(mockUrl);
      const req = createMockRequest({
        method: 'GET',
        url: '/url',
        params: {
          id: mockUrl.id,
        },
      });
      const res = createMockResponse();
      urlController.getUrl(req as Request, res as Response);

      expect(getUrlSpy).toHaveBeenCalledWith(mockUrl.id);

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe('update url', () => {
    let updateUrlSpy: MockInstance;

    beforeEach(() => {
      updateUrlSpy?.mockRestore();
    });

    it('should update url', async () => {
      const mockUrl = UrlDataSourceMocks.url;
      const mockUser = AuthDataSourceMocks.user;
      updateUrlSpy = vi.spyOn(UpdateUrl.prototype, 'execute').mockResolvedValue(mockUrl);
      const req = createMockRequest({
        method: 'PUT',
        url: '/url',
        params: {
          id: mockUrl.id,
        },
        body: {
          name: 'test',
          originalUrl: 'https://test.com',
          user: mockUser,
        },
      });
      const res = createMockResponse();
      urlController.updateUrl(req as Request, res as Response);

      expect(updateUrlSpy).toHaveBeenCalledWith(mockUrl.id, mockUser.id, {
        name: 'test',
        originalUrl: 'https://test.com',
      });

      await new Promise(process.nextTick);

      expect(res.json).toHaveBeenCalledWith(mockUrl);
    });
  });
});
