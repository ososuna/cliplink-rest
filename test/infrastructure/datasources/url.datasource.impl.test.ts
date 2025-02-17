import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { UrlDataSourceMocks } from '../../test-utils/infrastructure/datasources/url.datasource.mocks';
import { UrlDataSourceImpl } from '../../../src/infrastructure';
import { UrlModel, UserModel } from '../../../src/data/mongodb';
import { Messages } from '../../../src/config';
import { asMock } from '../../test-utils/test-utils';
import type { UrlDataSource } from '../../../src/domain';

UrlDataSourceMocks.setupMocks();

describe('UrlDataSourceImpl', () => {

  let urlDataSource: UrlDataSource;

  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlDataSource = new UrlDataSourceImpl(shortIdGenerator);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create url', () => {

    beforeAll(() => {
      asMock(UrlModel.findOne).mockResolvedValue(null);
    });

    it('should create url', async () => {
      const url = await urlDataSource.create(UrlDataSourceMocks.createUrlDto);
      expect(url).toEqual({
        id: 'urlId',
        shortId: 'shortId',
        originalUrl: 'originalUrl',
        user: 'userId',
        name: 'name'
      });
      expect(UrlModel.create).toHaveBeenCalledTimes(1);
      expect(UrlModel.create).toHaveBeenCalledWith({
        name: 'name',
        originalUrl: 'originalUrl',
        shortId: 'shortId',
        user: 'userId',
      });
    });

    it('should create url with unique name', async () => {
      asMock(UrlModel.findOne).mockImplementationOnce(async ({name, user, active}) => {
        if (name === 'name') {
          return Promise.resolve({
            _id: 'urlId2',
            id: 'urlId2',
            originalUrl: 'originalUrl',
            shortId: 'shortId',
            name: 'name (2)',
          });
        }
        return Promise.resolve(null);
      });
      const url = await urlDataSource.create(UrlDataSourceMocks.createUrlDto);
      expect(url).toEqual({
        id: 'urlId',
        shortId: 'shortId',
        originalUrl: 'originalUrl',
        user: 'userId',
        name: 'name'
      });
      expect(UrlModel.create).toHaveBeenCalledTimes(1);
      expect(UrlModel.create).toHaveBeenCalledWith({
        name: 'name (2)',
        originalUrl: 'originalUrl',
        shortId: 'shortId',
        user: 'userId',
      });
    });
    
    it('should throw user not found error', async () => {
      asMock(UserModel.findById).mockResolvedValueOnce(null);
      await expect(urlDataSource.create(UrlDataSourceMocks.createUrlDto)).rejects.toThrow(Messages.USER_NOT_FOUND);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });
  
    it('should throw internal server error', async () => {
      asMock(UserModel.findById).mockRejectedValueOnce(new Error('error'));
      await expect(urlDataSource.create(UrlDataSourceMocks.createUrlDto)).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });
  });

  describe('get urls', () => {
    it('should return urls', async () => {
      const urlsPage = await urlDataSource.getUrls('userId', 1, 9, '');
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
      expect(UrlModel.find).toHaveBeenCalledTimes(1);
      expect(urlsPage.items).toEqual(UrlDataSourceMocks.urls);
      expect(urlsPage.total).toBe(3);
      expect(urlsPage.limit).toBe(9);
      expect(urlsPage.page).toBe(1);
    });

    it('should search urls', async () => {
      const urlsPage = await urlDataSource.getUrls('userId', 1, 9, 'search');
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
      expect(UrlModel.find).toHaveBeenCalledTimes(1);
      expect(urlsPage.items).toEqual(UrlDataSourceMocks.urls);
      expect(urlsPage.total).toBe(3);
      expect(urlsPage.limit).toBe(9);
      expect(urlsPage.page).toBe(1);
    });

    it('should throw user not found error', async () => {
      asMock(UserModel.findById).mockResolvedValueOnce(null);
      await expect(urlDataSource.getUrls('userId', 1, 9, '')).rejects.toThrow(Messages.USER_NOT_FOUND);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });

    it('should throw internal server error', async () => {
      asMock(UserModel.findById).mockRejectedValueOnce(new Error('error'));
      await expect(urlDataSource.getUrls('userId', 1, 9, '')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
      expect(UserModel.findById).toHaveBeenCalledTimes(1);
      expect(UserModel.findById).toHaveBeenCalledWith('userId');
    });
  });

  describe('delete url', () => {
    it('should delete url', async () => {
      await urlDataSource.delete('urlId');
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

    it('should throw not found error', async () => {
      asMock(UrlModel.findById).mockResolvedValueOnce(null);
      await expect(urlDataSource.delete('urlId')).rejects.toThrow(Messages.URL_NOT_FOUND);
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

    it('should throw internal server error', async () => {
      asMock(UrlModel.findById).mockRejectedValueOnce(new Error('error'));
      await expect(urlDataSource.delete('urlId')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

  });

  describe('get url', () => {
    it('should return url', async () => {
      const url = await urlDataSource.getUrl('urlId');
      expect(url).toEqual(UrlDataSourceMocks.url);
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

    it('should throw not found error', async () => {
      asMock(UrlModel.findById).mockResolvedValueOnce(null);
      await expect(urlDataSource.getUrl('urlId')).rejects.toThrow(Messages.URL_NOT_FOUND);
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

    it('should throw internal server error', async () => {
      asMock(UrlModel.findById).mockRejectedValueOnce(new Error('error'));
      await expect(urlDataSource.getUrl('urlId')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

  });

  describe('update url', () => {

    beforeAll(() => {
      asMock(UrlModel.findOne).mockResolvedValue(null);
    });

    it('should update url', async () => {
      const url = await urlDataSource.update('urlId', 'userId', UrlDataSourceMocks.updateUrlDto);
      expect(url).toEqual({
        id: 'urlId',
        shortId: 'shortId',
        originalUrl: 'originalUrl',
        user: 'userId',
        name: 'newName'
      });
      expect(UrlModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(UrlModel.findByIdAndUpdate).toHaveBeenCalledWith('urlId', UrlDataSourceMocks.updateUrlDto, { new: true });
    });

    it('should throw not found error', async () => {
      asMock(UrlModel.findByIdAndUpdate).mockResolvedValueOnce(null);
      await expect(urlDataSource.update('urlId', 'userId', UrlDataSourceMocks.updateUrlDto)).rejects.toThrow(Messages.URL_NOT_FOUND);
      expect(UrlModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(UrlModel.findByIdAndUpdate).toHaveBeenCalledWith('urlId', UrlDataSourceMocks.updateUrlDto, { new: true });
    });

    it('should throw internal server error', async () => {
      asMock(UrlModel.findByIdAndUpdate).mockRejectedValueOnce(new Error('error'));
      await expect(urlDataSource.update('urlId', 'userId', UrlDataSourceMocks.updateUrlDto)).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
      expect(UrlModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(UrlModel.findByIdAndUpdate).toHaveBeenCalledWith('urlId', UrlDataSourceMocks.updateUrlDto, { new: true });
    });
  });

  describe('get url by short id', () => {

    beforeAll(() => {
      asMock(UrlModel.findOne).mockResolvedValue({
        _id: 'urlId',
        originalUrl: 'originalUrl',
        shortId: 'shortId',
        user: 'userId',
        name: 'name',
        save: vi.fn(),
        active: true
      });
    });

    it('should return url', async () => {
      const url = await urlDataSource.getUrlByShortId('shortId');
      expect(url).toEqual({
        id: 'urlId',
        name: 'name',
        originalUrl: 'originalUrl',
        shortId: 'shortId',
        user: 'userId',
      });
      expect(UrlModel.findOne).toHaveBeenCalledTimes(1);
      expect(UrlModel.findOne).toHaveBeenCalledWith({ shortId: 'shortId' });
    });

    it('should throw not found error', async () => {
      asMock(UrlModel.findOne).mockResolvedValueOnce(null);
      await expect(urlDataSource.getUrlByShortId('shortId')).rejects.toThrow(Messages.URL_NOT_FOUND);
      expect(UrlModel.findOne).toHaveBeenCalledTimes(1);
      expect(UrlModel.findOne).toHaveBeenCalledWith({ shortId: 'shortId' });
    });

    it('should throw internal server error', async () => {
      asMock(UrlModel.findOne).mockRejectedValueOnce(new Error('error'));
      await expect(urlDataSource.getUrlByShortId('shortId')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
      expect(UrlModel.findOne).toHaveBeenCalledTimes(1);
      expect(UrlModel.findOne).toHaveBeenCalledWith({ shortId: 'shortId' });
    });
  });

});