import type { IRequester, GetParams, Decoders } from 'core/requester/interface';

export * from 'core/requester/interface';

/**
 * Базовый движок для запросов
 */
export default class Requester implements IRequester {
	/**
	 * Декодеры применяются для обработки ответа
	 */
	static readonly decoders: Decoders = {
		get: [],
		post: [],
		put: [],
		delete: []
	};

	/**
	 * Базовые query параметры, будут добавлены к каждому запросу
	 */
	readonly baseQuery: Dictionary = {};

	/**
	 * Url для каждого запроса
	 */
	readonly baseUrl?: string;

	/**
	 * Отправляет GET запрос с переданными параметрами
	 *
	 * @param urlOrParams
	 * @param [params]
	 */
	async get<T = unknown>(params: GetParams): Promise<Nullable<T>>;
	async get<T = unknown>(url: string | GetParams, params?: GetParams): Promise<Nullable<T>>;

	async get<T = unknown>(urlOrParams: string | GetParams, params?: GetParams): Promise<Nullable<T>> {
		const
			url = typeof urlOrParams === 'string' ? urlOrParams : this.baseUrl,
			p = typeof urlOrParams === 'string' ? params : urlOrParams,
			reqParams = {query: {...this.baseQuery, ...p?.query}};

		if (!url) {
			return null;
		}

		let
			res = await this.requestEngine().get(url, reqParams);

		for (const decoder of this.constructor['decoders']['get'] ?? []) {
			res = await decoder(res, reqParams);
		}

		return res;
	}

	/**
	 * Возвращает, движок запросов
	 */
	requestEngine() {
		return {
			get: (url: string, params: GetParams): Promise<any> => {
				const query = Object.entries(params.query).reduce((acc, k, v) => acc += `${k}=${v}&`, '');

				return fetch(`${url}?${query}`);
			}
		};
	}
}
