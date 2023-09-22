/* eslint-disable no-unused-vars */
interface GetParams {
	query: Dictionary<string>;
}

interface PostParams {
	query: Dictionary<string>;
	body: Dictionary;
}

interface PutParams extends PostParams{}

interface DeleteParams extends PostParams{}

export interface Requester {
	decoders: Dictionary;

	requestEngine: () => {
		get?(url: string, params?: GetParams): Promise<unknown>,
		post?(url: string, params?: PostParams): Promise<unknown>,
		put?(url: string, params?: PutParams): Promise<unknown>,
		delete?(url: string, params?: DeleteParams): Promise<unknown>,
	}
}
