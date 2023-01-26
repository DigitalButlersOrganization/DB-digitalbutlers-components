import { CLASSES } from '../../../constants/classes';
import { KEYS } from '../../../constants/keys';
import { getChildrenArray, getRandomId } from '../../index';
import './index.scss';
import { EventDetailsModel, TabsConfigModel } from './interfaces';

export class Tabs {
	tabpanelsListSelector: string;
	tabbuttonsListSelector: string;
	currentActive: number;
	deletableTabs: boolean;
	orientation: 'vertical' | 'horizontal';
	autoplay: {
		delay: number;
	};

	autoplayTimeout: number;
	listenersAdded: boolean;
	randomId: string;

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

	constructor(tabsWrapper: string | HTMLElement,
		{
			tabpanelsListSelector = '[data-tabs="content"]',
			tabbuttonsListSelector = '[data-tabs="tabs"]',
			deletableTabs = false,
			initialTab = 0,
			vertical = false,
			autoplay = {
				delay: 0,
			},
		}: TabsConfigModel) {
		this.tabpanelsListSelector = tabpanelsListSelector;
		this.tabbuttonsListSelector = tabbuttonsListSelector;
		this.deletableTabs = deletableTabs;
		this.tabsWrapper = typeof tabsWrapper === 'string'
			? document.querySelector(tabsWrapper) as HTMLElement
			: tabsWrapper;
		this.tabList = undefined;
		this.orientation = vertical ? 'vertical' : 'horizontal';
		this.tabPanelsList = undefined;
		this.tabs = [];
		this.panels = [];
		this.currentActive = initialTab;
		this.autoplay = autoplay;
		this.autoplayTimeout = 0;
		this.listenersAdded = false;
		this.randomId = getRandomId();
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
					if (!this.listenersAdded) {
						this.addListenersForTabs();
						this.listenersAdded = true;
					}
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
			this.focusTab(index);
		}
	};

	public getNextIndex = (): number => (this.currentActive >= this.getLastIndex()
		? 0 : this.currentActive + 1);

	public getPreviousIndex = (): number => (this.currentActive - 1 < 0
		? this.getLastIndex() : this.currentActive - 1);

	public getLastIndex = (): number => this.tabs.length - 1;

	public stopAutoPlay = () => {
		clearTimeout(this.autoplayTimeout);
	};

	private runAutoPlay = () => {
		this.autoplayTimeout = setTimeout(() => {
			this.setActive(this.getNextIndex());
			this.runAutoPlay();
		}, this.autoplay.delay);
	};

	private addListenersForTabs = () => {
		this.tabsWrapper.addEventListener('click', this.clickHandler);
		window.addEventListener('keyup', this.keyupHandler);
	};

	private clickHandler = (event: MouseEvent) => {
		this.stopAutoPlay();
		const { targetIndex, targetButton } = this.getEventDetails(event);
		if (targetIndex !== undefined && this.tabs.includes(targetButton)) {
			this.setActive(+targetIndex);
		}
	};

	private keyupHandler = (event: KeyboardEvent) => {
		const eventDetails: EventDetailsModel = this.getEventDetails(event);
		const { targetButton, targetIndex, key } = eventDetails;
		if (targetButton && targetIndex !== undefined && this.tabs.includes(targetButton)) {
			this.stopAutoPlay();
			switch (key) {
			case KEYS.LEFT:
			case KEYS.RIGHT: {
				event.preventDefault();
				if (this.orientation === 'horizontal') {
					this.switchTabOnArrowPress(eventDetails);
				}
				break;
			}
			case KEYS.UP:
			case KEYS.DOWN: {
				event.preventDefault(); // prevent page scroll
				if (this.orientation === 'vertical') {
					this.switchTabOnArrowPress(eventDetails);
				}
				break;
			}
			case KEYS.DELETE: {
				this.deleteTab(eventDetails);
				break;
			}
			case KEYS.ENTER || KEYS.SPACE: {
				this.setActive(+targetIndex);
				break;
			}
			case KEYS.END: {
				event.preventDefault(); // prevent page scroll
				this.focusTab(this.getLastIndex());
				break;
			}
			case KEYS.HOME: {
				event.preventDefault(); // prevent page scroll
				this.focusTab(0);
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

	private focusTab = (order: number) => {
		this.tabs[order].focus();
	};

	// When a tablist is aria-orientation is set to vertical, only up and down arrow
	// should function. In all other cases only left and right arrow function.
	private switchTabOnArrowPress = (eventDetails: EventDetailsModel) => {
		const { key, targetIndex } = eventDetails;
		switch (key) {
		case KEYS.LEFT:
		case KEYS.UP: {
			if (targetIndex !== undefined) {
				this.focusTab(targetIndex - 1 < 0
					? this.getLastIndex() : targetIndex - 1);
			}
			break;
		}
		case KEYS.RIGHT:
		case KEYS.DOWN: {
			if (targetIndex !== undefined) {
				this.focusTab(targetIndex >= this.getLastIndex()
					? 0 : targetIndex + 1);
			}
			break;
		}
		default: {
			break;
		}
		}
	};

	// Deletes a tab and its panel
	private deleteTab = (eventDetails: EventDetailsModel) => {
		const { targetButton, targetIndex } = eventDetails;
		if (targetButton.dataset.deletable && targetIndex !== undefined) {
			this.tabs[targetIndex].remove();
			this.panels[targetIndex].remove();
			const newTabsLength = this.tabs.length - 1;
			if (targetIndex < this.currentActive) {
				this.setActive(targetIndex);
			} else if (targetIndex >= this.currentActive) {
				if (targetIndex === newTabsLength || targetIndex === newTabsLength) {
					this.setActive(targetIndex - 1);
				} else {
					this.setActive(targetIndex);
				}
			}
			this.update();
		}
	};

	private assigningTabsAttributes = () => {
		this.tabsWrapper.setAttribute('aria-orientation', this.orientation);
		this.tabs.forEach((tab, index) => {
			tab.setAttribute('aria-label', `${index}`);
			tab.setAttribute('role', this.defaultRoles.tab);
			tab.setAttribute('id', `${this.randomId}-tab-${index}`);
			tab.setAttribute('aria-controls', `${this.randomId}-tabpanel-${index}`);
			// eslint-disable-next-line no-param-reassign
			tab.dataset.deletable = `${this.deletableTabs}`;
			this.panels[index].setAttribute('aria-labelledby', `${this.randomId}-tab-${index}`);
			this.panels[index].setAttribute('id', `${this.randomId}-tabpanel-${index}`);
			this.panels[index].setAttribute('aria-label', `${index}`);
			this.panels[index].setAttribute('role', this.defaultRoles.tabpanel);
		});
	};

	private getEventDetails = (event: KeyboardEvent | MouseEvent): EventDetailsModel => {
		const key = event instanceof KeyboardEvent ? event.key : undefined;
		const target = event.target as HTMLElement;
		const targetTab = target.closest(this.defaultSelectors.tab) as HTMLElement;
		const targetIndex = targetTab?.getAttribute('aria-label');
		return {
			target,
			targetIndex: targetIndex ? +targetIndex : undefined,
			targetButton: targetTab,
			key,
			event,
		};
	};

	public update = () => {
		this.init();
		this.assigningTabsAttributes();
	};
}

