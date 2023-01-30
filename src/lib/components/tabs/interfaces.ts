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
	equalHeight: boolean,
}

export interface EventDetailsModel {
	target: HTMLElement,
	targetButton: HTMLElement,
	targetIndex: number | undefined,
	key: string | undefined,
	event: KeyboardEvent | MouseEvent
}

