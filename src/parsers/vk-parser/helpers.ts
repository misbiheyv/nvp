/* eslint-disable no-unused-vars */
export enum ReleaseTypes {
	RU_ALBUMS,
	EN_ALBUMS,
	RU_SINGLES,
	EN_SINGLES
}
/* eslint-enable no-unused-vars */

export const segmentsSeparator = '\n';

export const releaseSegmentsMap = new Map([
	[ReleaseTypes.RU_ALBUMS, '🎧 СНГ альбомы'],
	[ReleaseTypes.EN_ALBUMS, '🎧 Иностранные альбомы'],
	[ReleaseTypes.RU_SINGLES, '🎧 СНГ треки / макси синглы'],
	[ReleaseTypes.EN_SINGLES, '🎧 Иностранные треки / макси синглы'],
]);

export function normalizeList(list: string[]): string {
	return list.join('\n');
}
