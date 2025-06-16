import {request} from 'core/requester';
import type {Decoder, GetParams} from 'core/requester';

import {RawResponse} from './interface';

export * from './interface';

const YM_BASE_URL = 'https://music.yandex.ru';
const YM_BASE_QUERY: Dictionary<string> = {lang: 'ru'};

const yandexMusicLinkDecoder: Decoder<RawResponse, string> = (response, {query}) => {
	const type = query?.type ?? 'all';
	const searchText = query?.text ?? '';
	const ymItemId = response[type]?.items?.[0].id;

	if (ymItemId) {
		const suggestType: Record<string, string> = {
			albums: 'album',
			tracks: 'track',
			all: 'best'
		};

		const ymType = suggestType[type];

		if (ymType) {
			return `${YM_BASE_URL}/${ymType}/${ymItemId}`;
		}
	}

	const searchUrl = new URL(`${YM_BASE_URL}/search`);
	searchUrl.searchParams.set('text', searchText);

	return searchUrl.toString();
};

export const getLink = async (params: GetParams): Promise<Nullable<string>> => request({
	baseUrl: YM_BASE_URL,
	path: 'handlers/music-search.jsx',
	query: {...YM_BASE_QUERY, ...params.query},
	decoders: [yandexMusicLinkDecoder as Decoder<unknown, string>],
	cacheTTL: 1000 * 60 * 60,
});
