import type { Requester, GetParams, Decoders } from 'core/requester/interface';

/**
 * Базовый движок для запросов
 */
export default class BaseRequester implements Requester {
	static readonly decoders: Decoders = {
		get: [],
		post: [],
		put: [],
		delete: []
	};

	readonly baseQuery: Dictionary = {};

	readonly baseUrl?: string;

	async get<T = unknown>(params: GetParams): Promise<T>;
	async get<T = unknown>(url: string | GetParams, params?: GetParams): Promise<T>;
	async get<T = unknown>(urlOrParams: string | GetParams, params?: GetParams): Promise<T> {
		const
			url = typeof urlOrParams === 'string' ? urlOrParams : this.baseUrl,
			p = typeof urlOrParams === 'string' ? params : urlOrParams,
			reqParams = {query: {...this.baseQuery, ...p?.query}};

		let
			res = await this.requestEngine().get(url, reqParams);

		for (const decoder of this.constructor['decoders']['get'] ?? []) {
			res = await decoder(res, reqParams);
		}

		return res;
	}

	requestEngine() {
		return {
			get: (url, params): Promise<any> => {
				const query = Object.entries(params.query).reduce((acc, k, v) => acc += `${k}=${v}&`, '');

				return fetch(`${url}?${query}`);
			}
		};
	}
}
