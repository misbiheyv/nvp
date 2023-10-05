import { getClosestThursdayBoundaries } from '../../helpers';
import { FilteredVkApiRequester, VkApiRequester } from '../../requester';
import { ReleaseTypes, releaseSegmentsMap } from './helpers';

export default class VkParser {
	getClosestReleases(date: Date = new Date()): Promise<string[]> {
		const { startBoundary, endBoundary } = getClosestThursdayBoundaries(date);

		return new VkApiRequester().get(
			'getPostsInTimeRange',
			{
				query: {
					startTime: startBoundary.getTime(),
					endTime: endBoundary.getTime(),
				}
			}
		);
	}

	getClosestFilteredReleases(type: ReleaseTypes, date: Date = new Date()): Promise<string[]> {
		const { startBoundary, endBoundary } = getClosestThursdayBoundaries(date);
		const identifier = releaseSegmentsMap.get(type);

		try {
			if (identifier == null) {
				return this.getClosestReleases();
			}

			return new FilteredVkApiRequester().get(
				'getPostsInTimeRange',
				{
					query: {
						startTime: startBoundary.getTime(),
						endTime: endBoundary.getTime(),
						type: identifier
					}
				}
			);

		} catch {
			console.error('err');
		}

		return Promise.resolve([]);
	}
}
