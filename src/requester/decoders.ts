import type BaseRequester from './base-requester';

export function filterReleases(response) {
	const res = response.response.filter(el => el.text.includes('#musicfridayo_o@novinkifriday'));

	if (res.length === 0) {
		return [];
	}

	return res[0].text.split('\n');
}

export function filterByType(this: BaseRequester, response) {
	let start = 0;
	let end = 0;

	for (let i = 0; i < response.length; i++) {
		const line = response[i];
		if (start > 0 && line === '') {
			end = i;
			break;
		}

		if (line.includes(this.query.type)) {
			start = i;
		}
	}

	return response.slice(start, end ?? response.length);
}
