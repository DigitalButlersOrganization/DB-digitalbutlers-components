import { CLASSES } from '../../../constants/classes';
import { KEYS_CODES } from '../../../constants/key-codes';
import { KEYS_DIRECTIONS } from '../../../constants/key-directions';
import getChildrenArray from '../../utils/get-children-array';
import './index.scss';
import { TabsPropertiesModel } from './interfaces';

export class Tabs {
	tabsWrapperSelector: string;
	tabpanelsListSelector: string;
	tabbuttonsListSelector: string;
	deletableTabs: boolean;
	autoplay: {
		delay: number
	};

	// eslint-disable-next-line no-undef
	tabsWrappers: NodeListOf<HTMLElement>;
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
		autoplay = {
			delay: 0,
		},
	}: TabsPropertiesModel) {
		this.tabsWrapperSelector = tabsWrapperSelector;
		this.tabpanelsListSelector = tabpanelsListSelector;
		this.tabbuttonsListSelector = tabbuttonsListSelector;
		this.tabsWrappers = document.querySelectorAll(tabsWrapperSelector);
		this.deletableTabs = deletableTabs;
		this.autoplay = autoplay;
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
		this.assigningTabsAttributes();
		this.addListenersForTabs();
		this.startActivate();
		if (this.autoplay.delay > 0) {
			// this.initAutoPlay();
		}
	};

	startActivate = () => {
		this.tabsWrappers.forEach((wrapper) => {
			const activeSlideIndex = wrapper.dataset.tabsActive ? +wrapper.dataset.tabsActive : 0;
			const targetTab = getChildrenArray(wrapper
				.querySelector(this.tabbuttonsListSelector) as HTMLElement)[activeSlideIndex];
			this.activateTab(targetTab as HTMLElement, false);
		});
	};

	addListenersForTabs = () => {
		window.addEventListener('click', this.clickHandler);
		window.addEventListener('keydown', this.keydownHandler);
		window.addEventListener('keyup', this.keyupHandler);
	};

	clickHandler = (event: Event) => {
		const { target } = event;
		if ((target as HTMLElement).closest(this.defaultSelectors.tab)) {
			const tab = (target as HTMLElement).closest(this.defaultSelectors.tab);
			this.activateTab(tab as HTMLElement, false);
		}
	};

	keydownHandler = (event: KeyboardEvent) => {
		const { target, keyCode } = event;
		if ((target as HTMLElement).closest(this.defaultSelectors.tab)) {
			switch (keyCode) {
			case KEYS_CODES.END: {
				event.preventDefault(); // prevent page scroll
				this.focusTab(event, 'last');
				break;
			}
			case KEYS_CODES.HOME: {
				event.preventDefault(); // prevent page scroll
				this.focusTab(event, 'first');
				break;
			}
			case KEYS_CODES.UP: {
				this.determineOrientation(event);
				break;
			}
			case KEYS_CODES.DOWN: {
				this.determineOrientation(event);
				break;
			}
			default: {
				break;
			}
			}
		}
	};

	keyupHandler = (event: KeyboardEvent) => {
		const { target, keyCode } = event;
		if ((target as HTMLElement).closest(this.defaultSelectors.tab)) {
			switch (keyCode) {
			case KEYS_CODES.LEFT: {
				this.determineOrientation(event);
				break;
			}
			case KEYS_CODES.RIGHT: {
				this.determineOrientation(event);
				break;
			}
			case KEYS_CODES.DELETE: {
				this.determineDeletable(event);
				break;
			}
			case KEYS_CODES.ENTER: {
				this.activateTab(target as HTMLElement);
				break;
			}
			case KEYS_CODES.SPACE: {
				this.activateTab(target as HTMLElement);
				break;
			}
			default: {
				break;
			}
			}
		}
	};

	activateTab = (tab: HTMLElement, setFocus: boolean = true) => {
		const controls = tab.getAttribute('aria-controls');
		const desiredTabpanel = document.querySelector(`#${controls}`);
		this.deactivateTabs(tab);
		tab.setAttribute('tabindex', '0');
		tab.setAttribute('aria-selected', 'true');
		tab.classList.add(CLASSES.ACTIVE);
		tab.classList.remove(CLASSES.UNACTIVE);
		desiredTabpanel?.removeAttribute('hidden');
		desiredTabpanel?.removeAttribute('inert');
		desiredTabpanel?.classList.add(CLASSES.ACTIVE);
		desiredTabpanel?.classList.remove(CLASSES.UNACTIVE);
		// Set focus when required
		if (setFocus) {
			tab.focus();
		}
	};

	deactivateTabs = (tab: Element) => {
		const nearestTabsWrapper = tab.closest(this.tabsWrapperSelector);
		const nearestTabList = (nearestTabsWrapper as HTMLElement).querySelector(this.tabbuttonsListSelector);
		const nearestTabpanelsList = (nearestTabsWrapper as HTMLElement).querySelector(this.tabpanelsListSelector);
		const desiredTabsElements = getChildrenArray(nearestTabList as HTMLElement);
		const desiredTabpanelsElements = getChildrenArray(nearestTabpanelsList as HTMLElement);
		[...desiredTabsElements].forEach((tabElement) => {
			tabElement.setAttribute('tabindex', '-1');
			tabElement.setAttribute('aria-selected', 'false');
			tabElement.classList.remove(CLASSES.ACTIVE);
			tabElement.classList.add(CLASSES.UNACTIVE);
		});
		[...desiredTabpanelsElements].forEach((tabpanel) => {
			tabpanel.setAttribute('hidden', 'hidden');
			tabpanel.setAttribute('inert', 'true');
			tabpanel.classList.remove(CLASSES.ACTIVE);
			tabpanel.classList.add(CLASSES.UNACTIVE);
		});
	};

	// eslint-disable-next-line class-methods-use-this
	focusTab = (event: Event, order: number | 'first' | 'last') => {
		const { target } = event;
		const nearestTabList = (target as HTMLElement).closest('[role="tablist"]');
		const desiredTabsElements = (nearestTabList as HTMLElement).querySelectorAll(this.defaultSelectors.tab);
		let tabOfDesired: HTMLElement;
		switch (order) {
		case 'first': {
			tabOfDesired = desiredTabsElements[0] as HTMLElement;
			break;
		}
		case 'last': {
			tabOfDesired = desiredTabsElements[desiredTabsElements.length - 1] as HTMLElement;
			break;
		}
		default: {
			tabOfDesired = desiredTabsElements[order] as HTMLElement;
		}
		}
		tabOfDesired?.focus();
	};

	// When a tablist is aria-orientation is set to vertical, only up and down arrow
	// should function. In all other cases only left and right arrow function.
	switchTabOnArrowPress = (event: KeyboardEvent) => {
		const { target, keyCode } = event;
		// const pressedKeyCode = keyCode;
		const nearestTabList = (target as HTMLElement).closest('[role="tablist"]');
		const desiredTabsElements = (nearestTabList as HTMLElement).querySelectorAll(this.defaultSelectors.tab);
		const pressedIndex = KEYS_DIRECTIONS[keyCode];
		if (pressedIndex) {
			desiredTabsElements.forEach((tab: Element, index: number) => {
				if (tab === target) {
					if (desiredTabsElements[index + pressedIndex]) {
						(desiredTabsElements[index + pressedIndex] as HTMLElement).focus();
						// eslint-disable-next-line no-undef
					} else if (keyCode === KEYS_CODES.LEFT || keyCode === KEYS_CODES.UP) {
						this.focusTab(event, 'last');
						// eslint-disable-next-line no-undef
					} else if (keyCode === KEYS_CODES.RIGHT || keyCode === KEYS_CODES.DOWN) {
						this.focusTab(event, 'first');
					}
				}
			});
		}
	};

	determineOrientation = (event: KeyboardEvent) => {
		const { target, keyCode } = event;
		const vertical = (target as HTMLElement).closest('[role="tablist"]')?.getAttribute('aria-orientation') === 'vertical';
		let proceed = false;

		if (vertical) {
			if (keyCode === KEYS_CODES.UP || keyCode === KEYS_CODES.DOWN) {
				event.preventDefault();
				proceed = true;
			}
		} else if (keyCode === KEYS_CODES.LEFT || keyCode === KEYS_CODES.RIGHT) {
			proceed = true;
		}

		if (proceed) {
			this.switchTabOnArrowPress(event);
		}
	};


	// Deletes a tab and its panel
	// eslint-disable-next-line class-methods-use-this
	deleteTab = (event: Event) => {
		const { target } = event;
		// eslint-disable-next-line unicorn/prefer-query-selector
		const desiredPanel = document.querySelector(`#${(target as HTMLElement).getAttribute('aria-controls')}`);
		(target as HTMLElement).remove();
		(desiredPanel as HTMLElement).remove();
	};

	determineDeletable = (event: Event) => {
		const { target } = event;
		const nearestTabList = (target as HTMLElement).closest('[role="tablist"]');
		const desiredTabsElements = (nearestTabList as HTMLElement).querySelectorAll(this.defaultSelectors.tab);

		if (Object.hasOwn((target as HTMLElement).dataset, 'deletable')) {
			desiredTabsElements.forEach((tab: Element, index: number) => {
				if (target === tab) {
					this.deleteTab(event);
					// Activate the closest tab to the one that was just deleted
					if (desiredTabsElements.length > 1) {
						if (index - 1 < 0) {
							this.activateTab(desiredTabsElements[index + 1] as HTMLElement);
						} else {
							this.activateTab(desiredTabsElements[index - 1] as HTMLElement);
						}
					} else {
						((nearestTabList as HTMLElement).closest(this.tabsWrapperSelector) as HTMLElement)?.focus();
					}
				}
			});
		}
	};

	assigningTabsAttributes = () => {
		this.tabsWrappers.forEach((tabWrapper) => {
			const nearestTabList = tabWrapper.querySelector(this.tabbuttonsListSelector) as HTMLElement;
			const nearestTabpanelsList = tabWrapper.querySelector(this.tabpanelsListSelector) as HTMLElement;
			if (nearestTabList && nearestTabpanelsList) {
				const nearestTabs = getChildrenArray(nearestTabList);
				// const nearestTabs = nearestTabList.childNodes || [];
				const nearestTabpanels = nearestTabpanelsList.children || [];
				const regForRemoveSpecialSymbols = /[^\s\w]/gi;
				nearestTabs.forEach((tab, index) => {
					const titleCurrentTab = (tab.textContent as string).toLowerCase()
						.replace(regForRemoveSpecialSymbols, '').split(' ').join('-')
						.trim();
					(tab as HTMLElement).setAttribute('id', titleCurrentTab);
					tab.setAttribute('aria-controls', `${titleCurrentTab}-tabpanel`);
					tab.setAttribute('role', this.defaultRoles.tab);
					// eslint-disable-next-line no-unused-expressions, no-param-reassign
					this.deletableTabs ? tab.dataset.deletable = 'true' : undefined;
					nearestTabpanels[index].setAttribute('aria-labelledby', titleCurrentTab);
					nearestTabpanels[index].setAttribute('id', `${titleCurrentTab}-tabpanel`);
					nearestTabpanels[index].setAttribute('role', this.defaultRoles.tabpanel);
				});
			}
		});
	};
}

