import {RawResponse, ReleaseTypes} from './types';

export const releaseSegmentIdentifiers = new Map([
  [ReleaseTypes.ALL, undefined],
  // [ReleaseTypes.RU_ALBUMS, 'СНГ альбомы'],
  // [ReleaseTypes.EN_ALBUMS, 'Иностранные альбомы'],
  // [ReleaseTypes.RU_SINGLES, 'СНГ треки'],
  // [ReleaseTypes.EN_SINGLES, 'Иностранные треки'],
]);

export const releaseSegmentPreview = new Map([
  [ReleaseTypes.ALL, undefined],
  // [ReleaseTypes.RU_ALBUMS, '\n🎧 СНГ альбомы:'],
  // [ReleaseTypes.EN_ALBUMS, '\n🎧 Иностранные альбомы:'],
  // [ReleaseTypes.RU_SINGLES, '\n🎙️ СНГ треки:'],
  // [ReleaseTypes.EN_SINGLES, '\n🎙️ Иностранные треки:'],
]);

/**
 * Возвращает картинку для переданного типа релиза
 * @param type
 */
export function getPictureURL(type: ReleaseTypes, response: RawResponse) {
  try {
    if (process.env.S3_BUCKET_URL) {
      return `${process.env.S3_BUCKET_URL}/segment-pics/${type}.jpg`;
    }

    return response.response.items[0].attachments
      .filter((attachment) => attachment.type === 'photo')[0]
      .photo?.sizes.find((size) => size.type === 'base')?.url;
  } catch {
    return undefined;
  }
}
