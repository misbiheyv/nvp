import { ReleaseTypes } from 'models/releases/interface';

export const releaseSegmentIdentifiers = new Map([
	[ReleaseTypes.ALL, undefined],
	[ReleaseTypes.RU_ALBUMS, 'СНГ альбомы'],
	[ReleaseTypes.EN_ALBUMS, 'Иностранные альбомы'],
	[ReleaseTypes.RU_SINGLES, 'СНГ треки'],
	[ReleaseTypes.EN_SINGLES, 'Иностранные треки'],
]);

export const releaseSegmentPreview = new Map([
	[ReleaseTypes.ALL, undefined],
	[ReleaseTypes.RU_ALBUMS, '\n🎧 СНГ альбомы:'],
	[ReleaseTypes.EN_ALBUMS, '\n🎧 Иностранные альбомы:'],
	[ReleaseTypes.RU_SINGLES, '\n🎙️ СНГ треки:'],
	[ReleaseTypes.EN_SINGLES, '\n🎙️ Иностранные треки:'],
]);

/**
 * Возвращает картинку для переданного типа релиза
 * @param type
 */
export function getPictureURL(type: ReleaseTypes) {
  return `${process.env.S3_BUCKET_URL}/segment-pics/${type}.jpg`;
}
