export interface RawResponse {
	albums: {
		items?: {id: string}[]
	}

	tracks: {
		items?: {id: string}[]
	}

	best: Dictionary
}
