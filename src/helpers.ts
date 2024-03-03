import { normalizeList } from 'models/releases';
import { getClosestThursdayBoundaries } from 'core/helpers';
import { ReleasesList } from 'models/releases';

export function getClosestReleases(type) {
  const {startBoundary, endBoundary} = getClosestThursdayBoundaries();

  return new ReleasesList().get<string[]>({
    query: {
      startTime: startBoundary.getTime(),
      endTime: endBoundary.getTime(),
      type
    }
  }).then(normalizeList);
}
