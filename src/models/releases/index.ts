import * as vkApi from 'vk-io';
import {globalLogger} from 'core/logger';
import type {GetParams} from 'core/requester';
import {TtlCache} from 'core/cache';

import {ReleaseTypes, DecodedResponse} from './interface';
import {normalizeResponse} from './decoders';

export {releaseSegmentIdentifiers} from './helpers';
export * from './interface';

const VK_PROCEDURE_NAME = 'getLastFridays';
const VK_TOKEN = process.env.VK_TOKEN;
const CACHE_TTL = 1000 * 60 * 60;

if (!VK_TOKEN) {
  throw new Error(`VK_TOKEN is not defined in the env`);
}

const cache = new TtlCache();
const vk = new vkApi.VK({token: VK_TOKEN});

export async function getReleases(params: GetParams): Promise<Nullable<DecodedResponse>> {
  try {
    const cacheKey = `${VK_PROCEDURE_NAME}::${JSON.stringify(params)}`;
    const fromCache = cache.get(cacheKey);

    if (fromCache) {
      return fromCache;
    }

    const rawResponse: any = await vk.api.procedure(VK_PROCEDURE_NAME, params.query);
    const response = await normalizeResponse(rawResponse, params);

    cache.set(cacheKey, response, CACHE_TTL);
    return response;

  } catch (error) {
    globalLogger.error('ReleasesList: Error during VK API call', {
      error,
      procedureName: VK_PROCEDURE_NAME,
      query: params.query
    });

    return null;
  }
}

export async function getLatestsReleases(type: ReleaseTypes): Promise<Nullable<DecodedResponse>> {
  return getReleases({
    query: {
      count: 1,
      links: true,
      type
    }
  });
}
