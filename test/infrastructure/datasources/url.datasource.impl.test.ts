import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { UrlDataSourceMocks } from '../../test-utils/infrastructure/datasources/url.datasource.mocks';
import { UrlDataSourceImpl } from '../../../src/infrastructure';
import { UrlModel, UserModel } from '../../../src/data/mongodb';
import { Messages } from '../../../src/config';

UrlDataSourceMocks.setupMocks();

describe('UrlDataSourceImpl', () => {

  let urlDataSource: UrlDataSourceImpl;

  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    urlDataSource = new UrlDataSourceImpl(shortIdGenerator);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create url', () => {
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

});