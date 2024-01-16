/* eslint-disable no-unused-vars */

import { Tabs } from '.';

export type OrientationType = 'horizontal' | 'vertical'

export interface AutoPlayModel {
	delay: number,
}

export interface EventsModel {
	// eslint-disable-next-line no-unused-vars
	tabChange?: (tabs: Tabs) => void,
	// eslint-disable-next-line no-unused-vars
	beforeInit?: (tabs: Tabs) => void,
	// eslint-disable-next-line no-unused-vars
	afterInit?: (tabs: Tabs) => void,
}

// eslint-disable-next-line no-shadow
export enum TriggerEvents {
	click = 'click',
	mouseover = 'mouseover'
}

export interface TabsConfigModel {
	tabpanelsListSelector: string,
	tabbuttonsListSelector: string,
	deletableTabs: boolean,
	initialTab: number,
	orientation: OrientationType,
	equalHeight: boolean,
	autoplay: AutoPlayModel,
	triggerEvent: TriggerEvents,
	on: EventsModel,
	matchMediaRule?: string,
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
	orientation: OrientationType;
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
	matchMediaRule: string;
	isInMatchMedia: boolean;
}


