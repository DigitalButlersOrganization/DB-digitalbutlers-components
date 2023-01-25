export interface AutoPlayModel {
	delay: number,
}

export interface TabsConfigModel {
	tabpanelsListSelector: string,
	tabbuttonsListSelector: string,
	deletableTabs: boolean,
	autoplay: AutoPlayModel,
	initialTab: number,
	vertical: boolean,
}

export interface TabsPropertiesModel {
	tabsWrapper: string | HTMLElement,
	config: TabsConfigModel,
}

export interface EventDetailsModel {
	target: HTMLElement,
	targetButton: HTMLElement,
	targetIndex: number | undefined,
	key: string | undefined,
	event: KeyboardEvent | MouseEvent
}

