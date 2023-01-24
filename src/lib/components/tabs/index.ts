import { CLASSES } from '../../../constants/classes';
import { KEYS } from '../../../constants/keys';
import { KEYS_DIRECTIONS } from '../../../constants/key-directions';
import getChildrenArray from '../../utils/get-children-array';
import './index.scss';
import { EventDetailsModel, TabsPropertiesModel } from './interfaces';

export class Tabs {
	tabsWrapperSelector: string;
	tabpanelsListSelector: string;
	tabbuttonsListSelector: string;
	currentActive: number;
	deletableTabs: boolean;
	autoplay: {
		delay: number
	};

	autoplayTimeout: number;

	tabsWrapper: HTMLElement;
	tabList: HTMLElement | undefined;
	tabPanelsList: HTMLElement | undefined;
	tabs: HTMLElement[];
	panels: HTMLElement[];
	defaultRoles: {
		[key: string]: string
	};

	defaultSelectors: {
		[key: string]: `[role="${string}"]`
	};

	constructor({
		tabsWrapperSelector = '[data-tabs="wrapper"]',
		tabpanelsListSelector = '[data-tabs="content"]',
		tabbuttonsListSelector = '[data-tabs="tabs"]',
		deletableTabs = false,
		initialTab = 0,
		autoplay = {
			delay: 0,
		},
	}: TabsPropertiesModel) {
		this.tabsWrapperSelector = tabsWrapperSelector;
		this.tabpanelsListSelector = tabpanelsListSelector;
		this.tabbuttonsListSelector = tabbuttonsListSelector;
		this.deletableTabs = deletableTabs;
		this.tabsWrapper = document.querySelector(tabsWrapperSelector) as HTMLElement;
		this.tabList = undefined;
		this.tabPanelsList = undefined;
		this.tabs = [];
		this.panels = [];
		this.currentActive = initialTab;
		this.autoplay = autoplay;
		this.autoplayTimeout = 0;
		this.defaultRoles = {
			tab: 'tab',
			tabpanel: 'tabpanel',
		};
		this.defaultSelectors = {
			tab: '[role="tab"]',
			tabpanel: '[role="tabpanel"]',
		};
	}

	init = () => {
		if (this.tabsWrapper) {
			this.tabList = this.tabsWrapper.querySelector(this.tabbuttonsListSelector) as HTMLElement;
			this.tabPanelsList = this.tabsWrapper.querySelector(this.tabpanelsListSelector) as HTMLElement;
			if (this.tabList && this.tabPanelsList) {
				this.tabs = getChildrenArray(this.tabList);
				this.panels = getChildrenArray(this.tabPanelsList);
				if (this.tabs.length === this.panels.length) {
					this.assigningTabsAttributes();
					this.addListenersForTabs();
					this.setActive(this.currentActive);
					if (this.autoplay.delay > 0) {
						this.runAutoPlay();
					}
				}
			}
		}
	};

	public setActive = (index: number, setFocus: boolean = true) => {
		this.currentActive = index;
		this.setUnactiveAll();
		this.tabs[index].setAttribute('tabindex', '0');
		this.tabs[index].setAttribute('aria-selected', 'true');
		this.tabs[index].classList.add(CLASSES.ACTIVE);
		this.tabs[index].classList.remove(CLASSES.UNACTIVE);
		this.panels[index].removeAttribute('hidden');
		this.panels[index].removeAttribute('inert');
		this.panels[index].classList.add(CLASSES.ACTIVE);
		this.panels[index].classList.remove(CLASSES.UNACTIVE);
		// Set focus when required
		if (setFocus) {
			this.tabs[index].focus();
		}
	};

	public getNextIndex = (): number => (this.currentActive + 1 === this.tabs.length ? 0 : this.currentActive + 1);

	public stopAutoPlay = () => {
		clearTimeout(this.autoplayTimeout);
	};

	// eslint-disable-next-line class-methods-use-this
	private runAutoPlay = () => {
		this.autoplayTimeout = setTimeout(() => {
			this.setActive(this.getNextIndex());
			this.runAutoPlay();
		}, this.autoplay.delay);
	};

	private addListenersForTabs = () => {
		this.tabsWrapper.addEventListener('click', this.clickHandler);
		window.addEventListener('keydown', this.keydownHandler);
		window.addEventListener('keyup', this.keyupHandler);
	};

	private clickHandler = (event: MouseEvent) => {
		this.stopAutoPlay();
		const target = event.target as HTMLElement;
		const targetButton = target.closest(this.defaultSelectors.tab);
		const targetIndex = targetButton?.getAttribute('aria-label');
		if (targetIndex) {
			this.setActive(+targetIndex);
		}
	};

	private keydownHandler = (event: KeyboardEvent) => {
		const eventDetails: EventDetailsModel = this.getEventDetails(event);
		const { targetButton, targetIndex, key } = eventDetails;
		if (targetButton && targetIndex !== undefined) {
			this.stopAutoPlay();
			switch (key) {
			case KEYS.END: {
				event.preventDefault(); // prevent page scroll
				this.focusTab('last');
				break;
			}
			case KEYS.HOME: {
				event.preventDefault(); // prevent page scroll
				this.focusTab('first');
				break;
			}
			case KEYS.UP || KEYS.DOWN: {
				this.determineOrientation(eventDetails);
				break;
			}
			default: {
				break;
			}
			}
		}
	};

