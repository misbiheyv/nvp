export type RequestMethod = 'get' | 'post' | 'put' | 'delete';

export interface GetParams {
	query: Dictionary<any>;
}

export interface PostParams {
	query: Dictionary<any>;
	body: Dictionary;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PutParams extends PostParams {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DeleteParams extends PostParams {}

export type ParamsMap = {
	get: GetParams;
	post: PostParams,
	put: PutParams,
	delete: DeleteParams
}

export type Params = GetParams & PostParams & PutParams & DeleteParams;

export type RequestParams<T extends Params = Params> = {
	[K in keyof T]?: T[K];
}

export interface Decoder<I = unknown, O = unknown> {
	(data: I, params: RequestParams): CanPromise<O>;
}

export interface RequestOptions {
	path?: string;
	baseUrl?: string;
	query?: Dictionary<any>;
	decoders?: Decoder[];
	method?: 'GET';

	/**
	 * Время жизни кэша в миллисекундах (по дефолту без кэша)
	 */
	cacheTTL?: number;
}
