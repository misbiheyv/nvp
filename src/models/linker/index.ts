import Requester, { Decoders } from 'core/requester';
import { RawResponse } from 'models/linker/interface';

export * from 'models/linker/interface';

/**
 * Движок запросов: возвращает ссылки на треки/альбомы из яндекс музыки
 */
export class YMLinker extends Requester {
	static override decoders: Decoders = <Decoders>{
		...Requester.decoders,
		get: [
			...Requester.decoders.get,

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
