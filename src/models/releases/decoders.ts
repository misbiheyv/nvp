import {globalLogger} from 'core/logger';
import type {Decoder} from 'core/requester';


import {releaseSegmentPreview, getPictureURL} from './helpers';
import {RawResponse, DecodedResponseWithMeta, ReleaseTypes, DecodedResponse} from './interface';

const MATCHING_PATTERN = '#musicfridayo_o';

/**
 * Добавляет в ответ ссылки на YM
 *
 * @param data
 * @param params
 */
// const addYMLinksResponse: Decoder<DecodedResponseWithMeta, DecodedResponseWithMeta> = async (data, {query}) => {
// 	const promises: Promise<any>[] = [];

// 	if (!query?.links) {
// 		return data;
// 	}

// 	for (const segment of Object.values(data)) {
// 		for (const el of segment.list) {
// 			if (el.links == null) {
// 				el.links = {};
// 			}

// 			promises.push(
// 				getLink({
// 					query: {
// 						text: el.title,
// 						type: 'all'
// 					}
// 				}).then((link) => el.links!.ym = link)
// 			);
// 		}
// 	}

// 	return Promise.allSettled(promises).then(() => {
// 		globalLogger.info('decoderResult', {decoder: 'extractResponse', empty: Object.keys(data).length === 0});
// 		return data;
// 	});
// };

/**
 * Сворачивает ответ в список
 * @param data
 */
const reduceToLists: Decoder<DecodedResponseWithMeta, DecodedResponse> = async (data) => {
	const result = Object.entries(data).reduce((acc, [name, record]) => {
		const segment = <ReleaseTypes>name;

		acc[segment] = {
			text: record.list.reduce(
				(acc, line) => acc?.concat(`\n${line.links?.ym == null ? line.title : `<a href="${line.links.ym}">${line.title}</a>`}`),
				releaseSegmentPreview.get(segment) ?? ''
			),

			attachments: record.attachments
		};

		return acc;
	}, <DecodedResponse>{});

	globalLogger.info('decoderResult', {decoder: 'reduceToLists', empty: Object.keys(result).length === 0});
	return result;
};

/**
 * Декодер: приводит ответ к нормализованному виду
 *
 * @param list
 * @param params
 */
export const normalizeResponse: Decoder<RawResponse, DecodedResponse> = async (response, params) => {
	const res = response.response.items.filter(el => el.text.includes(MATCHING_PATTERN));

	if (!res || res.length === 0) {
		globalLogger.info('decoderResult', {decoder: 'normalizeResponse', empty: true});
		return {};
	}

	const
		list = res[0].text.split('\n'),
		result: DecodedResponseWithMeta = {},
		type = ReleaseTypes.ALL,
		picture = getPictureURL(type, response);

	for (const rawLine of list) {
		const line = rawLine.trim();

		if (line.length === 0) {
			continue;
		}

		if (!result[type]) {
			result[type] = {list: [], attachments: {picture}};
		}

		result[type].list.push({title: line, type});
	}

	globalLogger.info('decoderResult', {decoder: 'normalizeResponse', empty: Object.keys(result).length === 0});
	return reduceToLists(result, params);
};
