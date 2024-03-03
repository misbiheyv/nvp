import { getClosestThursdayBoundaries } from '../../core/helpers';
import { ReleasesList } from './vk-requester';
import { ReleaseTypes, releaseSegmentIdentifiers } from './helpers';

/**
 * Класс для получения данных о релизах из VK
 */
export default class VkParser {
	/**
	 * Возвращает список ближайших к указанной дате релизов, отфильтрованных по переданному типу
	 *
	 * @param type
	 * @param date
	 */
	getClosest(type: ReleaseTypes, date: Date = new Date()): Promise<string[]> {
		const
			{startBoundary, endBoundary} = getClosestThursdayBoundaries(date),
			identifier = releaseSegmentIdentifiers.get(type);

		return new ReleasesList().get(
			'getPostsInTimeRange',
			{
				query: {
					startTime: startBoundary.getTime(),
					endTime: endBoundary.getTime(),
					type: identifier
				}
			}
		);
	}
}
