import type { Requester } from './interface';

/**
 * Базовый движок для запросов
 */
export default class BaseRequester implements Requester {
	decoders = {};

	protected query: Dictionary = {};

	async get(url: string, params: Dictionary<any>) {
		let res = await this.requestEngine().get(url, params);
		this.query = params.query;

		for (const decoder of this.decoders['get'] ?? []) {
			res = decoder(res);
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
