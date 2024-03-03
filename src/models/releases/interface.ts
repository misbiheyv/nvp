export enum ReleaseTypes {
	ALL = 'all',
	RU_ALBUMS = 'ru_albums',
	EN_ALBUMS = 'en_albums',
	RU_SINGLES = 'ru_singles',
	EN_SINGLES = 'en_singles'
}

export type DecodedResponse = {
	[key in ReleaseTypes]?: Array<{
		title: string;

		type: ReleaseTypes;

		artist?: string;

		links?: {
			ym?: string
		}
	}>
}

export type RawResponse = {
	response: Array<{text: string}>;
}
