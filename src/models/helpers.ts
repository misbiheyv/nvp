import { ReleaseTypes } from 'models/releases';

export function mapReleaseTypeToYmType(type: ReleaseTypes): 'albums' | 'tracks' | 'all' {
	if (type === ReleaseTypes.EN_ALBUMS || type === ReleaseTypes.RU_ALBUMS) {
		return 'albums';
	}

	if (type === ReleaseTypes.RU_SINGLES || type === ReleaseTypes.EN_SINGLES) {
		return 'tracks';
	}

	return 'all';
}
