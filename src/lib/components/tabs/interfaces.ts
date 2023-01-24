export interface AutoPlayModel {
	delay: number,
}

export interface TabsPropertiesModel {
	tabsWrapperSelector: string,
	tabpanelsListSelector: string,
	tabbuttonsListSelector: string,
	deletableTabs: boolean,
	autoplay: AutoPlayModel,
	initialTab: number,
}

export interface EventDetailsModel {
	target: HTMLElement,
	targetButton: HTMLElement,
	targetIndex: number | undefined,
	key: string,
	event: KeyboardEvent
}

