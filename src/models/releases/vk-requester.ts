import 'dotenv/config';
import * as vkApi from 'vk-io';
import {BaseRequester} from '../../core/requester';
import {filterReleases, filterByType} from './helpers';

/**
 * Движок запросов: возвращает список релизов
 */
export class ReleasesList extends BaseRequester {
	override decoders = {
		get: [filterReleases, filterByType.bind(this)]
	};

	override requestEngine() {
		return {
			get: (procedureName: string, params: {query: Dictionary<string>}) =>
				new vkApi.VK({ token: process.env.VK_TOKEN! }).api.procedure(procedureName, params.query)
		};
	}
}
