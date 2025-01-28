import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { UrlDataSourceMocks } from '../../test-utils/infrastructure/datasources/url.datasource.mocks';
import { UrlDataSourceImpl } from '../../../src/infrastructure';
import { UrlModel } from '../../../src/data/mongodb';

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
  });

});