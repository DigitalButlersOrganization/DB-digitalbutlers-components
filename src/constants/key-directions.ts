type DirectionType = 1 | -1

interface KeyDirectionsModel {
  [key: string]: DirectionType
}

export const KEYS_DIRECTIONS: KeyDirectionsModel = {
	ArrowLeft: -1,
	ArrowUp: -1,
	ArrowRight: 1,
	ArrowDown: 1,
};
