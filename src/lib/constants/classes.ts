type jsClassType = `js--${string}`;

export interface ClassesModel {
  [key: string]: jsClassType;
}

export const CLASSES: ClassesModel = {
	ACTIVE: 'js--active',
	UNACTIVE: 'js--unactive',
	VISIBLE: 'js--visible',
};