	private keyupHandler = (event: KeyboardEvent) => {
		const eventDetails: EventDetailsModel = this.getEventDetails(event);
		const { targetButton, targetIndex, key } = eventDetails;
		if (targetButton && targetIndex !== undefined) {
			this.stopAutoPlay();
			switch (key) {
			case KEYS.LEFT || KEYS.RIGHT: {
				event.preventDefault();
				this.determineOrientation(eventDetails);
				break;
			}
			case KEYS.DELETE: {
				this.determineDeletable(eventDetails);
				break;
			}
			case KEYS.ENTER || KEYS.SPACE: {
				this.setActive(+targetIndex);
				break;
			}
			default: {
				break;
			}
			}
		}
	};


	private setUnactiveAll = () => {
		this.tabs.forEach((tabElement) => {
			tabElement.setAttribute('tabindex', '-1');
			tabElement.setAttribute('aria-selected', 'false');
			tabElement.classList.remove(CLASSES.ACTIVE);
			tabElement.classList.add(CLASSES.UNACTIVE);
		});
		this.panels.forEach((tabpanel) => {
			tabpanel.setAttribute('hidden', 'hidden');
			tabpanel.setAttribute('inert', 'true');
			tabpanel.classList.remove(CLASSES.ACTIVE);
			tabpanel.classList.add(CLASSES.UNACTIVE);
		});
	};

	// eslint-disable-next-line class-methods-use-this
	private focusTab = (order: 'first' | 'last') => {
		if (order === 'first') {
			this.tabs[0].focus();
			return;
		}
		if (order === 'last') {
			this.tabs[this.tabs.length - 1].focus();
		}
	};

	// When a tablist is aria-orientation is set to vertical, only up and down arrow
	// should function. In all other cases only left and right arrow function.
	private switchTabOnArrowPress = (eventDetails: EventDetailsModel) => {
		const { target, key } = eventDetails;
		const pressedIndex = KEYS_DIRECTIONS[key];
		if (pressedIndex) {
			this.tabs.forEach((tab: Element, index: number) => {
				if (tab === target) {
					if (this.tabs[index + pressedIndex]) {
						(this.tabs[index + pressedIndex] as HTMLElement).focus();
						// eslint-disable-next-line no-undef
					} else if (key === KEYS.LEFT || key === KEYS.UP) {
						this.focusTab('last');
						// eslint-disable-next-line no-undef
					} else if (key === KEYS.RIGHT || key === KEYS.DOWN) {
						this.focusTab('first');
					}
				}
			});
		}
	};

	private determineOrientation = (eventDetails: EventDetailsModel) => {
		const {
			target, key, event,
		} = eventDetails;

		const vertical = target.closest('[role="tablist"]')?.getAttribute('aria-orientation') === 'vertical';
		let proceed = false;

		if (vertical) {
			if (key === KEYS.UP || key === KEYS.DOWN) {
				event.preventDefault();
				proceed = true;
			}
		} else if (key === KEYS.LEFT || key === KEYS.RIGHT) {
			proceed = true;
		}

		if (proceed) {
			this.switchTabOnArrowPress(eventDetails);
		}
	};

	// Deletes a tab and its panel
	// eslint-disable-next-line class-methods-use-this
	private deleteTab = (index: number) => {
		const targetTab = this.tabs.find((element) => element.getAttribute('aria-label') === `${index}`);
		const targetPanel = this.panels.find((element) => element.getAttribute('aria-label') === `${index}`);
		targetTab?.remove();
		targetPanel?.remove();
	};

	private determineDeletable = (eventDetails: EventDetailsModel) => {
		const { targetButton, targetIndex } = eventDetails;
		if (targetButton.dataset.deletable) {
			this.deleteTab(targetIndex as number);
		}
	};

	private assigningTabsAttributes = () => {
		const regForRemoveSpecialSymbols = /[^\s\w]/gi;
		this.tabs.forEach((tab, index) => {
			const titleCurrentTab = (tab.textContent as string).toLowerCase()
				.replace(regForRemoveSpecialSymbols, '').split(' ').join('-')
				.trim();
			(tab as HTMLElement).setAttribute('id', titleCurrentTab);
			tab.setAttribute('aria-controls', `${titleCurrentTab}-tabpanel`);
			tab.setAttribute('aria-label', `${index}`);
			tab.setAttribute('role', this.defaultRoles.tab);
			this.deletableTabs ? tab.dataset.deletable = 'true' : undefined;
			this.panels[index].setAttribute('aria-labelledby', titleCurrentTab);
			this.panels[index].setAttribute('aria-label', `${index}`);
			this.panels[index].setAttribute('id', `${titleCurrentTab}-tabpanel`);
			this.panels[index].setAttribute('role', this.defaultRoles.tabpanel);
		});
	};

	private getEventDetails = (event: KeyboardEvent): EventDetailsModel => {
		const { key } = event;
		const target = event.target as HTMLElement;
		const targetButton = target.closest(this.defaultSelectors.tab) as HTMLElement;
		const targetIndex = targetButton?.getAttribute('aria-label');
		return {
			target,
			targetIndex: targetIndex ? +targetIndex : undefined,
			targetButton,
			key,
			event,
		};
	};
}

