import type { BaseRequester } from '../../core/requester';

/* eslint-disable no-unused-vars */
export enum ReleaseTypes {
	ALL,
	RU_ALBUMS,
	EN_ALBUMS,
	RU_SINGLES,
	EN_SINGLES
}
/* eslint-enable no-unused-vars */

export const releaseSegmentIdentifiers = new Map([
	[ReleaseTypes.ALL, undefined],
	[ReleaseTypes.RU_ALBUMS, 'СНГ альбомы'],
	[ReleaseTypes.EN_ALBUMS, 'Иностранные альбомы'],
	[ReleaseTypes.RU_SINGLES, 'СНГ треки'],
	[ReleaseTypes.EN_SINGLES, 'Иностранные треки'],
]);

export function normalizeList(list: string[]): string {
	return list.join('\n');
}

/**
 * Декодер: фильтрует посты, находит среди них список релизов
 * @param response
 */
export function filterReleases(response) {
	const res = response.response.filter(el => el.text.includes('#musicfridayo_o@novinkifriday'));

	if (res.length === 0) {
		return [];
	}

	return res[0].text.split('\n');
}

/**
 * Декодер: фильтрует список релизов по переданному типу
 * @param response
 */
export function filterByType(this: BaseRequester, response) {
	let
		start = 0,
		end = 0;

	if (this.query.type == null) {
		return response;
	}

	for (let i = 0; i < response.length; i++) {
		const line = response[i];

		if (start > 0 && line === '') {
			end = i;
			break;
		}

		if (line.includes(this.query.type)) {
			start = i;
		}
	}

	return response.slice(start, end ?? response.length);
}
