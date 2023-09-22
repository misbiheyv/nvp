import 'dotenv/config';
import * as vkApi from 'vk-io';

import BaseRequester from './base-requester';
import { filterReleases, filterByType } from './decoders';

export class VkApiRequester extends BaseRequester {
	override decoders = {
		get: [filterReleases]
	};

	override requestEngine() {
		return {
			get: (procedureName: string, params: {query: Dictionary<string>}) =>
				new vkApi.VK({ token: process.env.VK_TOKEN! }).api.procedure(procedureName, params.query)
		};
	}
}

export class FilteredVkApiRequester extends VkApiRequester {
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
