import { DecodedResponse, ReleaseTypes } from 'models/releases';
import { getClosestThursdayBoundaries } from 'core/helpers';
import { ReleasesList } from 'models/releases';

export function getClosestReleases(type: ReleaseTypes): Promise<Nullable<DecodedResponse>> {
  const {startBoundary, endBoundary} = getClosestThursdayBoundaries();

  return new ReleasesList().get<DecodedResponse>({
    query: {
      startTime: startBoundary.getTime(),
      endTime: endBoundary.getTime(),
      links: undefined,
      type
    }
  });
}
