export interface AutoPlayModel {
	delay: number,
}

export interface EventsModel {
	// eslint-disable-next-line no-unused-vars
	tabChange?: (tabs: any) => void,
}

export interface TabsConfigModel {
	tabpanelsListSelector: string,
	tabbuttonsListSelector: string,
	deletableTabs: boolean,
	initialTab: number,
	vertical: boolean,
	equalHeight: boolean,
	autoplay: AutoPlayModel,
	on: EventsModel,
}

export interface EventDetailsModel {
	target: HTMLElement,
	targetButton: HTMLElement,
	targetIndex: number | undefined,
	key: string | undefined,
	event: KeyboardEvent | MouseEvent
}

export interface TabsModel {
	tabpanelsListSelector: string;
	tabbuttonsListSelector: string;
	activeIndex: number;
	nextIndex: number | undefined;
	prevIndex: number | undefined;
	lastIndex: number | undefined;
	deletableTabs: boolean;
	orientation: 'vertical' | 'horizontal';
	autoplay: AutoPlayModel;
	autoplayTimeout: number;
	listenersAdded: boolean;
	// maxPanelHeight: number;
	generatedId: string;
	equalHeight: boolean;
	tabsWrapper: HTMLElement;
	tabButtonsList: HTMLElement | undefined;
	tabPanelsList: HTMLElement | undefined;
	tabs: HTMLElement[];
	panels: HTMLElement[];
	on: EventsModel;
	defaultRoles: {
		[key: string]: string
	};

	defaultSelectors: {
		[key: string]: `[role="${string}"]`
	};
}


