type jsClassType = `js--${string}`;

interface ClassesModel {
  [key: string]: jsClassType;
}

export const CLASSES: ClassesModel = {
	ACTIVE: 'js--active',
	UNACTIVE: 'js--unactive',
};
