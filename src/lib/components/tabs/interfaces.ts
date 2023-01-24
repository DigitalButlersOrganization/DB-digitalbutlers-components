export interface AutoPlayModel {
	delay: number,
}

export interface TabsPropertiesModel {
	tabsWrapperSelector: string,
	tabpanelsListSelector: string,
	tabbuttonsListSelector: string,
	deletableTabs: boolean,
	autoplay: AutoPlayModel
}

