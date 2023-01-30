type jsClassType = `js--${string}`;

interface ClassesModel {
  [key: string]: jsClassType;
}

export const CLASSES: ClassesModel = {
	ACTIVE: 'js--active',
	UNACTIVE: 'js--unactive',
	VISIBLE: 'js--visible',
	TAB: 'js--tab',
	PANEL: 'js--panel',
	TAB_LIST: 'js--tab-list',
	PANEL_LIST: 'js--panel-list',
	ANIMATED_FADE: 'js--animated-fade',
	ANIMATED_OPACITY: 'js--animated-opacity',
	ANIMATED_SLIDE: 'js--animated-slide',
};
