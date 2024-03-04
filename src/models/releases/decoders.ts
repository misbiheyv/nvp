import type { Decoder } from 'core/requester';
import { YMLinker } from 'models/linker';
import { mapReleaseTypeToYmType } from 'models/helpers';
import { releaseSegmentIdentifiers, releaseSegmentPreview } from 'models/releases/helpers';
import { RawResponse, DecodedResponseWithMeta, ReleaseTypes, DecodedResponse } from 'models/releases/interface';

/**
 * Декодер: приводит ответ к нормализованному виду
 *
 * @param list
 * @param params
 */
export const normalizeResponse: Decoder<RawResponse, DecodedResponseWithMeta> = (response, {query}) => {
	const res = response.response.filter(el => el.text.includes('#musicfridayo_o@novinkifriday'));

	if (res.length === 0) {
		return {};
	}

	const
		list = res[0].text.split('\n'),
		segments = [...releaseSegmentIdentifiers.entries()],
		result: DecodedResponseWithMeta = {},
		queryType = query?.type;

	let
		type: Nullable<ReleaseTypes>;

	for (const line of list) {
		if (line.trim().length === 0) {
			type = null;
			continue;
		}

		const key = segments.filter(([key, title]) => {
			if (queryType != null && queryType !== ReleaseTypes.ALL && key !== queryType) {
				return false;
			}

			return title != null && line.includes(title);
		})[0]?.[0];

		if (key != null) {
			type = key;
			continue;
		}

		if (!type) {
			continue;
		}

		if (!result[type]) {
			result[type] = [];
		}

		result[type]?.push({title: line.trim(), type});
	}

	return result;
};

/**
 * Декодер: обогащает ответ дополнительными данными
 * @param data
 */
export const extractResponse: Decoder<DecodedResponseWithMeta, DecodedResponseWithMeta> = async (data) => {
	const linker = new YMLinker();
	const promises: Promise<any>[] = [];

	for (const segment of Object.values(data)) {
		for (const el of segment) {
			if (el.links == null) {
				el.links = {};
			}

			promises.push(
				linker.get<string>({
					query: {
						text: el.title,
						type: mapReleaseTypeToYmType(el.type)
					}
				}).then((link) => el.links!.ym = link)
			);
		}
	}

	return Promise.allSettled(promises).then(() => data);
};

/**
 * Декодер: сворачивает ответ в список
 * @param data
 */
export const reduceToLists: Decoder<DecodedResponseWithMeta, DecodedResponse> = async (data) => {
	const res = {};

	Object.entries(data).forEach(([segment, list]) => {
		res[segment] = [releaseSegmentPreview.get(<ReleaseTypes>segment)];

		for (const line of list) {
			res[segment].push(line.links?.ym == null ?
					line.title :
					`<a href="${line.links.ym}">${line.title}</a>`
			);
		}
	});

	Object.entries(res).forEach(([segment, list]) => res[segment] = (<string[]>list).join('\n'));

	return res;
};
