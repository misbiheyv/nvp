export enum ReleaseTypes {
	ALL = 'all',
	// RU_ALBUMS = 'ru_albums',
	// EN_ALBUMS = 'en_albums',
	// RU_SINGLES = 'ru_singles',
	// EN_SINGLES = 'en_singles'
}

export interface RequestParams {
	query: Dictionary<any>;
}

type VKPhotoAttachment = {
	type: 'photo';
	photo: {
		album_id: number;
		date: number;
		id: number;
		owner_id: number;
		access_key?: string;
		post_id?: number;
		text: string;
		user_id?: number;
		web_view_token?: string;
		has_tags?: boolean;
		sizes: Array<{
			height: number;
			type: string;
			width: number;
			url: string;
		}>;
		orig_photo?: {
			height: number;
			type: string;
			url: string;
			width: number;
		};
	};
};

type RawAttachment = VKPhotoAttachment;

type RawItem = {
	id: number;
	from_id: number;
	inner_type: string;
	donut: {is_donut: boolean};
	comments: {
		can_post: number;
		count: number;
		groups_can_post: boolean
	};
	marked_as_ads: number;
	hash: string;
	type: string;
	attachments: RawAttachment[];
	text: string;
	date: number;
	edited: number;
	likes: {
		can_like: number;
		count: number;
		user_likes: number;
		can_publish: number;
		repost_disabled: boolean;
	};
	owner_id: number;
	post_type: string;
	post_source: {platform: string; type: string};
	reposts: {count: number; user_reposted: number};
	views: {count: number};
};

export type RawResponse = {
	response: {
		count: number;
		items: RawItem[];
	};
	errors: unknown[];
};

export type ResponseWithMeta = {
	[key in ReleaseTypes]?: {
		list: Array<{
			title: string;

			type: ReleaseTypes;

			artist?: string;

			links?: {
				ym?: Nullable<string>
			}

		}>;

		attachments?: {
			picture?: string;
		};
	}
}

export type NormalizedResponse = {
	[key in ReleaseTypes]?: {
		text: string;

		attachments?: {
			picture?: string;
		};
	}
};
