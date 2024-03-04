import { DecodedResponse, ReleaseTypes } from 'models/releases';
import { getClosestThursdayBoundaries } from 'core/helpers';
import { ReleasesList } from 'models/releases';

export function getClosestReleases(type: ReleaseTypes): Promise<{[key in ReleaseTypes]?: string}> {
  const {startBoundary, endBoundary} = getClosestThursdayBoundaries();

  return new ReleasesList().get<DecodedResponse>({
    query: {
      startTime: startBoundary.getTime(),
      endTime: endBoundary.getTime(),
      type
    }
  });
}

export function getPictureURL(type: ReleaseTypes) {
  return `${process.env.S3_BUCKET_URL}/segment-pics/${type}.jpg`;
}
