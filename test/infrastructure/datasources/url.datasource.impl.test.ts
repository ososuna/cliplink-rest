import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { UrlDataSourceMocks } from '../../test-utils/infrastructure/datasources/url.datasource.mocks';
import { UrlDataSourceImpl } from '../../../src/infrastructure';
import { UrlModel } from '../../../src/data/mongodb';
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

  describe('get url', () => {
    it('should return url', async () => {
      const url = await urlDataSource.getUrl('urlId');
      expect(url).toEqual(UrlDataSourceMocks.url);
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

    it('should throw not found error', async () => {
      asMock(UrlModel.findById).mockResolvedValue(null);
      await expect(urlDataSource.getUrl('urlId')).rejects.toThrow(Messages.URL_NOT_FOUND);
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

    it('should throw internal server error', async () => {
      asMock(UrlModel.findById).mockRejectedValue(new Error('error'));
      await expect(urlDataSource.getUrl('urlId')).rejects.toThrow(Messages.INTERNAL_SERVER_ERROR);
      expect(UrlModel.findById).toHaveBeenCalledTimes(1);
      expect(UrlModel.findById).toHaveBeenCalledWith('urlId');
    });

  });

});