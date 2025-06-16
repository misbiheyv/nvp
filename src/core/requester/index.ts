import {globalLogger as gl} from 'core/logger';
import {RequestOptions} from './interface';
import {TtlCache} from 'core/cache';

export * from './interface';

const cache = new TtlCache();

function buildQueryString(params: Dictionary<any>): string {
	return Object.entries(params)
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
		.join('&');
}

export async function request<T = unknown>(options: RequestOptions): Promise<Nullable<T>> {
	const {
		path = '',
		baseUrl = '',
		query = {},
		decoders = [],
		method = 'GET',
		cacheTTL = 0,
	} = options;

	const queryString = buildQueryString(query);
	const url = `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}${queryString && `?${queryString}`}`;
	const fromCache = cache.get<T>(url);

	if (fromCache) {
		return fromCache;
	}

	if (!url.startsWith('http')) {
		gl.error('fetchWithDecoders: Invalid URL constructed', {url});
		return null;
	}

	try {
		const response = await fetch(url, {method});

		if (!response.ok) {
			const text = await response.text().catch(() => undefined);

			gl.error(`fetchWithDecoders: HTTP error`, {
				status: response.status,
				statusText: response.statusText,
				url,
				text
			});

			return null;
		}

		let data: any = await response.json();

		for (const decoder of decoders) {
			try {
				data = await decoder(data, {query});

			} catch (error) {
				gl.error('fetchWithDecoders: Error during decoding', {
					decoderName: decoder.name || 'anonymous',
					error,
					intermediateData: data
				});

				return null;
			}
		}

		if (cacheTTL) {
			cache.set(url, data, cacheTTL);
		}

		return data as T;

	} catch (error) {
		gl.error('fetchWithDecoders: Network or other fetch error', {error, url});
		return null;
	}
}
