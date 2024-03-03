import { Decoder } from 'core/requester/interface';
import { RawResponse, DecodedResponse, ReleaseTypes } from 'models/releases/interface';
import { releaseSegmentIdentifiers, releaseSegmentPreview } from 'models/releases/helpers';
import { YMLinker } from 'models/linker';
import { mapReleaseTypeToYmType } from 'models/helpers';

/**
 * Декодер: фильтрует посты, находит среди них список релизов
 * @param response
 */
export const filterReleases: Decoder<RawResponse, string[]> = (response) => {
	const res = response.response.filter(el => el.text.includes('#musicfridayo_o@novinkifriday'));

	if (res.length === 0) {
		return [];
	}

	return res[0].text.split('\n');
};

/**
 * Декодер: приводит ответ к нормализованному виду
 * @param response
 */
export const normalizeResponse: Decoder<string[], DecodedResponse> = (list, {query}) => {
	const
		segments = [...releaseSegmentIdentifiers.entries()],
		result: DecodedResponse = {},
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
 * @param response
 */
export const extractResponse: Decoder<DecodedResponse, DecodedResponse> = async (data) => {
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
 * @param response
 */
export const reduceToList: Decoder<DecodedResponse, string[]> = async (data) => {
	let prevSegment: CanUndef<string>;

	return Object.entries(data).reduce<string[]>((acc, [segment, list]) => {
		if (prevSegment !== segment) {
			prevSegment = segment;
			const title = releaseSegmentPreview.get(<ReleaseTypes>segment);

			if (title) {
				acc.push(title);
			}
		}

		list.forEach((record) => {
			record.links?.ym == null ?
				acc.push(record.title) :
				acc.push(`[${record.title}](${record.links.ym})`);
		});

		return acc;
	}, []);
};
