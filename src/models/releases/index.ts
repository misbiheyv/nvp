import * as vkApi from 'vk-io';
import { BaseRequester } from 'core/requester';
import { filterReleases, normalizeResponse, reduceToList } from 'models/releases/decoders';
import { Decoders } from 'core/requester/interface';

export { releaseSegmentIdentifiers, normalizeList } from 'models/releases/helpers';
export * from 'models/releases/interface';


/**
 * Движок запросов: возвращает список релизов
 */
export class ReleasesList extends BaseRequester {
	static override decoders: Decoders = <Decoders>{
		...BaseRequester.decoders,
		get: [...BaseRequester.decoders.get, filterReleases, normalizeResponse, reduceToList]
	};

	override requestEngine() {
		return {
			get: (procedureName: string, params: {query: Dictionary<string>}) =>
				new vkApi.VK({ token: process.env.VK_TOKEN! }).api.procedure(procedureName, params.query)
		};
	}

	override baseUrl: string = 'getPostsInTimeRange';
}
