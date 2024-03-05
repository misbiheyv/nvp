import * as vkApi from 'vk-io';
import Requester, { Decoders } from 'core/requester';
import { normalizeResponse, reduceToLists, extractResponse } from 'models/releases/decoders';
import { globalLogger } from 'core/logger';

export { releaseSegmentIdentifiers } from 'models/releases/helpers';
export * from 'models/releases/interface';


/**
 * Движок запросов: возвращает список релизов
 */
export class ReleasesList extends Requester {
	static override decoders: Decoders = <Decoders>{
		...Requester.decoders,
		get: [...Requester.decoders.get, normalizeResponse, extractResponse, reduceToLists]
	};

	override requestEngine() {
		return {
			get: (procedureName: string, params: {query: Dictionary<string>}) => {
				globalLogger.info('request', {procedureName, params});
				return new vkApi.VK({ token: process.env.VK_TOKEN! }).api.procedure(procedureName, params.query);
			}
		};
	}

	override baseUrl: string = 'getPostsInTimeRange';
}
