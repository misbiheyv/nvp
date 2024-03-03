export type RequestMethod = 'get' | 'post' | 'put' | 'delete';

export interface GetParams {
	query: Dictionary<any>;
}

export interface PostParams {
	query: Dictionary<any>;
	body: Dictionary;
}

export interface PutParams extends PostParams{}

export interface DeleteParams extends PostParams{}

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

export type Decoder = <D = unknown, R = unknown>(data: D, params: RequestParams) => CanPromise<R>;

export type Decoders = Record<RequestMethod, Iterable<Decoder>>;

export interface Requester {
	requestEngine(): {
		[K in RequestMethod]?: <R = unknown>(url: string, params: ParamsMap[K]) => CanPromise<R>;
	}
}
