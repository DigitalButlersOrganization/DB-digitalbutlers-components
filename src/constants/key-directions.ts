type DirectionType = 1 | -1

interface KeyDirectionsModel {
  [key: string]: DirectionType
}

export const KEYS_DIRECTIONS: KeyDirectionsModel = {
	37: -1,
	38: -1,
	39: 1,
	40: 1,
};
