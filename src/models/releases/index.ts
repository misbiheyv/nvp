import * as vkApi from 'vk-io';
import {globalLogger} from 'core/logger';
import {TtlCache} from 'core/cache';

import {ReleaseTypes, NormalizedResponse, RequestParams, RawResponse, ResponseWithMeta} from './types';
import {getPictureURL, releaseSegmentPreview} from './helpers';

export {releaseSegmentIdentifiers} from './helpers';
export * from './types';

const VK_PROCEDURE_NAME = 'getLastFridays';
const VK_TOKEN = process.env.VK_TOKEN;
const CACHE_TTL = 1000 * 60 * 60;

if (!VK_TOKEN) {
  throw new Error(`VK_TOKEN is not defined in the env`);
}

const cache = new TtlCache();
const vk = new vkApi.VK({token: VK_TOKEN});

export async function getReleases(params: RequestParams): Promise<Nullable<NormalizedResponse>> {
  try {
    const cacheKey = `${VK_PROCEDURE_NAME}::${JSON.stringify(params)}`;
    const fromCache = cache.get(cacheKey);

    if (fromCache) {
      return fromCache;
    }

    const rawResponse: RawResponse = await vk.api.procedure(VK_PROCEDURE_NAME, params.query);
    const [postItem] = rawResponse.response.items;

    if (!postItem) {
      globalLogger.warn('getReleases: rawResponse is empty');
      return {};
    }

    const type: ReleaseTypes = params.query.type ?? ReleaseTypes.ALL;
    const picture = getPictureURL(type, rawResponse);
    const responseWithMeta = postItem.text.split('\n').reduce<ResponseWithMeta>((temp, rawLine) => {
      const line = rawLine.trim();

      if (line.length > 0) {
        if (!temp[type]) {
          temp[type] = {list: [], attachments: {picture}};
        }

        temp[type].list.push({title: line, type});
      }

      return temp;
    }, {});

    if (!Object.keys(responseWithMeta).length) {
      globalLogger.warn('getReleases: responseWithMeta is empty');
    }

    const normalizedResponse = Object.entries(responseWithMeta).reduce<NormalizedResponse>((acc, [type, record]) => {
      const releaseType = <ReleaseTypes>type;

      acc[releaseType] = {
        text: record.list.reduce((text, line) => text?.concat(`${line.title}\n`), releaseSegmentPreview.get(releaseType) ?? ''),

        attachments: record.attachments,
      };

      return acc;
    }, {});

    if (Object.keys(normalizedResponse).length) {
      cache.set(cacheKey, normalizedResponse, CACHE_TTL);
    } else {
      globalLogger.warn('getReleases: normalizedResponse is empty');
    }

    return normalizedResponse;
  } catch (error) {
    globalLogger.error('getReleases: Unknown Error', {
      error,
      procedureName: VK_PROCEDURE_NAME,
      query: params.query,
    });

    return null;
  }
}

export async function getLatestsReleases(type: ReleaseTypes): Promise<Nullable<NormalizedResponse>> {
  return getReleases({
    query: {
      count: 1,
      links: true,
      type,
    },
  });
}
