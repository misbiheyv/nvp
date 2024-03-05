export enum ReleaseTypes {
	ALL = 'all',
	RU_ALBUMS = 'ru_albums',
	EN_ALBUMS = 'en_albums',
	RU_SINGLES = 'ru_singles',
	EN_SINGLES = 'en_singles'
}

export type DecodedResponseWithMeta = {
	[key in ReleaseTypes]?: Array<{
		title: string;

		type: ReleaseTypes;

		artist?: string;

		links?: {
			ym?: string
		}
	}>
}

export type DecodedResponse = {
	[key in ReleaseTypes]?: {
		text: string;

		attachments?: {
			picture?: string;
		};
	}
};

export type RawResponse = {
	response: Array<{text: string}>;
}
