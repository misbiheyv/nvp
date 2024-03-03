import { BaseRequester } from 'core/requester';
import { Decoders } from 'core/requester/interface';
import { RawResponse } from 'models/linker/interface';

export class YMLinker extends BaseRequester {
	static decoders: Decoders = <Decoders>{
		...BaseRequester.decoders,
		get: [
			...BaseRequester.decoders.get,

			(response: RawResponse, params) => {
				const type = params.query?.type ?? 'all';

				if (response[type]?.items[0]?.id) {
					const suggestType = {
						albums: 'album',
						tracks: 'track',
						all: 'best'
					};

					return `https://music.yandex.ru/${suggestType[type]}/${response[type].items[0].id}`;
				}

				return new URL(`https://music.yandex.ru/search?text=${params.query?.text}`).toString();
			}
		]
	};

	override readonly baseUrl: string = 'https://music.yandex.ru/handlers/music-search.jsx';

	override readonly baseQuery: Dictionary<string> = {lang: 'ru'};
}
